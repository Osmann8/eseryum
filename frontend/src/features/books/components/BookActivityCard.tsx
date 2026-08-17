import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { ActivityCard } from "@/features/works/components/ActivityCard";
import type { ReadingActivity } from "@/features/books/types";

/**
 * Aktivite kartinin kitap hali. Ikinci kutuda sure degil sayfa var: kitapta
 * "ekranda gecen sure" diye bir olcu yok.
 */
export function BookActivityCard({ activity }: { activity: ReadingActivity }) {
  const t = useTranslations("books.activity");

  return (
    <ActivityCard
      title={t("title")}
      activity={activity}
      countLabel={t("countLabel")}
      total={{
        label: t("totalLabel"),
        value: activity.totalPages.toLocaleString("tr-TR"),
        icon: BookOpen,
      }}
    />
  );
}
