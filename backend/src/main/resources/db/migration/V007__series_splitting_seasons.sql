-- V007 - Dizi sezon/bölüm modeli: season, episode, user_episode_progress.


-- ---------------------------------------------------------------------------
-- Tablolar
-- ---------------------------------------------------------------------------

-- media'ya bileşik FK ile bağlı: media_type + CHECK ikilisi bir filme sezon
-- asılmasını engelliyor (bkz. V003). episode_count sağlayıcının bildirdiği
-- sayıdır, count(episode) ile aynı şey değil (bkz. README §7).
CREATE TABLE season (
    id            bigserial  NOT NULL,
    media_id      bigint     NOT NULL,
    media_type    media_type NOT NULL DEFAULT 'series',
    season_number smallint   NOT NULL,
    episode_count smallint,
    CONSTRAINT pk_season PRIMARY KEY (id)
);


-- Ayrıca media_type taşımaz: season zaten 'series' dışına asılamıyor.
-- tmdb_episode_id yeniden import'ta eşleştirme anahtarı.
CREATE TABLE episode (
    id              bigserial    NOT NULL,
    season_id       bigint       NOT NULL,
    episode_number  smallint     NOT NULL,
    title           varchar(300),
    air_date        date,
    runtime_min     smallint,
    tmdb_episode_id integer,
    CONSTRAINT pk_episode PRIMARY KEY (id)
);


-- series_progress'in yerine: satır gerçek bir bölüme bağlanıyor ve puan
-- taşıyabiliyor. watched_at NULL = izlenmedi. rating numeric(2,1) değil,
-- çünkü o tip 10.0 taşıyamıyor (bkz. README §2).
CREATE TABLE user_episode_progress (
    user_id    bigint       NOT NULL,
    episode_id bigint       NOT NULL,
    watched_at timestamptz,
    rating     numeric(3,1),
    CONSTRAINT pk_user_episode_progress PRIMARY KEY (user_id, episode_id)
);


-- ---------------------------------------------------------------------------
-- UNIQUE kısıtları
-- ---------------------------------------------------------------------------

-- İlk ikisi aynı zamanda FK index'i görevi görüyor. tmdb_episode_id global
-- benzersiz; mükerrer satır import'un iki kez koştuğunu gösterir, NULL'lar
-- etkilenmez.
ALTER TABLE season
    ADD CONSTRAINT uq_season_media_id_season_number UNIQUE (media_id, season_number);

ALTER TABLE episode
    ADD CONSTRAINT uq_episode_season_id_episode_number UNIQUE (season_id, episode_number);

ALTER TABLE episode
    ADD CONSTRAINT uq_episode_tmdb_episode_id UNIQUE (tmdb_episode_id);


-- ---------------------------------------------------------------------------
-- FOREIGN KEY kısıtları
-- ---------------------------------------------------------------------------

-- season/episode metadata: detail tabloları gibi CASCADE. episode RESTRICT'i
-- ise kaldırılan series_progress.media_id RESTRICT'inin karşılığı — kullanıcı
-- verisi duran media hard delete edilemesin.
ALTER TABLE season
    ADD CONSTRAINT fk_season_media
    FOREIGN KEY (media_id, media_type) REFERENCES media (id, media_type)
    ON DELETE CASCADE;

ALTER TABLE episode
    ADD CONSTRAINT fk_episode_season
    FOREIGN KEY (season_id) REFERENCES season (id) ON DELETE CASCADE;

ALTER TABLE user_episode_progress
    ADD CONSTRAINT fk_user_episode_progress_user
    FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE;

ALTER TABLE user_episode_progress
    ADD CONSTRAINT fk_user_episode_progress_episode
    FOREIGN KEY (episode_id) REFERENCES episode (id) ON DELETE RESTRICT;


-- ---------------------------------------------------------------------------
-- CHECK kısıtları
-- ---------------------------------------------------------------------------

