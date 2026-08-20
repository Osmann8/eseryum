-- V004 - V1 index'leri.
--
-- PostgreSQL yabanci anahtar kolonlarina otomatik index acmaz. Bu, iki
-- yerde acikca canlanir: (1) parent satir silinirken CASCADE/RESTRICT
-- kontrolu child tabloyu bastan sona tarar, (2) "bu medyayi kim
-- puanlamis" gibi ters yonlu sorgular seq scan olur. Asagidaki index'ler
-- ikisini de kapatiyor.
--
-- PK'nin ilk kolonu zaten index'li oldugu icin tekrar edilmiyor:
-- ornegin follow (follower_id) veya list_item (list_id) icin ayri index yok.


-- Kullanicinin gunlugu: "son eklenenler" varsayilan siralama oldugu icin
-- logged_on DESC index'in parcasi.
CREATE INDEX ix_log_entry_user_id_logged_on ON log_entry (user_id, logged_on DESC);
-- Eser detay sayfasindaki "bu eseri loglayanlar" + media RESTRICT kontrolu.
CREATE INDEX ix_log_entry_media_id ON log_entry (media_id);

CREATE INDEX ix_review_media_id ON review (media_id);
CREATE INDEX ix_review_user_id ON review (user_id);

CREATE INDEX ix_list_user_id ON list (user_id);

CREATE INDEX ix_list_item_media_id ON list_item (media_id);

CREATE INDEX ix_media_genre_genre_id ON media_genre (genre_id);

-- Gerekce silme degil, medya birlestirme (media.merged_into_id): mukerrer
-- kayit canonical'a tasinirken tum bagimli satirlar media_id ile bulunur.
-- media_id PK'nin basinda olmadigi icin bu index olmadan tarama tum tabloyu
-- dolasir; series_progress dogasi geregi en hizli buyuyen tablolardan biri
-- (kullanici x dizi x sezon x bolum).
CREATE INDEX ix_series_progress_media_id ON series_progress (media_id);

-- "Beni kim takip ediyor" sorgusu. follower_id PK'nin basinda oldugu icin
-- yalnizca ters yon eksikti.
CREATE INDEX ix_follow_followee_id ON follow (followee_id);

-- Profil sekmeleri: kullanicinin "izleyecekleri", "biten"leri vb.
CREATE INDEX ix_user_media_status_user_id_status ON user_media_status (user_id, status);

-- Cift sirasi user_a_id < user_b_id sabit oldugu icin bir kullanicinin tum
-- eslesmelerini bulmak her iki kolonu da taramayi gerektirir.
CREATE INDEX ix_taste_overlap_user_b_id ON taste_overlap (user_b_id);

-- Kesfet/filtre sayfasi: tur + yil kirilimlari.
CREATE INDEX ix_media_media_type_release_year ON media (media_type, release_year);

-- Baslik aramasi. GIN + trigram, ILIKE '%...%' ve benzerlik sorgularini
-- B-tree'nin yapamadigi sekilde hizlandirir (bkz. V001, pg_trgm).
CREATE INDEX ix_media_title_trgm ON media USING gin (title gin_trgm_ops);

-- Soft delete edilen tablolarda gunluk sorgularin tamami "aktif kayit"
-- sorgusudur. Partial index yalnizca aktif satirlari tuttugu icin hem
-- kucuk hem de silinmis kayitlar buyudukce bozulmaz. Yukaridaki FK
-- index'leri bilerek partial degil: CASCADE/RESTRICT kontrolu silinmis
-- satirlari da taramak zorunda.
CREATE INDEX ix_app_user_active ON app_user (created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX ix_review_active_media ON review (media_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX ix_list_active_user ON list (user_id, created_at DESC) WHERE deleted_at IS NULL;
