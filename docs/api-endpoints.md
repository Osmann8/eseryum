# Eseryum API Endpointleri

> **Durum:** Taslak / V1 kapsamı
> **Son güncelleme:** Ağustos 2026
> **Not:** `media_id` ile `film/series/book.id` ilişkisi henüz netleşmedi (bkz. Açık Konular). Bu belge güncellenene kadar kesin şema kararı olarak alınmamalı.

---

## Auth

| Method | Endpoint                    | Açıklama                             |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/api/auth/register`        | Kayıt ol                             |
| POST   | `/api/auth/login`           | Giriş yap                            |
| POST   | `/api/auth/refresh`         | Token yenile                         |
| POST   | `/api/auth/logout`          | Çıkış yap (refresh token invalidate) |
| POST   | `/api/auth/forgot-password` | Şifre sıfırlama maili gönder         |
| POST   | `/api/auth/reset-password`  | Şifreyi sıfırla                      |

## User

| Method | Endpoint                      | Açıklama                                           |
| ------ | ----------------------------- | -------------------------------------------------- |
| GET    | `/api/users/me`               | Kendi profilim                                     |
| PUT    | `/api/users/me`               | Profil güncelle (bio, kullanıcı adı vb.)           |
| GET    | `/api/users/{id}`             | Public profil                                      |
| GET    | `/api/users/{id}/stats?year=` | Yıllık özet (izlenen/okunan sayısı, aylık dağılım) |

## Media (Ortak)

| Method | Endpoint               | Açıklama                                             |
| ------ | ---------------------- | ---------------------------------------------------- |
| GET    | `/api/media/search?q=` | Yerel DB + Dış API araması (film/dizi/kitap karışık) |
| GET    | `/api/media/{id}`      | Genel medya detayı                                   |

## Film

| Method | Endpoint          | Açıklama                            |
| ------ | ----------------- | ----------------------------------- |
| GET    | `/api/films`      | Filtreli film listesi (sayfalamalı) |
| GET    | `/api/films/{id}` | Filme özel detay                    |
| PUT    | `/api/films/{id}` | Film bilgisi güncelle (Admin)       |

## Series

| Method | Endpoint           | Açıklama                            |
| ------ | ------------------ | ----------------------------------- |
| GET    | `/api/series`      | Filtreli dizi listesi (sayfalamalı) |
| GET    | `/api/series/{id}` | Diziye özel detay                   |
| PUT    | `/api/series/{id}` | Dizi bilgisi güncelle (Admin)       |

## Book

| Method | Endpoint          | Açıklama                                           |
| ------ | ----------------- | -------------------------------------------------- |
| GET    | `/api/books`      | Filtreli kitap listesi (sayfalamalı)               |
| GET    | `/api/books/{id}` | Kitaba özel detay                                  |
| POST   | `/api/books`      | Manuel kitap ekleme (Admin – TR baskı verisi için) |
| PUT    | `/api/books/{id}` | Kitap bilgisi güncelle (Admin)                     |

## Library

> Durum/ilerleme — medya başına **tek** kayıt.

| Method | Endpoint                     | Açıklama                                                    |
| ------ | ---------------------------- | ----------------------------------------------------------- |
| PUT    | `/api/library/{mediaId}`     | Durum/ilerleme güncelle (izliyorum/okudum/bıraktım, upsert) |
| GET    | `/api/library/me`            | Kendi kütüphanem                                            |
| GET    | `/api/library/user/{userId}` | Başkasının kütüphanesi                                      |
| DELETE | `/api/library/{mediaId}`     | Kütüphaneden çıkar                                          |

## Diary

> Günlük — medya başına **çoklu** kayıt (rewatch/reread için).

| Method | Endpoint                     | Açıklama                           |
| ------ | ---------------------------- | ---------------------------------- |
| POST   | `/api/diary`                 | Günlüğe kayıt düş (tarih, puan)    |
| GET    | `/api/diary/me?year=`        | Kendi günlüğüm                     |
| GET    | `/api/diary/user/{userId}`   | Başkasının günlüğü                 |
| GET    | `/api/diary/media/{mediaId}` | Bir esere ait tüm günlük kayıtları |
| PUT    | `/api/diary/{id}`            | Günlük kaydını güncelle            |
| DELETE | `/api/diary/{id}`            | Günlük kaydını sil                 |

## Review

| Method | Endpoint                       | Açıklama                      |
| ------ | ------------------------------ | ----------------------------- |
| POST   | `/api/reviews`                 | İnceleme yaz                  |
| GET    | `/api/reviews/media/{mediaId}` | Medyanın incelemeleri         |
| GET    | `/api/reviews/user/{userId}`   | Kullanıcının tüm incelemeleri |
| PUT    | `/api/reviews/{id}`            | İnceleme güncelle             |
| DELETE | `/api/reviews/{id}`            | İnceleme sil                  |

## List

| Method | Endpoint                         | Açıklama                       |
| ------ | -------------------------------- | ------------------------------ |
| POST   | `/api/lists`                     | Liste oluştur (sıralı/sırasız) |
| GET    | `/api/lists/{id}`                | Liste detayı                   |
| PUT    | `/api/lists/{id}`                | Liste bilgisi güncelle         |
| DELETE | `/api/lists/{id}`                | Listeyi sil                    |
| POST   | `/api/lists/{id}/items`          | Listeye eser ekle              |
| DELETE | `/api/lists/{id}/items/{itemId}` | Listeden eser çıkar            |
| PUT    | `/api/lists/{id}/items/reorder`  | Sırayı güncelle                |
| GET    | `/api/lists/user/{userId}`       | Kullanıcının listeleri         |
| GET    | `/api/lists?sort=popular`        | Keşif / herkese açık listeler  |

## Social / Taste Match

| Method | Endpoint                        | Açıklama                                                                           |
| ------ | ------------------------------- | ---------------------------------------------------------------------------------- |
| POST   | `/api/users/{id}/follow`        | Takip et                                                                           |
| DELETE | `/api/users/{id}/follow`        | Takibi bırak                                                                       |
| GET    | `/api/users/{id}/followers`     | Takipçiler                                                                         |
| GET    | `/api/users/{id}/following`     | Takip edilenler                                                                    |
| GET    | `/api/users/{id}/taste-match`   | Zevk örtüşme skoru + ortak eserler                                                 |
| GET    | `/api/users/me/similar-users`   | En çok benzeyen kullanıcılar                                                       |
| GET    | `/api/users/me/recommendations` | Kanıtlı tavsiyeler (benzer kullanıcıların yüksek puanladığı, dokunulmamış eserler) |
| GET    | `/api/feed`                     | Takip edilenlerin aktivite akışı                                                   |

---

## Açık Konular

- [ ] **`media_id` ↔ `film/series/book.id` ilişkisi.** Aynı PK mı (joined table inheritance), yoksa ayrı PK + `eser_id` foreign key mi? Arama sonuçlarının ve tür-bağımsız listelerin (Library, Diary, List) nasıl render edileceğini doğrudan etkiliyor.
- [ ] **Review — Diary ilişkisi.** Bir kullanıcı bir esere kaç review yazabilir? Şu anki yapı (`GET /reviews/media/{mediaId}`) medya+kullanıcı bazlı tek review'ı ima ediyor; rewatch'te ayrı review yazılabilecek mi, yoksa review medyaya mı sabit?
- [ ] **Taste-match hesaplama stratejisi.** Senkron/on-demand mı, yoksa scheduled job ile önceden hesaplanmış bir tablo mu? Kullanıcı sayısı arttıkça O(n²) korelasyon maliyeti göz önünde bulundurulmalı.
