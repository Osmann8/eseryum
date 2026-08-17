"use client";

import { useTranslations } from "next-intl";
import { CollectionToolbar } from "@/features/works/components/CollectionToolbar";
import type { GenreSummary } from "@/features/works/types";
import { BOOK_COLLECTIONS, type BookQuery } from "@/features/books/types";

interface BooksToolbarProps {
  query: BookQuery;
  genres: GenreSummary[];
  onChange: (patch: Partial<BookQuery>) => void;
  onReset: () => void;
}

export function BooksToolbar({
  query,
  genres,
  onChange,
  onReset,
}: BooksToolbarProps) {
  const t = useTranslations("books.collection");

  return (
    <CollectionToolbar
      query={query}
      genres={genres}
      collections={BOOK_COLLECTIONS}
      collectionLabel={(collection) => t(collection)}
      onChange={onChange}
      onReset={onReset}
    />
  );
}
