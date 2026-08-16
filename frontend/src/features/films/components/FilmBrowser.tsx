"use client";

import { useState, type ReactNode } from "react";
import { DEFAULT_FILM_QUERY } from "@/features/films/api/films-api";
import { FilmCatalog } from "@/features/films/components/FilmCatalog";
import { FilmToolbar } from "@/features/films/components/FilmToolbar";
import type { FilmQuery, GenreSummary } from "@/features/films/types";

interface FilmBrowserProps {
  genres: GenreSummary[];
  /**
   * Oneri satiri. Filtrelere bagli olmadigi icin durumun icine girmiyor;
   * sunucuda cizilip buraya cocuk olarak veriliyor ki tasarimdaki sirasi
   * (cubuk - oneriler - katalog) korunsun.
   */
  children: ReactNode;
}

/**
 * Filtre durumunun tek sahibi. Ust cubuktaki haplarla "Tum Filmler"
 * sekmeleri tasarimda iki ayri satir ama tek bir secim: ikisi de buradaki
 * `query`yi yazar, boylece birbirinden habersiz iki liste olusmaz.
 */
export function FilmBrowser({ genres, children }: FilmBrowserProps) {
  const [query, setQuery] = useState<FilmQuery>(DEFAULT_FILM_QUERY);

  function updateQuery(patch: Partial<FilmQuery>) {
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
      <FilmToolbar
        query={query}
        genres={genres}
        onChange={updateQuery}
        onReset={resetFilters}
      />

      {children}

      <FilmCatalog
        query={query}
        onCollectionChange={(collection) => updateQuery({ collection })}
      />
    </>
  );
}
