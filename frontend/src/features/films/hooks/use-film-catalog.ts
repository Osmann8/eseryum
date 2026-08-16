"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFilms } from "@/features/films/api/films-api";
import { filmKeys } from "@/features/films/api/query-keys";
import type { FilmQuery } from "@/features/films/types";

/**
 * Katalog listesi. "Daha Fazlasini Gor" sayfa sayfa ekledigi icin
 * useInfiniteQuery: gelen sayfalar birikir, filtre degistiginde anahtar
 * degistigi icin bastan baslar.
 */
export function useFilmCatalog(query: FilmQuery) {
  return useInfiniteQuery({
    queryKey: filmKeys.catalog(query),
    queryFn: ({ pageParam }) => fetchFilms(query, pageParam),
    initialPageParam: 0,
    // Son sayfadaysak undefined donmek zorunda: hasNextPage bununla kapaniyor.
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    // Koleksiyon sekmeleri arasinda gidip gelmek yeni istek dogurmasin.
    staleTime: 5 * 60 * 1000,
  });
}
