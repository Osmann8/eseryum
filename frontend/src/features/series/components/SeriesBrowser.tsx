"use client";

import { useState, type ReactNode } from "react";
import { DEFAULT_SERIES_QUERY } from "@/features/series/api/series-api";
import { SeriesCatalog } from "@/features/series/components/SeriesCatalog";
import { SeriesToolbar } from "@/features/series/components/SeriesToolbar";
import type { GenreSummary } from "@/features/works/types";
import type { SeriesQuery } from "@/features/series/types";

interface SeriesBrowserProps {
  genres: GenreSummary[];
  /**
   * Oneri satiri. Filtrelere bagli olmadigi icin durumun icine girmiyor;
   * sunucuda cizilip buraya cocuk olarak veriliyor ki tasarimdaki sirasi
   * (cubuk - oneriler - katalog) korunsun.
   */
  children: ReactNode;
}

/**
 * Filtre durumunun tek sahibi. Ust cubuktaki haplarla "Tum Diziler"
 * sekmeleri iki ayri satir ama tek bir secim: ikisi de buradaki `query`yi
 * yazar, boylece birbirinden habersiz iki liste olusmaz.
 */
export function SeriesBrowser({ genres, children }: SeriesBrowserProps) {
  const [query, setQuery] = useState<SeriesQuery>(DEFAULT_SERIES_QUERY);

  function updateQuery(patch: Partial<SeriesQuery>) {
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
      <SeriesToolbar
        query={query}
        genres={genres}
        onChange={updateQuery}
        onReset={resetFilters}
      />

      {children}

      <SeriesCatalog
        query={query}
        onCollectionChange={(collection) => updateQuery({ collection })}
      />
    </>
  );
}