-- Alt tip kilidi + sayı aralıkları. Sezon/bölüm numarası 0 olabilir (özel
-- bölümler). rating log_entry ile aynı skala: 0-10, 0.5 adımlı; trunc koşulu
-- 7.3 gibi ara değerleri eler.
ALTER TABLE season
    ADD CONSTRAINT ck_season_media_type CHECK (media_type = 'series');
ALTER TABLE season
    ADD CONSTRAINT ck_season_season_number_non_negative
    CHECK (season_number >= 0);
ALTER TABLE season
    ADD CONSTRAINT ck_season_episode_count_non_negative
    CHECK (episode_count IS NULL OR episode_count >= 0);

ALTER TABLE episode
    ADD CONSTRAINT ck_episode_episode_number_non_negative
    CHECK (episode_number >= 0);
ALTER TABLE episode
    ADD CONSTRAINT ck_episode_runtime_min_positive
    CHECK (runtime_min IS NULL OR runtime_min > 0);
ALTER TABLE episode
    ADD CONSTRAINT ck_episode_tmdb_episode_id_positive
    CHECK (tmdb_episode_id IS NULL OR tmdb_episode_id > 0);

ALTER TABLE user_episode_progress
    ADD CONSTRAINT ck_user_episode_progress_rating_scale
    CHECK (
        rating IS NULL
        OR (rating >= 0 AND rating <= 10 AND (rating * 2) = trunc(rating * 2))
    );


-- ---------------------------------------------------------------------------
-- Index'ler
-- ---------------------------------------------------------------------------

-- season(media_id) ve episode(season_id) için index yok: UNIQUE kısıtlarının
-- ilk kolonu. episode_id ise PK'nin ilk kolonu değil, RESTRICT kontrolü onsuz
-- tam tarama yapar. Partial ikili "son izlenenler" ve takvim sorguları için.
CREATE INDEX ix_user_episode_progress_episode_id
    ON user_episode_progress (episode_id);

CREATE INDEX ix_user_episode_progress_watched
    ON user_episode_progress (user_id, watched_at DESC)
    WHERE watched_at IS NOT NULL;

CREATE INDEX ix_episode_air_date ON episode (air_date) WHERE air_date IS NOT NULL;


-- ---------------------------------------------------------------------------
-- series_progress -> user_episode_progress taşıması
-- ---------------------------------------------------------------------------

-- Eski satırlar gerçek bir episode.id istiyor, episode ise boş. Önce iskelet
-- üretiliyor: kullanıcı o bölümü izlediyse o bölüm vardır. episode_count
-- doldurulmuyor; o kolon sağlayıcı verisi, iskeletin satır sayısı değil.
INSERT INTO season (media_id, season_number)
SELECT DISTINCT sp.media_id, sp.season_no
FROM series_progress sp;

INSERT INTO episode (season_id, episode_number)
SELECT DISTINCT s.id, sp.episode_no
FROM series_progress sp
JOIN season s
    ON s.media_id = sp.media_id
   AND s.season_number = sp.season_no;

-- series_progress PK'si mükerrer satır üretilmesini engelliyor.
INSERT INTO user_episode_progress (user_id, episode_id, watched_at)
SELECT sp.user_id, e.id, sp.watched_at
FROM series_progress sp
JOIN season s
    ON s.media_id = sp.media_id
   AND s.season_number = sp.season_no
JOIN episode e
    ON e.season_id = s.id
   AND e.episode_number = sp.episode_no;


-- ---------------------------------------------------------------------------
-- Yerini alan yapıların kaldırılması
-- ---------------------------------------------------------------------------

-- Veri yukarıda taşındı; kısıtlar ve V004'teki index tablo ile düşer.
-- series_detail sayaçları artık türetilebilir, karşılığı aşağıdaki view.
DROP TABLE series_progress;

ALTER TABLE series_detail
    DROP COLUMN season_count,
    DROP COLUMN episode_count;

CREATE VIEW series_episode_stats AS
SELECT s.media_id,
       count(DISTINCT s.id) AS season_count,
       count(e.id)          AS episode_count
FROM season s
LEFT JOIN episode e ON e.season_id = s.id
GROUP BY s.media_id;
