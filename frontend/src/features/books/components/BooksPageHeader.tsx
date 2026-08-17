import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { CollectionPageHeader } from "@/features/works/components/CollectionPageHeader";
import type { CollectionCounts } from "@/features/works/types";

export function BooksPageHeader({ counts }: { counts: CollectionCounts }) {
  const t = useTranslations("books");

  return (
    <CollectionPageHeader
      title={t("title")}
      subtitle={t("subtitle")}
      icon={BookOpen}
      actionLabel={t("addBook")}
      counts={[
        { key: "read", label: t("counts.read"), value: counts.watchedCount },
        { key: "rated", label: t("counts.rated"), value: counts.ratedCount },
        {
          key: "readingList",
          label: t("counts.readingList"),
          value: counts.watchlistCount,
        },
        { key: "reviews", label: t("counts.reviews"), value: counts.reviewCount },
      ]}
    />
  );
}
