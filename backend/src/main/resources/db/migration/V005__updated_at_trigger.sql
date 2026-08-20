-- V005 - updated_at otomasyonu.
--
-- Neden trigger: updated_at'i uygulama katmanina birakirsak tek bir
-- unutulmus UPDATE (migration, manuel duzeltme, batch is) alani sessizce
-- eskitir ve "en son ne zaman degisti" sorusunun cevabi guvenilmez olur.
-- Bu, kural degil muhasebe oldugu icin veritabaninda durmasi dogru.
--
-- rating_avg / rating_count icin bilerek trigger YAZILMIYOR: onlar
-- turetilmis alanlar ve servis/batch katmaninda guncelleniyor (bkz. README).

-- Tek fonksiyon, tum tablolar. NEW.updated_at kullanicinin gonderdigi
-- degeri her zaman ezer; istemcinin zamanina guvenilmez.
CREATE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER tr_app_user_set_updated_at
    BEFORE UPDATE ON app_user
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_media_set_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_log_entry_set_updated_at
    BEFORE UPDATE ON log_entry
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_review_set_updated_at
    BEFORE UPDATE ON review
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_list_set_updated_at
    BEFORE UPDATE ON list
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- user_media_status'ta updated_at diyagramdan beri var ve tablonun tek
-- degisken alani zaten status. Ayni fonksiyonu buraya da baglamak,
-- "durum en son ne zaman degisti" bilgisini bedavaya dogru tutar.
CREATE TRIGGER tr_user_media_status_set_updated_at
    BEFORE UPDATE ON user_media_status
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
