-- TMDB bir film icin birden fazla yapim ulkesi dondurebilir. V1 modeli
-- yalnizca tek ulke kodu sakladigi icin eksik/yaniltici veri uretiyordu.
-- Ulke bilgisi V1 film kapsamina dahil degildir.

ALTER TABLE film_detail
    DROP CONSTRAINT ck_film_detail_country_format,
    DROP COLUMN country,
    ALTER COLUMN director TYPE text,
    ADD COLUMN imdb_id varchar(16),
    ADD COLUMN imdb_rating numeric(3,1),
    ADD COLUMN imdb_rating_count integer NOT NULL DEFAULT 0;

ALTER TABLE film_detail
    ADD CONSTRAINT ck_film_detail_imdb_id_format
        CHECK (imdb_id IS NULL OR imdb_id ~ '^tt[0-9]+$'),
    ADD CONSTRAINT ck_film_detail_imdb_rating_range
        CHECK (imdb_rating IS NULL OR (imdb_rating >= 0 AND imdb_rating <= 10)),
    ADD CONSTRAINT ck_film_detail_imdb_rating_count_non_negative
        CHECK (imdb_rating_count >= 0);
