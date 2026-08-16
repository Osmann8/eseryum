import { Clapperboard, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import type { FilmCounts } from "@/features/films/types";

/**
 * Sayfa basligi ve dort sayac. Sayaclar ana sayfadaki seritten ayri duruyor:
 * oradakiler tum medya turlerini sayiyor, buradakiler sadece filmleri - ayni
 * bilesen olsa iki farkli anlami tek kutuya sikistirmis olurduk.
 */
export function FilmsPageHeader({ counts }: { counts: FilmCounts }) {
  const t = useTranslations("films");

  const cells = [
    { key: "watched", value: counts.watchedCount },
    { key: "rated", value: counts.ratedCount },
    { key: "watchlist", value: counts.watchlistCount },
    { key: "reviews", value: counts.reviewCount },
  ];

  return (
    <header className="mb-8">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-ink">
        {t("title")}
        {/* Sussuz kalmasin diye duran bir ikon; mavi butcesi buraya harcanmaz. */}
        <Clapperboard className="size-5 text-ink-faint" strokeWidth={1.75} />
      </h1>
      <p className="mt-1 text-sm text-ink-muted">{t("subtitle")}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <dl className="inline-flex flex-wrap rounded-xl border border-line bg-surface">
          {cells.map(({ key, value }, index) => (
            <div
              key={key}
              className={`flex min-w-[110px] flex-col gap-1 px-6 py-4 ${
                index > 0 ? "border-l border-line" : ""
              }`}
            >
              <dd className="text-xl font-semibold text-ink">
                {value.toLocaleString("tr-TR")}
              </dd>
              <dt className="text-xs text-ink-muted">{t(`counts.${key}`)}</dt>
            </div>
          ))}
        </dl>

        {/*
          Film ekleme akisi ayri bir ticket (arama + saglayici eslemesi
          gerekiyor). Dugme simdilik Topbar'daki bildirim dugmeleri gibi
          yalnizca gorunum.
        */}
        <Button className="ml-auto">
          {t("addFilm")}
          <Plus className="size-4" />
        </Button>
      </div>
    </header>
  );
}
