# Branching Strategy

## Dal yapısı

```
main                          ← her zaman deploy edilebilir durumda
├── Develop                   ← geliştirmeler burda yapılır
├──── feat/work-entity            ← özellik
├──── fix/jwt-refresh-expiry      ← hata düzeltme
├──── chore/flyway-baseline       ← altyapı/config, özellik değil
├──── db/add-book-detail-table    ← yalnızca migration içeren değişiklik
```

Sadece `main` kalıcıdır. Her şey ondan dallanır, PR ile ona geri döner, birleştikten sonra silinir.

### İsimlendirme

| Önek        | Ne zaman                                 | Örnek                             |
| ----------- | ---------------------------------------- | --------------------------------- |
| `feat/`     | Yeni özellik veya endpoint               | `feat/work-search-endpoint`       |
| `fix/`      | Bug düzeltme                             | `fix/rating-half-star-rounding`   |
| `chore/`    | Konfig, bağımlılık, tooling              | `chore/upgrade-spring-boot-3-3-5` |
| `db/`       | Sadece Flyway migration                  | `db/add-series-progress-column`   |
| `refactor/` | Davranış değişmeyen yeniden yapılandırma | `refactor/extract-work-mapper`    |

Branch adı üç ile altı kelime arası, kebab-case, İngilizce. Ticket/issue numaranız varsa başa ekleyin: `feat/12-work-search-endpoint`. Şu an issue tracker kullanmıyorsanız bu formatı zorlamayın — numara olmadan da isim tek başına anlaşılır olmalı.

---

## Akış

1. `main`'den güncel çek: `git checkout main && git pull`
2. Branch aç: `git checkout -b feat/work-search-endpoint`
3. Küçük, sık commit at. Commit mesajı ne yaptığını değil **neden** yaptığını söylesin.
4. Push et, PR aç. PR açıklamasına ne değişti + nasıl test edildi yaz (iki cümle yeterli).
5. **Diğer geliştirici review yapar, sen kendi PR'ını merge etmezsin.** İki kişilik ekipte bu kural atlanmak istenir — atlanmamalı. Review'ın amacı hata bulmak kadar, "bu kararı ikimiz de gördük" kaydı bırakmak.
6. CI (build + test) yeşil olmadan merge yok.
7. Merge sonrası branch'i sil. `main`'de yaşayan feature branch, bir hafta sonra kimin ne yaptığını hatırlamadığınız bir branch olur.

---

## Migration (Flyway) için ek kural

Flyway migration'ları **sıra bağımlı ve geri alınamaz** olduğu için özel dikkat gerekiyor:

- Her migration dosyası kendi branch'inde, tek başına bir PR olarak gelsin (`db/` öneki). Bir feature PR'ının içine gömülü migration, review'da atlanma riski taşır.
- İki geliştirici aynı anda migration yazıyorsa **sürüm numarası çakışması** olur (`V12__` iki branch'te de kullanılmışsa). Bunu önlemek için: migration branch açar açmaz Slack/mesaj üzerinden "V12 benim" diye haber verin, ya da tarih tabanlı numaralandırma kullanın (`V20260807_1200__add_book_detail.sql`). İki kişilik ekipte bu, kodun kendisinden çok daha sık kırılan nokta olur.
- Migration'ı `main`'e merge etmeden önce local'de gerçekten Testcontainers ile çalıştığını doğrulayın — `ddl-auto: validate` olduğu için şemayla entity uyuşmazsa uygulama hiç ayağa kalkmaz.
