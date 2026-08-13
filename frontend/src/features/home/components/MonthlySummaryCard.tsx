import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { MonthlySummary } from "@/features/home/types";

/**
 * Kenar cubugunun altindaki ozet. Sutun grafigi kasitli olarak kutuphanesiz:
 * eksen, tooltip ve etiket yok, sadece "bu ay ne kadar kayit girdim" hissi.
 */
export function MonthlySummaryCard({ summary }: { summary: MonthlySummary }) {
  const t = useTranslations("home.monthly");

  const counts = [
    { key: "film", value: summary.filmCount },
    { key: "series", value: summary.seriesCount },
    { key: "book", value: summary.bookCount },
  ];

  const peak = Math.max(...summary.activity, 1);

  return (
    <div className="rounded-xl border border-line bg-surface-2/60 p-3">
      <h2 className="text-sm font-medium text-ink">{t("title")}</h2>

      <dl className="mt-3 flex gap-4">
        {counts.map(({ key, value }) => (
          <div key={key}>
            <dd className="text-lg font-semibold text-brand-strong">{value}</dd>
            <dt className="text-[11px] text-ink-muted">{t(key)}</dt>
          </div>
        ))}
      </dl>

      <div aria-hidden="true" className="mt-3 flex h-8 items-end gap-1">
        {summary.activity.map((value, index) => (
          <span
            key={index}
            className="flex-1 rounded-sm bg-brand/70"
            style={{ height: `${Math.max((value / peak) * 100, 8)}%` }}
          />
        ))}
      </div>

      <Link
        href="/diary"
        className="mt-3 inline-flex items-center gap-1 text-xs text-brand-strong hover:underline"
      >
        {t("seeSummary")}
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
