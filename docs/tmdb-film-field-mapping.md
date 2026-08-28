# TMDB Film Alan Eşlemesi

> **Durum:** Taslak / V1 kapsamı
> **Son güncelleme:** 28 Ağustos 2026

Bu belge TMDB film cevabının Eseryum `media` ve `film_detail` yapılarına
nasıl dönüştürüleceğini tanımlar.

## Onaylanan kararlar

### TMDB kimliği

Filmin TMDB kimliği yalnızca `film_detail.tmdb_id` alanında saklanır.
`media.provider` / `media.external_id` kolonları ile bunları temsil eden
`MediaIdentity`, `MediaProvider` ve deduplication katmanı kullanılmaz.
`tmdb_id` boşsa TMDB'den aktarılmış bir film olarak değerlendirilmez.

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
