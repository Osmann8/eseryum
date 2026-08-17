"use client";

import { useTranslations } from "next-intl";
import { RecommendationRow } from "@/features/works/components/RecommendationRow";
import { useBookMeta } from "@/features/books/hooks/use-book-meta";
import type { RecommendedBook } from "@/features/books/types";

/**
 * "Sana Ozel Oneriler" satirinin kitap hali: satirin kendisi ortak, buradan
 * gecen tek sey kartin ve liste satirinin alt metni.
 */
export function RecommendedBooks({ books }: { books: RecommendedBook[] }) {
  const t = useTranslations("books.recommendations");
  const meta = useBookMeta();

  return (
    <RecommendationRow
      items={books}
      emptyLabel={t("empty")}
      meta={meta.card}
      listMeta={meta.list}
    />
  );
}
