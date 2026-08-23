-- V002 - V1 cekirdek tablolari (kolonlar, NOT NULL, DEFAULT, birincil anahtarlar).
--
-- Yabanci anahtarlar, UNIQUE ve CHECK kisitlari bilerek V003'e birakildi:
-- olusturma sirasi kisitlanmasin ve tum butunluk kurallari tek dosyada
-- okunabilsin.
--
-- ER diyagramindaki solid (V1) entity'ler bu dosyada. Roadmap tablolari
-- (import_job, direct_message, community, community_member, chat_session,
-- chat_message) bilerek olusturulmuyor.


-- app_user: platformun kimlik tablosu. Silme stratejisi soft delete
-- (deleted_at): kullanici silinse bile ona bagli log/review/list satirlarinin
-- referans butunlugu bozulmasin ve hesap geri alinabilsin.
CREATE TABLE app_user (
    id            bigserial    NOT NULL,
    username      citext       NOT NULL,
    email         citext       NOT NULL,
    password_hash text         NOT NULL,
    display_name  varchar(80)  NOT NULL,
    bio           varchar(400),
    avatar_url    text,
    locale        char(5)      NOT NULL DEFAULT 'tr-TR',
    created_at    timestamptz  NOT NULL DEFAULT now(),
    updated_at    timestamptz  NOT NULL DEFAULT now(),
    -- Soft delete isareti. NULL = aktif hesap. Uygulama katmani her sorguya
    -- "deleted_at IS NULL" filtresini eklemek zorunda (bkz. README).
    deleted_at    timestamptz,
    CONSTRAINT pk_app_user PRIMARY KEY (id)
);


-- media: film / dizi / kitap icin ortak supertype. Ortama ozgu alanlar
-- 1:1 detail tablolarinda durur; buradaki media_type hangi detail
-- tablosunun dolu olacagini belirler.
CREATE TABLE media (
    id             bigserial     NOT NULL,
    -- Ayrimci (discriminator) kolon. V003'teki bilesik FK'ler sayesinde
    -- detail tablosunun turu ile burasi kalici olarak ayni kalir.
    media_type     media_type    NOT NULL,
    title          varchar(300)  NOT NULL,
    original_title varchar(300),
    release_year   smallint,
    cover_url      text,
    synopsis       text,
    -- Denormalize ortalama puan. 0-10 skalasi numeric(3,2)'ye sigmiyordu
    -- (max 9.99), numeric(4,2) yapildi. Trigger ile degil, servis/batch
    -- katmaninda guncellenir (bkz. README).
    rating_avg     numeric(4,2),
    rating_count   integer       NOT NULL DEFAULT 0,
    -- Mukerrer kayit birlestirme. Doluysa bu satir artik canonical degildir;
    -- sorgular merged_into_id'nin gosterdigi kayda yonlenmelidir. Simdi
    -- eklemek ucuz, sonradan eklemek tum sorgulari dolasmak demek.
    merged_into_id bigint,
    created_at     timestamptz   NOT NULL DEFAULT now(),
    updated_at     timestamptz   NOT NULL DEFAULT now(),
    CONSTRAINT pk_media PRIMARY KEY (id)
);


-- film_detail: media'nin film uzantisi (1:1). media_id hem PK hem FK.
-- media_type kolonu ilk bakista gereksiz gorunur, ama supertype
-- butunlugunu trigger'siz zorlamanin tek declarative yolu (bkz. V003).
CREATE TABLE film_detail (
    media_id      bigint        NOT NULL,
    media_type    media_type    NOT NULL,
    runtime_min   smallint,
    director      varchar(160),
    country       char(2),
    -- Yapim ulkesi ile orijinal dil ayni sey degil: Belcika yapimi
    -- Ingilizce bir filmde country = 'BE', original_lang = 'en'.
    original_lang char(2),
    tmdb_id       integer,
    CONSTRAINT pk_film_detail PRIMARY KEY (media_id)
);


-- series_detail: media'nin dizi uzantisi (1:1).
CREATE TABLE series_detail (
    media_id       bigint        NOT NULL,
    media_type     media_type    NOT NULL,
    season_count   smallint,
    episode_count  smallint,
    status         series_status NOT NULL,
    first_air_year smallint,
    original_lang  char(2),
    tmdb_id        integer,
    CONSTRAINT pk_series_detail PRIMARY KEY (media_id)
);


-- book_detail: media'nin kitap uzantisi (1:1).
CREATE TABLE book_detail (
    media_id      bigint        NOT NULL,
    media_type    media_type    NOT NULL,
    page_count    integer,
    translator    varchar(160),
    publisher     varchar(160),
    edition_name  varchar(120),
    -- Baski basina benzersiz: farkli ceviri/baski zaten ayri bir media
    -- satiridir, bu yuzden isbn13 global UNIQUE olabilir.
    isbn13        char(13),
    original_lang char(2),
    CONSTRAINT pk_book_detail PRIMARY KEY (media_id)
);


-- genre: ortamdan bagimsiz tur sozlugu. slug teknik anahtar,
-- name_tr arayuzde gosterilen etiket.
CREATE TABLE genre (
    id      smallserial NOT NULL,
    slug    varchar(48) NOT NULL,
    name_tr varchar(64) NOT NULL,
    CONSTRAINT pk_genre PRIMARY KEY (id)
);


