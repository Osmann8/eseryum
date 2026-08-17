# eseryum

Film, dizi ve kitap için tek platform. İzlediğini/okuduğunu kaydet, puan ver, ne kadarını bitirdiğini takip et.

| Katman    | Teknoloji                                                 |
| --------- | --------------------------------------------------------- |
| Backend   | Java 21, Spring Boot 3.3.4, Spring Security, JPA, Flyway   |
| Veritabanı| PostgreSQL 16                                             |
| Frontend  | Next.js 15 (App Router), TypeScript, Tailwind, TanStack Query, next-intl |
| Ortam     | Docker Compose                                            |
| API testi | Bruno (koleksiyon repo'da: [`bruno/`](bruno/))            |

---

## Gereksinimler

- **Docker Desktop** — veritabanı ve konteynerli çalıştırma için
- **JDK 21** (Temurin önerilir) — backend'i IDE'den çalıştırmak ve test koşmak için
- **Maven 3.9+** — IDE'nizinki de olur
- **Node.js 22+** — frontend için

Projede `mvnw` wrapper yok; Maven'ı kendiniz kurmalısınız.

---

## Hızlı başlangıç

```bash
git clone https://github.com/Osmann8/eseryum.git
cd eseryum
cp .env.example .env      # Windows: copy .env.example .env
docker compose up -d --build
```

Bu kadar. Postgres ve backend ayağa kalkar:

- Backend → http://localhost:8080
- Swagger UI → http://localhost:8080/swagger-ui.html
- Postgres → `localhost:5432` (kullanıcı/parola/db: `.env` dosyanızdaki değerler)

> **Swagger 401 dönüyorsa panik yok.** `user/auth/` paketi henüz boş, Spring Security varsayılan korumada. Uygulamanın ayakta olduğunu gösterir; auth ticket'ı tamamlanınca açılacak.

Logları izlemek için:

```bash
docker compose logs -f backend
```

Durdurmak için:

```bash
docker compose down       # konteynerler gider, veri kalır
docker compose down -v    # veritabanı verisi de silinir
```

### Günlük geliştirme: sadece veritabanı konteynerde

Backend üzerinde çalışırken her değişiklikte imaj build etmek yorucu. Önerilen akış — Postgres konteynerde, backend IDE'de:

```bash
docker compose up -d postgres
```

Sonra `EseryumApplication`'ı IDE'den çalıştırın. `application.yml` varsayılanları `localhost:5432` ve `eseryum/eseryum` olduğu için ek ayar gerekmez.

---

## Testler

```bash
cd backend
mvn verify
```

Testler **Testcontainers** kullanıyor, yani gerçek bir Postgres konteyneri kaldırıyor — koşarken **Docker Desktop açık olmalı**. Ayrı bir veritabanı kurmanız gerekmez, test kendi konteynerini yaratıp siler.

Aynı komut her PR'da CI'da da koşuyor.

---

## API'yi elle denemek: Bruno

İstek koleksiyonu repo'da duruyor, yani `git pull` yapan herkeste aynı istekler
açılır — kimse Postman ekranından ekran görüntüsü göndermez.

1. [Bruno](https://www.usebruno.com/downloads)'yu kurun.
2. **Open Collection** → repo içindeki [`bruno/`](bruno/) klasörünü seçin.
3. Sağ üstten **local** ortamını seçin (`baseUrl = http://localhost:8080`).

Klasörler medya türüne göre ayrılmıştır: `auth/`, `film/`, `series/`, `book/`.
`auth/Giriş yap` isteği başarılı olduğunda token'ı ortam değişkenine yazar;
korumalı isteklere elle `Authorization` header'ı eklemeniz gerekmez.

> Controller'lar henüz yazılmadı. Koleksiyon **planlanan** sözleşmeyi taşıyor,
> şu an istekler 401/404 döner. Endpoint'i değiştiren PR koleksiyonu da aynı
> PR'da günceller — ayrıntı: [bruno/README.md](bruno/README.md).

Swagger UI de ayakta: http://localhost:8080/swagger-ui.html

---

## Ortam değişkenleri

Hepsinin `.env.example` içinde makul bir varsayılanı var; `.env` yoksa da compose çalışır.

| Değişken                   | Varsayılan              | Ne işe yarar                          |
| -------------------------- | ----------------------- | ------------------------------------- |
| `POSTGRES_DB`              | `eseryum`               | Veritabanı adı                        |
| `POSTGRES_USER`            | `eseryum`               | Veritabanı kullanıcısı                |
| `POSTGRES_PASSWORD`        | `eseryum`               | Veritabanı parolası                   |
| `POSTGRES_PORT`            | `5432`                  | Host tarafındaki Postgres portu       |
| `BACKEND_PORT`             | `8080`                  | Host tarafındaki backend portu        |
| `SPRING_PROFILES_ACTIVE`   | `local`                 | Aktif Spring profili                  |
| `FRONTEND_PORT`            | `3000`                  | Host tarafındaki frontend portu       |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080` | Frontend'in çağıracağı API adresi     |

`.env` **asla commit'lenmez** (`.gitignore`'da). Yeni bir değişken eklerseniz `.env.example`'a da ekleyin, yoksa diğer geliştiricinin ortamı sessizce eksik kalır.

---

## Proje yapısı

```
eseryum/
├── backend/                 # Spring Boot uygulaması
│   ├── src/main/java/com/eseryum/
│   │   ├── common/          # Ortak entity temeli, merkezi hata yönetimi
│   │   ├── media/           # Eser (film/dizi/kitap) alanı
│   │   ├── user/            # Üyelik, auth, tamamlama takibi
│   │   └── provider/        # TMDB, Google Books, OpenLibrary entegrasyonları
│   └── src/main/resources/db/migration/   # Flyway migration'ları
├── frontend/                # Next.js (App Router); ayrıntı aşağıda
├── bruno/                   # API istek koleksiyonu (auth, film, series, book)
├── docs/                    # Ekip dokümanları
└── docker-compose.yml
```

---

## Veritabanı ve migration

Şema **Flyway** ile yönetilir, `ddl-auto: validate` açıktır — Hibernate tablo yaratmaz, sadece doğrular. Entity'niz şemayla uyuşmuyorsa uygulama hiç başlamaz.

Migration dosyaları `backend/src/main/resources/db/migration/` altına `V1__aciklama.sql` biçiminde konur. Migration yazarken ekipteki sürüm numarası çakışması kuralı için [docs/branching-strategy.md](docs/branching-strategy.md) belgesine bakın.

> Henüz migration yok. Bu yüzden başlangıçta Flyway'in "No migrations found" uyarısını görürsünüz; beklenen durum.

---

## Frontend

Next.js (App Router) + TypeScript. Tailwind CSS, TanStack Query ve next-intl kurulu; şu an **ana sayfa**, **Filmler** ve **Diziler** sekmeleri yazıldı, diğer ekranlar "Yakında" yer tutucusu.

Filmler ve Diziler aynı ekranın iki örneği (sayaçlar, filtre çubuğu, öneri satırı, katalog, sağ sütun). Ortak parçalar `features/works/` altında; `features/films/` ve `features/series/` yalnızca kendi verilerini ve türe özel farkları taşır — kartın alt satırı (film: süre, dizi: sezon/bölüm), koleksiyon sekmeleri ve dizilerdeki ilerleme çubuğu. Kitaplar sekmesi de aynı yerden beslenecek.

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

| Komut               | Ne yapar                              |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Geliştirme sunucusu                   |
| `npm run build`     | Üretim derlemesi (`output: standalone`)|
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | `tsc --noEmit`                        |

Üçü de her PR'da CI'da koşuyor.

### Klasör düzeni

```
frontend/src/
├── app/[locale]/     # route'lar; dil öneki as-needed (tr için önek yok)
├── features/         # alan bazlı: home, works, auth, reviews...
│   └── <alan>/{api,components,hooks,types.ts}
├── shared/           # api-client, ortak bileşenler, layout, provider'lar
├── i18n/             # next-intl yapılandırması
└── messages/tr.json  # arayüzdeki her metin buradan gelir
```

> **Yazılan ekranlar şu an mock veriyle çiziliyor.** Backend'de henüz controller yok; veri `features/<alan>/mock/` altında duruyor ve tek giriş noktası `features/<alan>/api/*-api.ts` (`home-api.ts`, `films-api.ts`, `series-api.ts`). Endpoint'ler açıldığında bu dosyalardaki fonksiyonların gövdesi `apiFetch`'e çevrilir, bileşenler değişmez. Filtreleme/sıralama/sayfalama da bilerek api katmanında (`features/works/api/collection-query.ts`): gerçekte bu iş sorgu parametreleriyle sunucuda yapılacak.

### Konteynerde çalıştırma

Compose'da `frontend` profili altında duruyor, yani varsayılan `docker compose up` onu atlar (backend üzerinde çalışırken imaj build etmek gereksiz):

```bash
docker compose --profile frontend up -d --build
```

---

## Katkı

Dal isimlendirme, PR ve review kuralları: [docs/branching-strategy.md](docs/branching-strategy.md)

Özet: `main`'e doğrudan push yok, her iş kendi dalında, PR'ı diğer geliştirici review eder, CI yeşil olmadan merge edilmez.

---

## Sorun giderme

**`docker compose up` "cannot connect to the Docker daemon" diyor**
Docker Desktop kapalı. Açın, balina ikonu sabitlenene kadar bekleyin.

**Port 5432 zaten kullanımda**
Makinenizde başka bir Postgres çalışıyor. Compose dosyasını düzenlemeyin; `.env` içinde `POSTGRES_PORT=5433` yapmanız yeterli.

**Testler "Could not find a valid Docker environment" diyor**
Testcontainers Docker bulamıyor. Docker Desktop açık mı? (`pom.xml` içindeki `api.version=1.43` ayarı bu hatanın bir başka türü içindir, silmeyin.)

**Backend "connection refused" ile başlıyor ve ölüyor**
Postgres henüz hazır değilken bağlanmaya çalışmıştır. Compose'da healthcheck bunu engeller; backend'i IDE'den çalıştırıyorsanız `docker compose ps` ile Postgres'in `healthy` olduğundan emin olun.

**Veritabanını sıfırdan istiyorum**

```bash
docker compose down -v && docker compose up -d
```
