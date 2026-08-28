# TMDB Film Alan Eşlemesi

> **Durum:** Taslak / V1 kapsamı
> **Son güncelleme:** 29 Ağustos 2026

Bu belge TMDB film cevabının Eseryum `media` ve `film_detail` yapılarına
nasıl dönüştürüleceğini tanımlar.

## Onaylanan kararlar

### Başlıklar

TMDB film detayı `language=tr-TR` ile istendiği için `title` yerelleştirilmiş
başlık, `original_title` ise eserin özgün başlığı olarak saklanır.

| TMDB alanı | Eseryum alanı |
| --- | --- |
| `title` | `media.title` |
| `original_title` | `media.original_title` |

`title` boşsa `original_title`, `media.title` için yedek değer olarak
kullanılır. İki alan da boşsa `media.title` zorunlu olduğu için film
aktarılmaz. İki başlık aynı olsa bile `original_title` saklanır.

### Görseller

TMDB görsel yolları backend tarafından tam CDN adresine dönüştürülür.

| TMDB alanı | Eseryum alanı | Boyut |
| --- | --- | --- |
| `poster_path` | `media.cover_url` | `w500` |
| `backdrop_path` | `media.backdrop_url` | `w1280` |

TMDB yolu boşsa ilgili alan `NULL` bırakılır. Placeholder URL veritabanına
yazılmaz; gerektiğinde frontend tarafından gösterilir.

### TMDB kimliği

Filmin TMDB kimliği yalnızca `film_detail.tmdb_id` alanında saklanır.
`media.provider` / `media.external_id` kolonları ile bunları temsil eden
`MediaIdentity`, `MediaProvider` ve deduplication katmanı kullanılmaz.
`tmdb_id` boşsa TMDB'den aktarılmış bir film olarak değerlendirilmez.

### IMDb puanı

TMDB'nin `vote_average` ve `vote_count` alanları IMDb puanı değildir ve
Eseryum'a aktarılmaz. Gerçek IMDb puanı için iki aşamalı akış kullanılır:

1. TMDB `movie/{tmdbId}/external_ids` cevabındaki `imdb_id` alınır.
2. Bu kimlik OMDb API'ye `i={imdbId}` parametresiyle gönderilir.

Alan eşlemesi:

| Kaynak | Hedef |
| --- | --- |
| TMDB `external_ids.imdb_id` | `film_detail.imdb_id` |
| OMDb `imdbRating` | `film_detail.imdb_rating` |
| OMDb `imdbVotes` | `film_detail.imdb_rating_count` |

`imdbVotes` içindeki binlik ayraçları kaldırılarak tam sayıya dönüştürülür.
IMDb kimliği veya OMDb puanı bulunamazsa film aktarımı başarısız sayılmaz;
`imdb_id` mevcutsa saklanır, `imdb_rating` `NULL` ve
`imdb_rating_count` `0` bırakılır. `N/A` değerleri de boş kabul edilir.

`media.rating_avg` ve `media.rating_count` yalnızca Eseryum kullanıcılarının
puanlarını temsil eder; IMDb değerleri bu alanlara yazılmaz.

### Yapım ülkesi

TMDB `production_countries` alanında birden fazla ülke döndürebildiği için
tek değer tutan `film_detail.country` alanı V1 modelinden kaldırılmıştır.
TMDB yapım ülkeleri V1'de saklanmaz.

### Yönetmen

Yönetmenler `credits.crew` listesinden `job = "Director"` koşuluyla seçilir.
Birden fazla yönetmen varsa adları TMDB sırası korunarak `, ` ile
birleştirilir ve `film_detail.director` alanında saklanır.

Örnek:

```text
Lana Wachowski, Lilly Wachowski
```

Hiç yönetmen bulunamazsa alan `NULL` bırakılır. Çoklu isimlerin keyfi bir
uzunluk sınırına takılmaması için kolon tipi `text` olarak kullanılır.

## Alan eşleme tablosu

| TMDB / OMDb alanı | Eseryum alanı | Dönüşüm |
| --- | --- | --- |
| TMDB `id` | `film_detail.tmdb_id` | Doğrudan |
| TMDB `title` | `media.title` | `tr-TR`; boşsa `original_title` |
| TMDB `original_title` | `media.original_title` | Doğrudan |
| TMDB `release_date` | `media.release_date` | ISO tarih |
| TMDB `release_date` | `media.release_year` | Tarihin yılı |
| TMDB `poster_path` | `media.cover_url` | `w500` tam CDN adresi |
| TMDB `backdrop_path` | `media.backdrop_url` | `w1280` tam CDN adresi |
| TMDB `overview` | `media.synopsis` | `tr-TR` metni |
| TMDB `runtime` | `film_detail.runtime_min` | Pozitif dakika |
| TMDB `original_language` | `film_detail.original_lang` | ISO 639-1 küçük harf |
| TMDB `credits.crew` | `film_detail.director` | Director adları `, ` ile birleştirilir |
| TMDB `genres` | `genre` + `media_genre` | TMDB tür kimliğine göre eşlenir |
| TMDB `external_ids.imdb_id` | `film_detail.imdb_id` | `tt` ile başlayan IMDb kimliği |
| OMDb `imdbRating` | `film_detail.imdb_rating` | Ondalık sayıya dönüştürülür |
| OMDb `imdbVotes` | `film_detail.imdb_rating_count` | Ayraçlar kaldırılıp tam sayıya dönüştürülür |
| TMDB `production_countries` | — | V1'de saklanmaz |
| TMDB `vote_average`, `vote_count` | — | IMDb/Eseryum puanıyla karıştırılmaması için saklanmaz |

`media.media_type` TMDB'den okunmaz; film aktarımında sabit `FILM` olarak
atanır. `media.rating_avg` `NULL`, `media.rating_count` `0` ile başlar ve
yalnızca Eseryum kullanıcı puanlarından güncellenir.

## Boş ve geçersiz alan davranışları

| Alan | Davranış |
| --- | --- |
| `title`, `original_title` | İkisi de boşsa aktarım reddedilir |
| `release_date` | Boş/geçersizse tarih ve yıl `NULL` |
| `poster_path`, `backdrop_path` | İlgili URL `NULL` |
| `overview` | `synopsis = NULL` |
| `runtime` | Boş, `0` veya negatifse `NULL` |
| `original_language` | Geçerli iki harfli kod değilse `NULL` |
| `credits.crew` | Yönetmen bulunamazsa `director = NULL` |
| `genres` | Film kaydedilir, ilişki satırı oluşturulmaz |
| `external_ids.imdb_id` | `imdb_id` ve IMDb puanı alanları boş bırakılır |
| OMDb hatası veya `N/A` | Aktarım devam eder; puan `NULL`, oy sayısı `0` |

Opsiyonel bir alanın eksik olması film aktarımını durdurmaz. Yalnızca hem
`title` hem `original_title` alanlarının boş olması aktarımı geçersiz kılar.
