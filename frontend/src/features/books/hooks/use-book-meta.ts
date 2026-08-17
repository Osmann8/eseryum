import { useTranslations } from "next-intl";
import type { BookSummary } from "@/features/books/types";

/**
 * Kartin ve liste satirinin alt metni. Kartta yazar yok, sayfa var
 * ("1949 • 328 sayfa"); liste satirinda yazar ve - varsa - cevirmen de
 * geciyor, cunku Turkce baskida kitabi ayirt eden sey cogu zaman ceviridir.
 */
export function useBookMeta() {
  const t = useTranslations("books.meta");

  return {
    card: (book: BookSummary) =>
      `${book.year} • ${t("pages", { count: book.pageCount })}`,
    list: (book: BookSummary) =>
      [
        String(book.year),
        book.author,
        book.translator ? t("translator", { name: book.translator }) : null,
        t("pages", { count: book.pageCount }),
      ]
        .filter(Boolean)
        .join(" • "),
  };
}
