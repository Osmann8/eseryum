"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchBooks } from "@/features/books/api/books-api";
import { bookKeys } from "@/features/books/api/query-keys";
import type { BookQuery } from "@/features/books/types";

/**
 * Katalog listesi. "Daha Fazlasini Gor" sayfa sayfa ekledigi icin
 * useInfiniteQuery: gelen sayfalar birikir, filtre degistiginde anahtar
 * degistigi icin bastan baslar.
 */
export function useBooksCatalog(query: BookQuery) {
  return useInfiniteQuery({
    queryKey: bookKeys.catalog(query),
    queryFn: ({ pageParam }) => fetchBooks(query, pageParam),
    initialPageParam: 0,
    // Son sayfadaysak undefined donmek zorunda: hasNextPage bununla kapaniyor.
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    // Koleksiyon sekmeleri arasinda gidip gelmek yeni istek dogurmasin.
    staleTime: 5 * 60 * 1000,
  });
}
