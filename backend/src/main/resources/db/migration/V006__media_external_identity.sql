-- Media CRUD API'sinin sağlayıcı kimliğini ve daha ayrıntılı görsel/tarih
-- alanlarını saklar. V001-V005 develop'a girdikten sonra değiştirilmediği için
-- genişletme ayrı bir migration olarak uygulanır.

ALTER TABLE media
    ADD COLUMN provider varchar(30),
    ADD COLUMN external_id varchar(255),
    ADD COLUMN release_date date,
    ADD COLUMN backdrop_url text;

ALTER TABLE media
    ADD CONSTRAINT ck_media_external_identity_pair
        CHECK ((provider IS NULL) = (external_id IS NULL)),
    ADD CONSTRAINT uq_media_provider_external_id
        UNIQUE (provider, external_id);
