import type { FilmQuery } from "@/features/films/types";

/**
 * Sorgu anahtarlari ayri dosyada: sunucudaki prefetch ile istemcideki
 * useQuery ayni anahtari kullanmali, yoksa hidrasyondan sonra ikinci bir
 * istek atilir.
 *
 * Katalog anahtari nesne tasiyor; TanStack anahtarlari alan sirasindan
 * bagimsiz hash'ledigi icin bu guvenli.
 */
export const filmKeys = {
  all: ["films"] as const,
  recommendations: () => [...filmKeys.all, "recommendations"] as const,
  catalog: (query: FilmQuery) => [...filmKeys.all, "catalog", query] as const,
};
