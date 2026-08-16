import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { RatingBucket } from "@/features/films/types";

/**
 * Puan dagilimi halkasi. Kutuphanesiz, cunku cizilen sey bes sayidan ibaret:
 * cevresi 100 birim olan bir cember (r = 100 / 2π) ve her dilim icin bir
 * `stroke-dasharray`. Yuzdeler dogrudan uzunluk oluyor, hesap kalmiyor.
 *
 * Renkler tek hue'nun bes adimi (globals.css): dilimler sirali bir olcegi
 * gosteriyor, birbirinden bagimsiz kategorileri degil. Kimlik yalnizca renge
 * birakilmadi - her dilimin yanindaki aciklamada adi ve yuzdesi yaziyor.
 */
const RADIUS = 15.91549;

/** Dilimler arasindaki bosluk (yuzde biriminde ~2px). */
const SEGMENT_GAP = 0.8;

export function RatingDistributionCard({
  buckets,
  statsHref,
}: {
  buckets: RatingBucket[];
  statsHref: string;
}) {
  const t = useTranslations("films.ratingDistribution");

  let cumulative = 0;
  const segments = buckets.map((bucket) => {
    const start = cumulative;
    cumulative += bucket.percent;
    return { ...bucket, start };
  });

  const label = (bucket: RatingBucket) =>
    `${t("stars", { count: bucket.stars })} · ${t("percent", { value: bucket.percent })}`;

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <h2 className="text-sm font-semibold text-ink">{t("title")}</h2>
      <p className="mt-0.5 text-[11px] text-ink-faint">{t("subtitle")}</p>

      <div className="mt-3 flex items-center gap-3">
        <svg
          viewBox="0 0 42 42"
          className="size-[92px] shrink-0"
          role="img"
          aria-label={t("chartLabel")}
        >
          {/* Alt halka: dilim aralarindaki bosluk zeminde kaybolmasin. */}
          <circle
            cx="21"
            cy="21"
            r={RADIUS}
            fill="none"
            className="stroke-surface-2"
            strokeWidth="5.5"
          />

          {segments.map((segment) => {
            const length = Math.max(segment.percent - SEGMENT_GAP, 0);

            return (
              <circle
                key={segment.stars}
                cx="21"
                cy="21"
                r={RADIUS}
                fill="none"
                stroke={`var(--color-rating-${segment.stars})`}
                strokeWidth="5.5"
                strokeDasharray={`${length} ${100 - length}`}
                // 25 birimlik kaydirma dilimleri saat 12'den baslatir.
                strokeDashoffset={(125 - segment.start) % 100}
              >
                <title>{label(segment)}</title>
              </circle>
            );
          })}
        </svg>

        <ul className="min-w-0 flex-1 space-y-1.5">
          {buckets.map((bucket) => (
            <li
              key={bucket.stars}
              className="flex items-center gap-2 text-[11px]"
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--color-rating-${bucket.stars})` }}
              />
              <span className="truncate text-ink-muted">
                {t("stars", { count: bucket.stars })}
              </span>
              <span className="ml-auto tabular-nums text-ink-faint">
                {t("percent", { value: bucket.percent })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={statsHref}
        className="mt-4 flex items-center justify-center gap-1 rounded-lg border border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
      >
        {t("seeAll")}
        <ArrowRight className="size-3.5" />
      </Link>
    </section>
  );
}
