# eseryum

Film, dizi ve kitap için tek platform. İzlediğini/okuduğunu kaydet, puan ver, ne kadarını bitirdiğini takip et.

| Katman    | Teknoloji                                                 |
| --------- | --------------------------------------------------------- |
| Backend   | Java 21, Spring Boot 3.3.4, Spring Security, JPA, Flyway   |
| Veritabanı| PostgreSQL 16                                             |
| Frontend  | Next.js (henüz kurulmadı, iskelet halinde)                |
| Ortam     | Docker Compose                                            |

---

## Gereksinimler

- **Docker Desktop** — veritabanı ve konteynerli çalıştırma için
- **JDK 21** (Temurin önerilir) — backend'i IDE'den çalıştırmak ve test koşmak için
- **Maven 3.9+** — IDE'nizinki de olur

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
├── frontend/                # Next.js (iskelet)
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

`frontend/` şu an boş iskelet — `package.json` ve bileşen dosyaları henüz doldurulmadı. Bu yüzden compose'da `frontend` profili altında duruyor, varsayılan `docker compose up` onu atlıyor.

Next.js projesi kurulup `next.config.*` içinde `output: "standalone"` açıldıktan sonra:

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
