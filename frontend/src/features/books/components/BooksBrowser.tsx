"use client";

import { useState, type ReactNode } from "react";
import { DEFAULT_BOOK_QUERY } from "@/features/books/api/books-api";
import { BooksCatalog } from "@/features/books/components/BooksCatalog";
import { BooksToolbar } from "@/features/books/components/BooksToolbar";
import type { GenreSummary } from "@/features/works/types";
import type { BookQuery } from "@/features/books/types";

interface BooksBrowserProps {
  genres: GenreSummary[];
  /**
   * Oneri satiri. Filtrelere bagli olmadigi icin durumun icine girmiyor;
   * sunucuda cizilip buraya cocuk olarak veriliyor ki sirasi (cubuk -
   * oneriler - katalog) korunsun.
   */
  children: ReactNode;
}

/**
 * Filtre durumunun tek sahibi. Ust cubuktaki haplarla "Tum Kitaplar"
 * sekmeleri iki ayri satir ama tek bir secim: ikisi de buradaki `query`yi
 * yazar, boylece birbirinden habersiz iki liste olusmaz.
 */
export function BooksBrowser({ genres, children }: BooksBrowserProps) {
  const [query, setQuery] = useState<BookQuery>(DEFAULT_BOOK_QUERY);

  function updateQuery(patch: Partial<BookQuery>) {
    setQuery((previous) => ({ ...previous, ...patch }));
  }

  // "Temizle" koleksiyon sekmesini ve siralamayi korur; kullanici sekmede
  // kalmak isteyip filtreden cikmak istiyor.
  function resetFilters() {
    setQuery((previous) => ({
      collection: previous.collection,
      sort: previous.sort,
    }));
  }

  return (
    <>
      <BooksToolbar
        query={query}
        genres={genres}
        onChange={updateQuery}
        onReset={resetFilters}
      />

      {children}

      <BooksCatalog
        query={query}
        onCollectionChange={(collection) => updateQuery({ collection })}
      />
    </>
  );
}
