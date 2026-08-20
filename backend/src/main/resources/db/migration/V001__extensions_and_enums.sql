-- V001 - Eklentiler ve V1 kapsamindaki enum tipleri.
--
-- Bu dosya sema nesnesi olusturmaz; sadece sonraki migration'larin
-- bagimli oldugu altyapiyi kurar. Roadmap (V1.1-V3) enum'lari
-- (import_source, job_status, member_role, msg_role) bilerek yok:
-- kullanan tablolari geldiginde kendi migration'inda olusturulacak.

-- citext: app_user.username / app_user.email buyuk-kucuk harf duyarsiz
-- benzersiz olmali. lower() ifade index'i yerine citext tercih edildi,
-- cunku esitlik kontrolu her sorguda otomatik olarak dogru calisir.
CREATE EXTENSION IF NOT EXISTS citext;

-- pg_trgm: media.title uzerinde benzerlik/ILIKE aramasi icin GIN trigram
-- index'i gerekiyor (bkz. V004).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- media supertype'inin ayrimci (discriminator) kolonu. Yeni bir ortam
-- eklenmesi buraya bir deger + yeni bir detail tablosu demektir.
CREATE TYPE media_type AS ENUM ('film', 'series', 'book');

-- Dizinin yayin durumu. Serbest metin yerine enum: 'Devam ediyor' /
-- 'devam ediyor' gibi varyasyonlar veriye sizmasin.
CREATE TYPE series_status AS ENUM ('ongoing', 'ended', 'cancelled');

-- Kullanicinin bir eser ile mevcut iliskisi (user_media_status).
-- Gecmis kayitlari log_entry tutar; burasi yalnizca "su anki durum".
CREATE TYPE track_status AS ENUM ('planned', 'in_progress', 'completed', 'dropped');
