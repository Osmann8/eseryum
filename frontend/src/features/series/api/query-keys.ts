import type { SeriesQuery } from "@/features/series/types";

/**
 * Sorgu anahtarlari ayri dosyada: sunucudaki prefetch ile istemcideki
 * useQuery ayni anahtari kullanmali, yoksa hidrasyondan sonra ikinci bir
 * istek atilir.
 *
 * Katalog anahtari nesne tasiyor; TanStack anahtarlari alan sirasindan
 * bagimsiz hash'ledigi icin bu guvenli.
 */
export const seriesKeys = {
  all: ["series"] as const,
  catalog: (query: SeriesQuery) => [...seriesKeys.all, "catalog", query] as const,
};
