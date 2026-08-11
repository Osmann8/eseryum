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

| Klasör    | İçerik                                                     |
| --------- | ---------------------------------------------------------- |
| `auth/`   | Kayıt, giriş, token yenileme, oturumdaki kullanıcı, çıkış  |
| `film/`   | `type=FILM` eserler: liste, arama, detay, ekleme            |
| `series/` | `type=SERIES` eserler                                       |
| `book/`   | `type=BOOK` eserler                                         |

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

`.env` içinde `BACKEND_PORT` değiştirdiyseniz `baseUrl`'ü de güncelleyin.

## Endpoint'ler henüz yazılmadı

Controller'lar boş; bu koleksiyon **planlanan** sözleşmeyi taşıyor. Şu an
istekleri koşarsanız 401/404 alırsınız, beklenen durum. Endpoint listesi
SAN-18'de kesinleştikçe ve controller'lar yazıldıkça buradaki yol, gövde ve alan
adları güncellenir.

Kural: **endpoint'i değiştiren PR, bu koleksiyonu da aynı PR'da günceller.**
Gerçekle bağı kopan bir koleksiyon, hiç olmamasından daha kötüdür — insanlar bir
süre ona güvenmeye devam eder.

## Yeni istek eklerken

- İstek adları Türkçe ve okunur olsun (Bruno UI'da bu isim görünür), dosya adları
  İngilizce kebab-case.
- Klasördeki sırayı `seq` belirler.
- Kimlik gerektirmeyen istekte `auth: none`, gerektirende `auth: inherit`.
- Sabit id gömmeyin; ortam değişkeni kullanın.
