-- Saglayici kimligi artik medya supertype'inin parcasi degildir. Film TMDB
-- kimligini film_detail.tmdb_id alaninda tutar; diger alt tipler kendi
-- saglayici kimliklerini kendi modellerinde yonetir.

ALTER TABLE media
    DROP CONSTRAINT ck_media_external_identity_pair,
    DROP CONSTRAINT uq_media_provider_external_id,
    DROP COLUMN provider,
    DROP COLUMN external_id;
