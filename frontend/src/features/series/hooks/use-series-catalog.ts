"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSeries } from "@/features/series/api/series-api";
import { seriesKeys } from "@/features/series/api/query-keys";
import type { SeriesQuery } from "@/features/series/types";

/**
 * Katalog listesi. "Daha Fazlasini Gor" sayfa sayfa ekledigi icin
 * useInfiniteQuery: gelen sayfalar birikir, filtre degistiginde anahtar
 * degistigi icin bastan baslar.
 */
export function useSeriesCatalog(query: SeriesQuery) {
  return useInfiniteQuery({
    queryKey: seriesKeys.catalog(query),
    queryFn: ({ pageParam }) => fetchSeries(query, pageParam),
    initialPageParam: 0,
    // Son sayfadaysak undefined donmek zorunda: hasNextPage bununla kapaniyor.
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    // Koleksiyon sekmeleri arasinda gidip gelmek yeni istek dogurmasin.
    staleTime: 5 * 60 * 1000,
  });
}
