-- Sezon bilgileri ayrı bir tabloya taşınıyor. Bu sayede bir dizinin sezon sayısı ve bölümleri daha kolay yönetilebilecek.
SEASON
  id              bigserial PK
  media_id        bigint FK -> MEDIA.id
  season_number   smallint
  episode_count   smallint        -- cache, bkz. aşağıdaki risk notu
  UNIQUE(media_id, season_number)

-- Bölüm bilgileri ayrı bir tabloya taşınıyor. Bu sayede bir dizinin bölümleri daha kolay yönetilebilecek.
EPISODE
  id              bigserial PK
  season_id       bigint FK -> SEASON.id
  episode_number  smallint
  title           varchar(300)
  air_date        date
  runtime_min     smallint
  tmdb_episode_id integer
  UNIQUE(season_id, episode_number)

-- Kullanıcıların izleme bilgileri ayrı bir tabloya taşınıyor. Bu sayede kullanıcıların izleme geçmişi ve bölüm bazlı puanlamaları daha kolay yönetilebilecek.
USER_EPISODE_PROGRESS
  user_id         bigint FK -> "USER".id
  episode_id      bigint FK -> EPISODE.id
  watched_at      timestamptz  NULL = izlenmedi
  rating          numeric(2,1) NULL  -- bölüm bazlı puan
  PRIMARY KEY (user_id, episode_id)