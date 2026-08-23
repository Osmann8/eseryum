-- V003 - V1 semasinin butunluk kurallari: UNIQUE, FOREIGN KEY ve CHECK.
--
-- Sira onemli: bilesik yabanci anahtarlarin hedefledigi UNIQUE kisitlar
-- once olusturulmali, yoksa FK "no unique constraint matching given keys"
-- hatasi verir.
--
-- Silme stratejisi (karma):
--   * app_user, review, list  -> soft delete (deleted_at), hard delete beklenmez.
--   * app_user hard delete edilirse ona bagli tureyen veri CASCADE ile gider.
--   * media -> hicbir zaman hard delete edilmemeli; onu referans eden
--     kullanici verisi (log_entry, list_item, user_media_status,
--     series_progress) RESTRICT. Istisna, parent'i olmadan anlami olmayan
--     metadata satirlari: 1:1 detail tablolari ve media_genre CASCADE.


-- ---------------------------------------------------------------------------
-- UNIQUE kisitlari
-- ---------------------------------------------------------------------------

-- Kullanici adi ve e-posta citext oldugu icin bu benzersizlik buyuk-kucuk
-- harf duyarsizdir: "Osman" ile "osman" ayni hesaptir.
ALTER TABLE app_user
    ADD CONSTRAINT uq_app_user_username UNIQUE (username);
ALTER TABLE app_user
    ADD CONSTRAINT uq_app_user_email UNIQUE (email);

-- id zaten PK oldugu icin teknik olarak redundant. Amaci veri degil sema:
-- detail tablolarindaki bilesik FK'nin hedefleyebilecegi bir aday anahtar
-- saglar. Supertype/subtype butunlugu bunun uzerine kuruluyor.
ALTER TABLE media
    ADD CONSTRAINT uq_media_id_media_type UNIQUE (id, media_type);

ALTER TABLE book_detail
    ADD CONSTRAINT uq_book_detail_isbn13 UNIQUE (isbn13);

ALTER TABLE genre
    ADD CONSTRAINT uq_genre_slug UNIQUE (slug);

-- review.log_entry_id doluysa, isaret ettigi log kaydinin ayni kullaniciya
-- ve ayni medyaya ait oldugunu garanti edecek bilesik FK'nin hedefi.
ALTER TABLE log_entry
    ADD CONSTRAINT uq_log_entry_id_user_id_media_id UNIQUE (id, user_id, media_id);

