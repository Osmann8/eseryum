"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTrendingWorks } from "@/features/home/api/home-api";
import { homeKeys } from "@/features/home/api/query-keys";
import type { TrendingFilter } from "@/features/home/types";

export function useTrendingWorks(filter: TrendingFilter) {
  return useQuery({
    queryKey: homeKeys.trending(filter),
    queryFn: () => fetchTrendingWorks(filter),
    // Trend listesi dakikada bir degismez; sekmeler arasi gidip gelirken
    // her seferinde istek atilmasin.
    staleTime: 5 * 60 * 1000,
  });
}
