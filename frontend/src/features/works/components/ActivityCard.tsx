import {
  CalendarDays,
  Play,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";
import { useRuntimeLabel } from "@/features/works/hooks/use-runtime-label";
import type { WatchActivity } from "@/features/works/types";

interface ActivityCardProps {
  activity: WatchActivity;
  /**
   * Ilk kutunun etiketi: filmlerde "Izleme", dizilerde "Bolum". Sayilan sey
   * ture gore degistigi icin disaridan geliyor.
   */
  countLabel: string;
}

/**
 * "Izleme Aktiviten" karti: bu ayin dort sayisi. Grafik yok, cunku dort sayi
 * icin eksen cizmek okumayi kolaylastirmiyor.
 */
export function ActivityCard({ activity, countLabel }: ActivityCardProps) {
  const t = useTranslations("media.activity");
  const runtimeLabel = useRuntimeLabel();

  const isUp = activity.changePercent >= 0;

  const tiles = [
    {
      key: "count",
      icon: Play,
      tone: "text-brand-strong",
      label: countLabel,
      value: activity.itemCount.toLocaleString("tr-TR"),
    },
    {
      key: "totalTime",
      icon: CalendarDays,
      tone: "text-brand-strong",
      label: t("label.totalTime"),
      value: runtimeLabel(activity.totalMinutes),
    },
    {
      key: "averageRating",
      icon: Star,
      tone: "text-brand-strong",
      label: t("label.averageRating"),
      value: t("ratingOutOf", {
        value: activity.averageRating.toLocaleString("tr-TR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }),
      }),
    },
    {
      key: "change",
      icon: isUp ? TrendingUp : TrendingDown,
      // Tek yon bilgisi tasiyan kutu: artis/azalis renkten de okunsun. Ok
      // isareti tek basina birakilmadi, renk tek tasiyici degil.
      tone: isUp ? "text-success" : "text-danger",
      label: t("label.change"),
      // Isaret ceviriye birakiliyor: Turkce'de yuzde isareti sayinin onunde.
      value: t(isUp ? "changeUp" : "changeDown", {
        value: Math.abs(activity.changePercent),
      }),
    },
  ];

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <h2 className="text-sm font-semibold text-ink">{t("title")}</h2>
      <p className="mt-0.5 text-[11px] text-ink-faint">{t("subtitle")}</p>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        {tiles.map(({ key, icon: Icon, tone, label, value }) => (
          <div
            key={key}
            className="rounded-lg border border-line bg-surface-2/60 px-3 py-3"
          >
            <Icon
              className={cn("size-4", tone)}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <dd className="mt-2 text-sm font-semibold text-ink">{value}</dd>
            <dt className="mt-0.5 text-[11px] leading-tight text-ink-muted">
              {label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
