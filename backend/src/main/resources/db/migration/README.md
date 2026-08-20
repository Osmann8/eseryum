# Veritabanı Migration'ları

PostgreSQL 16 + Flyway. Şema tek kaynaktan yönetilir: Hibernate `ddl-auto: validate`
ile çalışır, yani şemayı **sadece** buradaki dosyalar değiştirir.

## Dosyalar

| Dosya                            | İçerik                                            |
| -------------------------------- | ------------------------------------------------- |
| `V001__extensions_and_enums.sql` | `citext`, `pg_trgm` eklentileri + V1 enum tipleri  |
| `V002__core_tables.sql`          | Tablolar: kolonlar, `NOT NULL`, `DEFAULT`, PK'ler  |
| `V003__core_constraints.sql`     | `UNIQUE`, `FOREIGN KEY`, `CHECK`                   |
| `V004__core_indexes.sql`         | FK index'leri, trigram arama, partial index'ler    |
| `V005__updated_at_trigger.sql`   | `set_updated_at()` fonksiyonu ve trigger'ları      |

Numaralandırma `V001__`, `V002__` biçimindedir ve **ürün versiyonlaması değildir**.
ER diyagramındaki `V1` / `V2` / `V3` etiketleri kapsam (roadmap) gösterir;
Flyway sürümü ile ilgisi yoktur.

### Kural: yazılan migration düzenlenmez

Flyway uygulanmış dosyanın checksum'ını tutar. Bir düzeltme gerekiyorsa
`V006__...` açılır. Bu, `develop`'a merge edilmiş her dosya için geçerlidir.

## Kapsam

Yalnızca ER diyagramında **solid** çizilen V1 entity'leri var:
`app_user`, `media`, `film_detail`, `series_detail`, `book_detail`, `genre`,
`media_genre`, `log_entry`, `review`, `user_media_status`, `series_progress`,
`list`, `list_item`, `follow`, `taste_overlap`.

Roadmap tabloları (`import_job` V1.1, `community` / `community_member` /
`chat_session` / `chat_message` V2, `direct_message` V3) ve onların enum'ları
(`import_source`, `job_status`, `member_role`, `msg_role`) **oluşturulmadı**.

Enum değerleri diyagramda yazmadığı için burada belirlendi:

- `media_type`: `film`, `series`, `book`
- `series_status`: `upcoming`, `ongoing`, `ended`, `cancelled`
- `track_status`: `planned`, `in_progress`, `on_hold`, `completed`, `dropped`

`upcoming`, TMDB import'u için gerekli: sağlayıcının "Planned" ve
"In Production" durumlarının map edilecek bir karşılığı olmazsa henüz
yayınlanmamış dizi yanlışlıkla `ongoing` görünür. `on_hold` ile `dropped`
ayrı tutuldu; "yarıda bıraktım ama vazgeçmedim" ile "bıraktım" farklı
niyetler, tek değerde birleştirilirse kullanıcının verdiği bilgi geri
döndürülemez şekilde kaybolur.

## Sürüm gereksinimi

**Minimum PostgreSQL 15.** Bu bir tercih değil, zorunluluk: `review` tablosundaki
`fk_review_log_entry` kısıtı `ON DELETE SET NULL (log_entry_id)` kolon listeli
sözdizimini kullanıyor ve bu sözdizimi PostgreSQL 15 ile geldi. Daha eski bir
sunucuda `V003__core_constraints.sql` sözdizimi hatası verir. Hedef sürüm 16;
docker-compose `postgres:16-alpine` kullanıyor.

## Alınan kararlar

### 1. Supertype/subtype bütünlüğü — trigger'sız

