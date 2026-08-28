-- TMDB bir film icin birden fazla yapim ulkesi dondurebilir. V1 modeli
-- yalnizca tek ulke kodu sakladigi icin eksik/yaniltici veri uretiyordu.
-- Ulke bilgisi V1 film kapsamina dahil degildir.

ALTER TABLE film_detail
    DROP CONSTRAINT ck_film_detail_country_format,
    DROP COLUMN country,
    ALTER COLUMN director TYPE text;

ALTER TABLE media
    DROP CONSTRAINT ck_media_external_identity_pair,
    DROP CONSTRAINT uq_media_provider_external_id,
    DROP COLUMN provider,
    DROP COLUMN external_id;
