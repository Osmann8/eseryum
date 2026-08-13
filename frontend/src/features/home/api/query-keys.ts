import type { TrendingFilter } from "@/features/home/types";

/**
 * Sorgu anahtarlari burada, ayri bir dosyada: hem sunucudaki prefetch hem
 * istemcideki useQuery ayni anahtari kullanmali, yoksa hidrasyon sonrasi
 * ikinci bir istek atilir.
 */
export const homeKeys = {
  trending: (filter: TrendingFilter) => ["works", "trending", filter] as const,
};