-- Siralanmis listelerde iki eser ayni sirada olmasin. DEFERRABLE INITIALLY
-- DEFERRED sart: aksi halde tek transaction icinde yeniden siralama
-- (ornegin 2 ve 3'un yer degistirmesi) ara adimda catisir ve imkansiz olur.
ALTER TABLE list_item
    ADD CONSTRAINT uq_list_item_list_id_position UNIQUE (list_id, position)
    DEFERRABLE INITIALLY DEFERRED;


-- ---------------------------------------------------------------------------
-- FOREIGN KEY kisitlari
-- ---------------------------------------------------------------------------

-- Mukerrer kayit birlestirme zinciri. RESTRICT: hedef kayit silinerek
-- yonlendirme kirilmasin.
ALTER TABLE media
    ADD CONSTRAINT fk_media_merged_into_media
    FOREIGN KEY (merged_into_id) REFERENCES media (id) ON DELETE RESTRICT;

-- Supertype butunlugu: (media_id, media_type) ciftini media'ya baglamak,
-- ck_film_detail_media_type ile birlikte "film_detail satiri yalnizca
-- media_type = 'film' olan bir media satirina asilabilir" kuralini
-- trigger'siz, tamamen declarative sekilde zorlar. Ayrica media satirinin
-- turu sonradan degistirilemez hale gelir: media_type UPDATE'i bu FK'yi
-- ihlal eder.
ALTER TABLE film_detail
    ADD CONSTRAINT fk_film_detail_media
    FOREIGN KEY (media_id, media_type) REFERENCES media (id, media_type)
    ON DELETE CASCADE;

ALTER TABLE series_detail
    ADD CONSTRAINT fk_series_detail_media
    FOREIGN KEY (media_id, media_type) REFERENCES media (id, media_type)
    ON DELETE CASCADE;

ALTER TABLE book_detail
    ADD CONSTRAINT fk_book_detail_media
    FOREIGN KEY (media_id, media_type) REFERENCES media (id, media_type)
    ON DELETE CASCADE;

-- Tur atamasi kullanici verisi degil, siniflandirma metadata'si: parent
-- satiri olmadan anlami yok, bu yuzden detail tablolari gibi CASCADE.
-- RESTRICT olsaydi neredeyse her media satirinin bir tur atamasi
-- olacagindan hic loglanmamis cop bir kayit bile silinemez, dolayisiyla
-- detail tablolarindaki CASCADE hicbir zaman ateslenemezdi.
ALTER TABLE media_genre
    ADD CONSTRAINT fk_media_genre_media
    FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE;
-- Tur sozlugunden bir kayit silinirse eserlerdeki etiket de gider;
-- baglanti satirinin tek basina anlami yok.
ALTER TABLE media_genre
    ADD CONSTRAINT fk_media_genre_genre
    FOREIGN KEY (genre_id) REFERENCES genre (id) ON DELETE CASCADE;

ALTER TABLE log_entry
    ADD CONSTRAINT fk_log_entry_user
    FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE;
ALTER TABLE log_entry
    ADD CONSTRAINT fk_log_entry_media
    FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE RESTRICT;

ALTER TABLE review
    ADD CONSTRAINT fk_review_user
    FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE;
ALTER TABLE review
    ADD CONSTRAINT fk_review_media
    FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE RESTRICT;
-- Bilesik FK: log_entry_id doluysa o log kaydi review ile ayni kullaniciya
-- ve ayni medyaya ait olmak zorunda. NULL log_entry_id'de (MATCH SIMPLE)
-- kisit hic devreye girmez, yani baglanti opsiyonel kalir.
-- ON DELETE SET NULL yalnizca log_entry_id kolonunu bosaltir (PostgreSQL 15+
-- kolon listeli sozdizimi); user_id/media_id NOT NULL oldugu icin tumunu
-- bosaltan klasik SET NULL burada calismazdi.
ALTER TABLE review
    ADD CONSTRAINT fk_review_log_entry
    FOREIGN KEY (log_entry_id, user_id, media_id)
    REFERENCES log_entry (id, user_id, media_id)
    ON DELETE SET NULL (log_entry_id);

ALTER TABLE user_media_status
    ADD CONSTRAINT fk_user_media_status_user
    FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE;
ALTER TABLE user_media_status
    ADD CONSTRAINT fk_user_media_status_media
    FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE RESTRICT;

ALTER TABLE series_progress
    ADD CONSTRAINT fk_series_progress_user
    FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE;
-- Detail tablolarindaki ile ayni yontem: bolum ilerlemesi yalnizca
-- media_type = 'series' olan bir media satirina yazilabilir.
ALTER TABLE series_progress
    ADD CONSTRAINT fk_series_progress_media
    FOREIGN KEY (media_id, media_type) REFERENCES media (id, media_type)
    ON DELETE RESTRICT;

ALTER TABLE list
    ADD CONSTRAINT fk_list_user
    FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE;

ALTER TABLE list_item
    ADD CONSTRAINT fk_list_item_list
    FOREIGN KEY (list_id) REFERENCES list (id) ON DELETE CASCADE;
ALTER TABLE list_item
    ADD CONSTRAINT fk_list_item_media
    FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE RESTRICT;

ALTER TABLE follow
    ADD CONSTRAINT fk_follow_follower
    FOREIGN KEY (follower_id) REFERENCES app_user (id) ON DELETE CASCADE;
ALTER TABLE follow
    ADD CONSTRAINT fk_follow_followee
    FOREIGN KEY (followee_id) REFERENCES app_user (id) ON DELETE CASCADE;

ALTER TABLE taste_overlap
    ADD CONSTRAINT fk_taste_overlap_user_a
    FOREIGN KEY (user_a_id) REFERENCES app_user (id) ON DELETE CASCADE;
ALTER TABLE taste_overlap
    ADD CONSTRAINT fk_taste_overlap_user_b
    FOREIGN KEY (user_b_id) REFERENCES app_user (id) ON DELETE CASCADE;


-- ---------------------------------------------------------------------------
-- CHECK kisitlari
-- ---------------------------------------------------------------------------

-- Kendine isaret eden birlestirme sonsuz donguye yol acardi.
ALTER TABLE media
    ADD CONSTRAINT ck_media_merged_into_not_self
    CHECK (merged_into_id IS NULL OR merged_into_id <> id);

-- Matbaanin yayginlasmasindan makul bir gelecege kadar. Amac veri girisi
-- hatasini (yil yerine sayfa sayisi, 20255 gibi) yakalamak.
ALTER TABLE media
    ADD CONSTRAINT ck_media_release_year
    CHECK (release_year IS NULL OR release_year BETWEEN 1450 AND 2100);

-- Puan skalasi 0-10. Ortalama, hic puan yoksa NULL kalir.
ALTER TABLE media
    ADD CONSTRAINT ck_media_rating_avg_range
    CHECK (rating_avg IS NULL OR (rating_avg >= 0 AND rating_avg <= 10));

-- Denormalize sayac negatif olamaz; olduysa guncelleme mantigi bozuktur.
ALTER TABLE media
    ADD CONSTRAINT ck_media_rating_count_non_negative
    CHECK (rating_count >= 0);

-- Alt tip kilidi: FK ile birlikte film_detail satirinin baska bir turdeki
-- media'ya baglanmasini imkansiz kilar.
ALTER TABLE film_detail
    ADD CONSTRAINT ck_film_detail_media_type CHECK (media_type = 'film');
ALTER TABLE film_detail
    ADD CONSTRAINT ck_film_detail_runtime_min_positive
    CHECK (runtime_min IS NULL OR runtime_min > 0);
-- ISO 3166-1 alpha-2, buyuk harf. Formati zorlamazsak 'TUR', 'tr' ve
-- 'Turkiye' ayni kolonda birikir.
ALTER TABLE film_detail
    ADD CONSTRAINT ck_film_detail_country_format
    CHECK (country IS NULL OR country ~ '^[A-Z]{2}$');
-- ISO 639-1, kucuk harf.
ALTER TABLE film_detail
    ADD CONSTRAINT ck_film_detail_original_lang_format
    CHECK (original_lang IS NULL OR original_lang ~ '^[a-z]{2}$');

ALTER TABLE series_detail
    ADD CONSTRAINT ck_series_detail_media_type CHECK (media_type = 'series');
ALTER TABLE series_detail
    ADD CONSTRAINT ck_series_detail_season_count_positive
    CHECK (season_count IS NULL OR season_count > 0);
ALTER TABLE series_detail
    ADD CONSTRAINT ck_series_detail_episode_count_positive
    CHECK (episode_count IS NULL OR episode_count > 0);
ALTER TABLE series_detail
    ADD CONSTRAINT ck_series_detail_original_lang_format
    CHECK (original_lang IS NULL OR original_lang ~ '^[a-z]{2}$');

ALTER TABLE book_detail
    ADD CONSTRAINT ck_book_detail_media_type CHECK (media_type = 'book');
ALTER TABLE book_detail
    ADD CONSTRAINT ck_book_detail_page_count_positive
    CHECK (page_count IS NULL OR page_count > 0);
-- Tire/bosluk iceren ISB numaralari normalize edilmeden yazilmasin;
-- benzersizlik ancak tek bir formatta anlamli.
ALTER TABLE book_detail
    ADD CONSTRAINT ck_book_detail_isbn13_format
    CHECK (isbn13 IS NULL OR isbn13 ~ '^[0-9]{13}$');
ALTER TABLE book_detail
    ADD CONSTRAINT ck_book_detail_original_lang_format
    CHECK (original_lang IS NULL OR original_lang ~ '^[a-z]{2}$');

-- 0-10 arasi ve 0.5 adimli. trunc(rating * 2) = rating * 2 kosulu
-- 7.3 gibi ara degerleri eler; arayuzdeki yarim yildiz mantigi ile
-- veritabani ayni skalayi konusur.
ALTER TABLE log_entry
    ADD CONSTRAINT ck_log_entry_rating_scale
    CHECK (
        rating IS NULL
        OR (rating >= 0 AND rating <= 10 AND (rating * 2) = trunc(rating * 2))
    );

ALTER TABLE series_progress
    ADD CONSTRAINT ck_series_progress_media_type CHECK (media_type = 'series');
-- 0. sezon = ozel bolumler, bu yuzden > 0 degil >= 0.
ALTER TABLE series_progress
    ADD CONSTRAINT ck_series_progress_season_no_non_negative
    CHECK (season_no >= 0);
ALTER TABLE series_progress
    ADD CONSTRAINT ck_series_progress_episode_no_non_negative
    CHECK (episode_no >= 0);

-- Kendini takip eden kullanici akista kendi girdilerini gorur ve takipci
-- sayilarini bozar.
ALTER TABLE follow
    ADD CONSTRAINT ck_follow_no_self_follow CHECK (follower_id <> followee_id);

-- Cift sirasi sabit: (3, 7) yazilir, (7, 3) yazilamaz. Ayni ciftin iki
-- yonlu mukerrer satiri boylece PK ile birlikte imkansiz hale gelir.
ALTER TABLE taste_overlap
    ADD CONSTRAINT ck_taste_overlap_user_order CHECK (user_a_id < user_b_id);
-- Korelasyon negatif olabilir; 0-1 araligi yanlis olurdu.
ALTER TABLE taste_overlap
    ADD CONSTRAINT ck_taste_overlap_score_range
    CHECK (score >= -1 AND score <= 1);
ALTER TABLE taste_overlap
    ADD CONSTRAINT ck_taste_overlap_shared_count_non_negative
    CHECK (shared_count >= 0);