-- media_genre: media <-> genre cok-a-cok baglantisi.
CREATE TABLE media_genre (
    media_id bigint   NOT NULL,
    genre_id smallint NOT NULL,
    CONSTRAINT pk_media_genre PRIMARY KEY (media_id, genre_id)
);


-- log_entry: bir kullanicinin bir eseri izleme/okuma kaydi. Ayni
-- (user, media) icin birden fazla satir olabilir; tekrar izleme/okuma
-- kendi tarihi ve puani ile ayri satirdir. Guncel durum
-- user_media_status'ta tutulur.
CREATE TABLE log_entry (
    id         bigserial    NOT NULL,
    user_id    bigint       NOT NULL,
    media_id   bigint       NOT NULL,
    -- 0-10 arasi, 0.5 adimli puan. numeric(2,1) max 9.9 tasidigi icin
    -- 10.0 girilemiyordu; numeric(3,1) yapildi. Puansiz log mumkun (NULL).
    rating     numeric(3,1),
    logged_on  date         NOT NULL DEFAULT current_date,
    is_replay  boolean      NOT NULL DEFAULT false,
    note       varchar(500),
    created_at timestamptz  NOT NULL DEFAULT now(),
    updated_at timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT pk_log_entry PRIMARY KEY (id)
);


-- review: uzun metinli inceleme. Bir log_entry'ye baglanabilir (opsiyonel);
-- baglandiginda o kaydin ayni kullaniciya ve ayni medyaya ait oldugu
-- V003'teki bilesik FK ile garanti edilir.
CREATE TABLE review (
    id           bigserial   NOT NULL,
    user_id      bigint      NOT NULL,
    media_id     bigint      NOT NULL,
    log_entry_id bigint,
    body         text        NOT NULL,
    has_spoiler  boolean     NOT NULL DEFAULT false,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    -- Soft delete: silinen inceleme moderasyon ve itiraz icin saklanir.
    deleted_at   timestamptz,
    CONSTRAINT pk_review PRIMARY KEY (id)
);


-- user_media_status: kullanicinin bir eserdeki guncel durumu. (user, media)
-- basina tek satir; gecmis log_entry'de durur.
CREATE TABLE user_media_status (
    user_id    bigint       NOT NULL,
    media_id   bigint       NOT NULL,
    status     track_status NOT NULL,
    updated_at timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT pk_user_media_status PRIMARY KEY (user_id, media_id)
);


-- series_progress: bolum bazli ilerleme. media_type kolonu burada da var:
-- bir filme veya kitaba bolum ilerlemesi yazilmasini engelleyen tek sey
-- V003'teki bilesik FK + CHECK ikilisi.
CREATE TABLE series_progress (
    user_id    bigint      NOT NULL,
    media_id   bigint      NOT NULL,
    media_type media_type  NOT NULL,
    -- Sezon 0 gecerli: ozel bolumler (specials) genelde 0. sezonda toplanir.
    season_no  smallint    NOT NULL,
    episode_no smallint    NOT NULL,
    watched_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT pk_series_progress PRIMARY KEY (user_id, media_id, season_no, episode_no)
);


-- list: kullanicinin olusturdugu eser listesi. is_ranked true ise
-- list_item.position anlamli bir siradir.
CREATE TABLE list (
    id          bigserial    NOT NULL,
    user_id     bigint       NOT NULL,
    title       varchar(160) NOT NULL,
    description text,
    is_ranked   boolean      NOT NULL DEFAULT false,
    -- Varsayilan acik: listeler paylasilmak icin var.
    is_public   boolean      NOT NULL DEFAULT true,
    created_at  timestamptz  NOT NULL DEFAULT now(),
    updated_at  timestamptz  NOT NULL DEFAULT now(),
    -- Soft delete: silinen listenin paylasilmis baglantisi aniden yok
    -- olmasin, uygulama "bu liste kaldirildi" diyebilsin.
    deleted_at  timestamptz,
    CONSTRAINT pk_list PRIMARY KEY (id)
);


-- list_item: listedeki tek eser. position NOT NULL: siralanmamis
-- listelerde de deterministik bir sira gerekiyor ve UNIQUE kisiti
-- NULL degerler uzerinde calismaz.
CREATE TABLE list_item (
    list_id  bigint       NOT NULL,
    media_id bigint       NOT NULL,
    position smallint     NOT NULL,
    note     varchar(240),
    CONSTRAINT pk_list_item PRIMARY KEY (list_id, media_id)
);


-- follow: tek yonlu takip iliskisi (app_user uzerinde self-referencing).
CREATE TABLE follow (
    follower_id bigint      NOT NULL,
    followee_id bigint      NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT pk_follow PRIMARY KEY (follower_id, followee_id)
);


-- taste_overlap: batch ile hesaplanan zevk benzerligi. Sirasiz cift basina
-- tek satir tutulur; hangi kullanicinin once yazilacagi V003'teki
-- ck_taste_overlap_user_order ile sabitlenir.
CREATE TABLE taste_overlap (
    user_a_id    bigint       NOT NULL,
    user_b_id    bigint       NOT NULL,
    -- Korelasyon skoru: -1 (zit zevk) ile 1 (ayni zevk) arasi.
    score        numeric(4,3) NOT NULL,
    -- Skorun hesaplandigi ortak puanlanmis eser sayisi.
    shared_count integer      NOT NULL,
    computed_at  timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT pk_taste_overlap PRIMARY KEY (user_a_id, user_b_id)
);
