import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { ActivityCard } from "@/features/works/components/ActivityCard";
import { useRuntimeLabel } from "@/features/works/hooks/use-runtime-label";
import type { WatchActivity } from "@/features/works/types";

/** Aktivite kartinin dizi hali: sayilan sey bolum, ikinci kutu yine sure. */
export function SeriesActivityCard({ activity }: { activity: WatchActivity }) {
  const t = useTranslations("series.activity");
  const runtimeLabel = useRuntimeLabel();

  return (
    <ActivityCard
      title={t("title")}
      activity={activity}
      countLabel={t("countLabel")}
      total={{
        label: t("totalLabel"),
        value: runtimeLabel(activity.totalMinutes),
        icon: CalendarDays,
      }}
    />
  );
}
