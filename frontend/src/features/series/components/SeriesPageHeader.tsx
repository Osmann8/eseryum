import { Tv } from "lucide-react";
import { useTranslations } from "next-intl";
import { CollectionPageHeader } from "@/features/works/components/CollectionPageHeader";
import type { CollectionCounts } from "@/features/works/types";

export function SeriesPageHeader({ counts }: { counts: CollectionCounts }) {
  const t = useTranslations("series");

  return (
    <CollectionPageHeader
      title={t("title")}
      subtitle={t("subtitle")}
      icon={Tv}
      actionLabel={t("addSeries")}
      counts={[
        { key: "watched", label: t("counts.watched"), value: counts.watchedCount },
        { key: "rated", label: t("counts.rated"), value: counts.ratedCount },
        {
          key: "watchlist",
          label: t("counts.watchlist"),
          value: counts.watchlistCount,
        },
        { key: "reviews", label: t("counts.reviews"), value: counts.reviewCount },
      ]}
    />
  );
}
