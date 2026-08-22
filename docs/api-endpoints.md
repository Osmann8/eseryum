# Eseryum API Endpointleri

> **Durum:** Taslak / V1 kapsamı
> **Son güncelleme:** 22 Ağustos 2026
> **Kapsam:** Bu belge API sözleşmesinin tek doğru kaynağıdır. `frontend/src/features/*/api/*.ts` ve `bruno/` koleksiyonu buraya hizalanır; çeliştiğinde bu belge kazanır.

---

## Ortak kurallar

**Puanlama: 0–10, 0.5 adımlarla.** Veritabanındaki skalanın aynısı — tekil
puanlar (`log_entry.rating`) `ck_log_entry_rating_scale` ile 0.5 adımına
kilitli, 0 geçerli bir puan. Ortalamalar (`media.rating_avg`) ara değer
alabilir, adım kuralı onlara işlemez.

Frontend bir süre 0–5 varsaydı, veritabanı 0–10 diyordu; ikisi de sessizce
kendi skalasını doğru sanıyordu. Ölçek dönüşümü **hiçbir katmanda
yapılmaz**: API 0–10 verir, arayüz 0–10 gösterir.

`imdbRating` de 0–10 ama ayrı bir alan ve ayrı bir rozet — aynı ölçekte
olmaları aynı şey oldukları anlamına gelmiyor.

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
| GET    | `/api/users/{id}/summary?period=month` | Dönemsel özet — ana sayfadaki "Bu ay" kartı |

## Media (Ortak)

| Method | Endpoint               | Açıklama                                             |
| ------ | ---------------------- | ---------------------------------------------------- |
| GET    | `/api/media/search?q=` | Yerel DB + Dış API araması (film/dizi/kitap karışık) |
| GET    | `/api/media/{id}`      | Genel medya detayı                                   |
| GET    | `/api/media/trending?type=` | Öne çıkanlar; `type` = `FILM`/`SERIES`/`BOOK`, boşsa karışık |

## Film

| Method | Endpoint          | Açıklama                            |
| ------ | ----------------- | ----------------------------------- |
| GET    | `/api/films`      | Filtreli film listesi (sayfalamalı) |
| GET    | `/api/films/{id}` | Filme özel detay                    |
| PUT    | `/api/films/{id}` | Film bilgisi güncelle (Admin)       |
| GET    | `/api/films/genres?scope=` | Tür sözlüğü; `scope=me` kullanıcının kendi sayaçlarını verir |

## Series

| Method | Endpoint           | Açıklama                            |
| ------ | ------------------ | ----------------------------------- |
| GET    | `/api/series`      | Filtreli dizi listesi (sayfalamalı) |
| GET    | `/api/series/{id}` | Diziye özel detay                   |
| PUT    | `/api/series/{id}` | Dizi bilgisi güncelle (Admin)       |
| GET    | `/api/series/genres?scope=` | Tür sözlüğü; `scope=me` kullanıcının kendi sayaçlarını verir |

## Book

| Method | Endpoint          | Açıklama                                           |
| ------ | ----------------- | -------------------------------------------------- |
| GET    | `/api/books`      | Filtreli kitap listesi (sayfalamalı)               |
| GET    | `/api/books/{id}` | Kitaba özel detay                                  |
| POST   | `/api/books`      | Manuel kitap ekleme (Admin – TR baskı verisi için) |
| PUT    | `/api/books/{id}` | Kitap bilgisi güncelle (Admin)                     |
| GET    | `/api/books/genres?scope=` | Tür sözlüğü; `scope=me` kullanıcının kendi sayaçlarını verir |

## Koleksiyon (tür başına)

> Frontend'deki üç sekmenin (Filmler, Diziler, Kitaplar) beslendiği uçlar.
> `{tür}` = `films` | `series` | `books`; üçü de aynı beş ucu taşır.

| Method | Endpoint                                        | Açıklama                                        |
| ------ | ----------------------------------------------- | ----------------------------------------------- |
| GET    | `/api/users/{id}/{tür}`                         | Kullanıcının o türdeki koleksiyonu (aşağıdaki filtreler) |
| GET    | `/api/users/{id}/{tür}/counts`                  | Sayfa başlığındaki dört sayaç                   |
| GET    | `/api/users/{id}/{tür}/activity?period=month`   | "Aktiviten" kartı — adet, ortalama puan, değişim |
| GET    | `/api/users/{id}/{tür}/rating-distribution`     | Puan dağılımı halkası (yüzdeler toplamı 100)    |
| GET    | `/api/users/{id}/{tür}/recommendations`         | O türe özel öneri satırı                        |

Liste ucunun sorgu parametreleri:

| Parametre   | Değerler                                                | Not                                   |
| ----------- | ------------------------------------------------------- | ------------------------------------- |
| `collection`| `ALL`, `IN_PROGRESS`, `COMPLETED`, `PLANNED`, `FAVORITES`| Filmde `IN_PROGRESS` yok              |
| `sort`      | `NEWEST`, `OLDEST`, `RATING`, `TITLE`                   | Varsayılan `NEWEST`                   |
| `decade`    | `2020`, `2010`, `2000`, `1990`, `OLDER`                 | On yıllık dilim; `OLDER` = 1990 öncesi |
| `minRating` | `4.5`, `4`, `3.5`, `3`                                  | Altındakiler elenir                   |
| `genre`     | Tür slug'ı (`bilim-kurgu`)                              | `genres` ucundan gelir                |
| `page`/`size`| Spring `Pageable`                                      | Cevap Spring `Page` şekli             |

**Library ile ilişkisi:** `library/` durum kaydının kendisidir (yazma tarafı, tür bağımsız); buradaki uçlar o duruma göre filtrelenmiş **okuma görünümleridir**. Durum değişikliği yine `PUT /api/library/{mediaId}` ile yapılır.

**`users/me/recommendations` ile ilişkisi:** oradaki uç tür bağımsız ve kanıtlı tavsiye (Keşfet ekranı); buradaki her sekmenin kendi öneri satırıdır.

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
| GET    | `/api/lists?sort=popular&period=` | Keşif / herkese açık listeler; `period=week` ana sayfadaki "Haftanın listeleri" |

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

- [x] **`media_id` ↔ `film/series/book.id` ilişkisi.** ~~Aynı PK mı, ayrı PK + foreign key mi?~~ **Çözüldü (PR #13, `V002`/`V003`):** paylaşılan birincil anahtar. `film_detail.media_id` hem PK hem FK; `FOREIGN KEY (media_id, media_type) REFERENCES media (id, media_type)` + `CHECK (media_type = 'film')` ile alt tip kilitli. Sonuç: **tek id uzayı var** — `/api/films/{id}` ile `/api/books/{id}` aynı sayıyı taşıyamaz, o id zaten birine ait.
- [ ] **Review — Diary ilişkisi.** Bir kullanıcı bir esere kaç review yazabilir? Şu anki yapı (`GET /reviews/media/{mediaId}`) medya+kullanıcı bazlı tek review'ı ima ediyor; rewatch'te ayrı review yazılabilecek mi, yoksa review medyaya mı sabit?
- [ ] **Taste-match hesaplama stratejisi.** Senkron/on-demand mı, yoksa scheduled job ile önceden hesaplanmış bir tablo mu? Kullanıcı sayısı arttıkça O(n²) korelasyon maliyeti göz önünde bulundurulmalı.
