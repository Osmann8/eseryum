import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { ActivityCard } from "@/features/works/components/ActivityCard";
import { useRuntimeLabel } from "@/features/works/hooks/use-runtime-label";
import type { WatchActivity } from "@/features/works/types";

/**
 * Aktivite kartinin film hali. Kartin ikinci kutusu ture gore degisiyor
 * (filmde sure, kitapta sayfa), o yuzden bicimleme burada yapilip hazir
 * metin olarak veriliyor.
 */
export function FilmActivityCard({ activity }: { activity: WatchActivity }) {
  const t = useTranslations("films.activity");
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
