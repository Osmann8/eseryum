# Bruno koleksiyonu

eseryum API'sinin istek koleksiyonu. Dosya tabanli olduğu için repo'da durur —
`git pull` yapan herkeste aynı istekler açılır, kimse kimseye ekran görüntüsü
göndermez.

## Açmak

1. [Bruno](https://www.usebruno.com/downloads) kurun.
2. **Open Collection** → bu klasörü (`bruno/`) seçin.
3. Sağ üstten **local** ortamını seçin. Ortam seçili değilken `{{baseUrl}}`
   boş gider ve istekler "invalid url" der.

## Klasörler

Klasör sırası [docs/api-endpoints.md](../docs/api-endpoints.md) başlıklarıyla aynı.

| Klasör    | Kaynak         | İçerik                                              |
| --------- | -------------- | --------------------------------------------------- |
| `auth/`   | `/api/auth`    | Kayıt, giriş, token yenileme, çıkış                 |
| `user/`   | `/api/users`   | Oturumdaki kullanıcı                                |
| `media/`  | `/api/media`   | Tür bağımsız arama                                  |
| `film/`   | `/api/films`   | Liste, detay, güncelleme                            |
| `series/` | `/api/series`  | Aynısı; ek olarak sezon/bölüm alanları              |
| `book/`   | `/api/books`   | Aynısı; ek olarak ekleme (yazar/sayfa alanları)     |

Listeleme, detay ve güncellemede tür yolun kendisinde taşınır — ne sorgu
parametresinde ne de gövdede. Backend'de de her biri kendi dikey dilimi
(`media/film/`, `media/series/`, `media/book/`).

**İki istisna var, ikisi de dökümandan geliyor:**

- **Arama tür bağımsız.** Dökümanda tek bir arama ucu var
  (`GET /api/media/search?q=`) ve film/dizi/kitabı karışık döndürüyor;
  kullanıcı arama kutusuna yazarken türü önceden seçmiyor. Bu yüzden tür
  başına ayrı arama isteği yok.
- **Film ve dizi yaratılamaz.** Dökümanda bu iki tür için yalnızca
  `PUT /api/{kaynak}/{id}` (Admin) var — katalog sağlayıcıdan (TMDB)
  doluyor. Elle eklenebilen tek tür kitap: `POST /api/books`, Türkçe baskı
  verisi için.

## Token akışı

`auth/Giriş yap` isteği başarılı olduğunda yanıttaki token'ları `accessToken` ve
`refreshToken` ortam değişkenlerine yazar. Koleksiyon seviyesinde bearer auth
tanımlı olduğu için korumalı istekler (`auth: inherit`) bunu kendiliğinden
kullanır; hiçbir isteğe elle `Authorization` header'ı eklemeyin.

Token'lar **secret** değişken olarak tanımlı — değerleri `.bru` dosyalarına
yazılmaz, dolayısıyla yanlışlıkla commit'lenmez.

## Ortam değişkenleri

| Değişken       | Varsayılan              | Ne işe yarar                        |
| -------------- | ----------------------- | ----------------------------------- |
| `baseUrl`      | `http://localhost:8080` | Backend adresi                      |
| `filmId`       | `1`                     | Detay isteklerinde kullanılan id    |
| `seriesId`     | `2`                     | —                                   |
| `bookId`       | `3`                     | —                                   |
| `accessToken`  | (secret, boş)           | Girişte otomatik dolar              |
| `refreshToken` | (secret, boş)           | Girişte otomatik dolar              |

Üç id **farklı**, çünkü tek bir id uzayı var: `film_detail.media_id` hem
birincil hem yabancı anahtar (bkz. `V002`/`V003`). Yani `1` numaralı film
varsa `1` numaralı kitap yoktur — o id zaten filme ait. Değerler yer
tutucu; seed verisi geldiğinde gerçek id'lerle güncellenir.

`.env` içinde `BACKEND_PORT` değiştirdiyseniz `baseUrl`'ü de güncelleyin.

## Endpoint'ler henüz yazılmadı

Controller'lar boş; bu koleksiyon **planlanan** sözleşmeyi taşıyor. Şu an
istekleri koşarsanız 401/404 alırsınız, beklenen durum. Yollar
[docs/api-endpoints.md](../docs/api-endpoints.md) ile hizalıdır; o belge tek
doğru kaynaktır, çeliştiğinde belge kazanır.

Koleksiyon dökümandaki her ucu taşımıyor — `library/`, `diary/`, `review/`,
`list/` ve social uçları henüz yazılmadı. Var olanlar dökümanla birebir.

Kural: **endpoint'i değiştiren PR, bu koleksiyonu da aynı PR'da günceller.**
Gerçekle bağı kopan bir koleksiyon, hiç olmamasından daha kötüdür — insanlar bir
süre ona güvenmeye devam eder.

## Yeni istek eklerken

- İstek adları Türkçe ve okunur olsun (Bruno UI'da bu isim görünür), dosya adları
  İngilizce kebab-case.
- Klasördeki sırayı `seq` belirler.
- Kimlik gerektirmeyen istekte `auth: none`, gerektirende `auth: inherit`.
- Sabit id gömmeyin; ortam değişkeni kullanın.