`media` üzerinde `UNIQUE (id, media_type)` var (PK varken teknik olarak
gereksiz; amacı bileşik FK'lere hedef olmak). Her detail tablosunda
`media_type` kolonu + `CHECK (media_type = '...')` + bileşik
`FOREIGN KEY (media_id, media_type) REFERENCES media (id, media_type)` bulunur.

Sonuç: bir `film_detail` satırı `media_type = 'film'` olmayan bir `media`
satırına asılamaz ve bir `media` satırının türü sonradan değiştirilemez
(detail satırı varken `media_type` UPDATE'i FK'yi ihlal eder).

Aynı yöntem `series_progress` için de uygulandı: bir filme veya kitaba bölüm
ilerlemesi yazılamaz.

### 2. Puanlama: 0–10, 0.5 adımlarla

Diyagramdaki tipler bu skalayı taşıyamıyordu, genişletildi:

- `log_entry.rating`: `numeric(2,1)` → `numeric(3,1)` (eski hâli max 9.9)
- `media.rating_avg`: `numeric(3,2)` → `numeric(4,2)` (eski hâli max 9.99)

0.5 adım kuralı `ck_log_entry_rating_scale` içinde
`(rating * 2) = trunc(rating * 2)` ile zorlanıyor.

### 3. Silme stratejisi — karma

- **Soft delete** (`deleted_at`): `app_user`, `review`, `list`
- **`ON DELETE CASCADE`**: kullanıcıya bağlı türev veri (`log_entry`,
  `review`, `list`, `user_media_status`, `series_progress`, `follow`,
  `taste_overlap`), listeye bağlı `list_item`, türe bağlı `media_genre`,
  ve `media`'nın metadata uzantıları: üç detail tablosu + `media_genre`
- **`ON DELETE RESTRICT`**: `media`'yı referans eden **kullanıcı verisi** —
  `log_entry`, `list_item`, `user_media_status`, `series_progress`.
  Bir medya kaydı hard delete edilmemeli, mükerrer kayıtlar
  `merged_into_id` ile birleştirilir

`media`'yı referans ettiği hâlde CASCADE olanların ölçütü şu: satırın
parent'ı olmadan bir anlamı yok ve içinde kullanıcı verisi taşımıyor.
1:1 detail satırları ile `media_genre` (tür ataması = sınıflandırma
metadata'sı) bu tanıma giriyor. `media_genre` RESTRICT olsaydı ayrıca
pratik bir sorun çıkardı: neredeyse her medya satırının bir tür ataması
olacağından hiç loglanmamış çöp bir kayıt bile silinemez, dolayısıyla
detail tablolarındaki CASCADE hiçbir zaman ateşlenemezdi.

### `app_user` CASCADE'leri pratikte ölü kurallardır

`app_user` soft delete edildiği için ondan çıkan `ON DELETE CASCADE`
zincirleri (`log_entry`, `review`, `list`, `user_media_status`,
`series_progress`, `follow`, `taste_overlap`) **normal işleyişte hiç
çalışmaz** — uygulama `DELETE FROM app_user` çağırmaz, `deleted_at` yazar.

Bu kurallar bilinçli olarak savunma katmanı: KVKK silme talebi, test
temizliği veya elle müdahale ile gerçek bir satır silinirse arkada yetim
veri kalmasın diye duruyorlar. **Bunlara güvenerek "kullanıcı silinince
verisi de gider" varsayımı yapmayın** — kullanıcı soft delete edildiğinde
ona ait `review` ve `list` satırlarını gizlemek/işaretlemek servis
katmanının işi (aşağıya bkz.).

### 4. `review` ↔ `log_entry` tutarlılığı

`review.log_entry_id` nullable. Dolu olduğunda, işaret ettiği log kaydının
aynı kullanıcıya ve aynı medyaya ait olduğu `log_entry (id, user_id, media_id)`
üzerindeki UNIQUE'e verilen bileşik FK ile garanti altında. NULL değerde
(MATCH SIMPLE) kısıt devreye girmez.

Silme davranışı `ON DELETE SET NULL (log_entry_id)` — PostgreSQL 15+ kolon
listeli sözdizimi. Klasik `SET NULL` `user_id` / `media_id` kolonlarını da
boşaltmaya çalışır ve NOT NULL ihlaline düşerdi.

### 5. `list_item.position`

`UNIQUE (list_id, position) DEFERRABLE INITIALLY DEFERRED`. Deferrable olması
zorunlu: aksi hâlde tek transaction içinde yeniden sıralama (iki elemanın yer
değiştirmesi) ara adımda çakışırdı. `position` NOT NULL, çünkü UNIQUE kısıtı
NULL değerler üzerinde çalışmaz.

### 6. Index'ler

PostgreSQL FK kolonlarına otomatik index açmaz; hepsi elle eklendi.
Soft delete edilen tablolarda ayrıca `WHERE deleted_at IS NULL` partial
index'leri var. FK index'leri bilerek partial **değil**: CASCADE/RESTRICT
kontrolü silinmiş satırları da taramak zorunda, partial index onları görmez.

`ix_series_progress_media_id` ayrı bir gerekçeyle var: silme değil, medya
birleştirme (`merged_into_id`). Mükerrer kayıt canonical'a taşınırken tüm
bağımlı satırlar `media_id` ile bulunur ve `media_id` bu tablonun PK'sinde
ilk kolon değil. `series_progress` doğası gereği en hızlı büyüyen
tablolardan biri (kullanıcı × dizi × sezon × bölüm), bu yüzden orada
tam tarama en pahalıya patlayan yer.

---

## Veritabanının zorlamadığı, uygulama katmanına ait kurallar

Bunlar bilinçli tercih. Her biri ya declarative olarak ifade edilemiyor ya da
maliyeti faydasından yüksek.

### Her `media` satırının bir detail satırı olmalı

Şema "yanlış türde detail satırı" eklenmesini engeller, ama "hiç detail satırı
olmayan media" durumunu engelleyemez — bu, declarative kısıtlarla ifade
edilemez (deferrable circular FK veya trigger gerekirdi).

**Uygulama:** `media` + detail satırı **tek transaction** içinde yazılmalı.
Servis katmanında medya oluşturma tek bir metottan geçmeli; repository'ye
doğrudan `media` insert'i açılmamalı.

### `rating_avg` / `rating_count` güncellemesi

Denormalize alanlar. V1'de bilerek trigger yazılmadı: her `log_entry`
insert/update/delete'inde `media` satırını kilitlemek, popüler eserlerde
yazma kuyruğu (lock contention) yaratır.

**Uygulama:** puan değiştiren işlemden sonra servis katmanı bu iki alanı
günceller; ek olarak periyodik bir batch iş `log_entry`'den yeniden hesaplayıp
sapmayı düzeltir. Gösterilen ortalamanın birkaç saniye eskimesi kabul edilebilir.

### Soft delete filtrelemesi

`deleted_at IS NULL` filtresini veritabanı eklemez. `app_user`, `review` ve
`list` üzerindeki her okuma sorgusu bu filtreyi taşımak zorunda.

**Uygulama:** Hibernate `@SQLRestriction` (veya repository'de ortak base query)
kullanılmalı; filtreyi tek tek sorgulara bırakmak, er ya da geç silinmiş bir
kaydın listede görünmesiyle biter. Moderasyon/admin sorguları bu filtreyi
bilerek atlar.

Ayrıca: bir kullanıcı soft delete edildiğinde ona bağlı `review` ve `list`
satırları **otomatik gizlenmez**. Bunları da işaretlemek servis katmanının işi.

### `merged_into_id` takibi

Dolu olduğunda satır artık canonical değildir. Sorgular canonical kaydı takip
etmeli; birleştirme sırasında `log_entry`, `review`, `list_item`,
`user_media_status`, `series_progress` satırları hedef `media`'ya taşınmalı.
Veritabanı zincirin tek adımda bitmesini garanti etmez — birleştirilmiş bir
kaydın tekrar birleştirilmesi mümkün, uygulama zinciri çözmeli (ya da
birleştirme sırasında hedefi canonical'a normalize etmeli).

**Taşıma sırasında PK çakışması.** Dört tabloda `media_id` bileşik PK'nin
parçası: `user_media_status` ve `series_progress` `(user_id, media_id, …)`,
`media_genre` `(media_id, genre_id)`, `list_item` `(list_id, media_id)`.
Bunların hepsinde, aynı kullanıcı/liste hem mükerrer hem canonical kayda
sahipse düz bir `UPDATE … SET media_id = <canonical>` PK çakışmasına düşer.

Çözüm: satırları `INSERT INTO … SELECT … ON CONFLICT DO NOTHING` ile
canonical'a kopyalayıp mükerrer `media_id`'ye ait satırları silmek — ya da
`UPDATE` öncesi canonical'da zaten karşılığı olan satırları elemek.

Kalan `media` bağımlıları güvenli: `log_entry` ve `review` surrogate `id`
taşır, `media_id` orada yalnızca FK — çakışma olmaz.

### `taste_overlap` yazımı

`user_a_id < user_b_id` kısıtı var; batch iş çifti yazmadan önce sıralamak
zorunda. Ters sırada insert denemesi `ck_taste_overlap_user_order` ile patlar.

---

## Roadmap tabloları eklenirken

- **Enum'a değer eklemek iki migration ister.** Dördüncü bir ortam (örn. oyun,
  podcast) eklemek şema değişikliği değil, `ALTER TYPE media_type ADD VALUE` +
  yeni bir detail tablosudur. Ama dikkat: `ADD VALUE` PostgreSQL 12+ ile
  transaction içinde çalışır, **eklenen değer aynı transaction'da
  kullanılamaz**. Flyway her migration dosyasını varsayılan olarak tek bir
  transaction içinde koştuğu için "değeri ekle + mevcut satırları güncelle"
  işi tek dosyada yapılamaz; `ALTER TYPE ... ADD VALUE` bir dosyaya,
  o değeri kullanan `UPDATE`/`INSERT` bir sonraki dosyaya konmalı.
  Bu, `series_status` ve `track_status` için de geçerlidir.
- **`import_job` (V1.1).** `import_source` ve `job_status` enum'ları o
  migration'da oluşturulacak. `user_id` FK'si CASCADE olmalı (kullanıcıya ait
  türev veri).
- **`community` / `community_member` (V2).** `created_by` FK'si `app_user`'a
  RESTRICT olmalı: kurucusu silindi diye topluluk yok olmamalı. Kurucu
  bilgisinin soft delete edilmiş bir kullanıcıya işaret edebileceği
  unutulmamalı.
- **`chat_session` / `chat_message` (V2), `direct_message` (V3).** Mesaj
  gövdeleri kişisel veri; silme politikası (hard delete mi, `deleted_at` mi)
  tablo oluşturulmadan **önce** kararlaştırılmalı, sonradan değiştirmek veri
  taşıma işi.
- **`updated_at`.** Kullanıcının düzenleyebildiği yeni bir tablo eklerken
  `updated_at timestamptz NOT NULL DEFAULT now()` kolonunu ve mevcut
  `set_updated_at()` fonksiyonunu kullanan bir `BEFORE UPDATE` trigger'ını
  eklemeyi unutmayın; fonksiyon zaten V005'te tanımlı.
- **FK index'leri.** Yeni her FK kolonu için index gerekir (PostgreSQL
  otomatik açmaz).

## Yerelde doğrulama

```bash
docker compose up -d postgres
# Backend'i çalıştırmak Flyway'i tetikler:
cd backend && ./mvnw spring-boot:run
```

Sadece SQL'i denemek için:

```bash
docker run --rm -d --name eseryum-schema-check \
  -e POSTGRES_PASSWORD=eseryum -e POSTGRES_USER=eseryum -e POSTGRES_DB=eseryum \
  -p 55432:5432 postgres:16-alpine
for f in V0*.sql; do
  docker exec -i eseryum-schema-check psql -U eseryum -d eseryum -v ON_ERROR_STOP=1 < "$f"
done
docker rm -f eseryum-schema-check
```
