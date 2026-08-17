import type { BookQuery } from "@/features/books/types";

/**
 * Sorgu anahtarlari ayri dosyada: sunucudaki prefetch ile istemcideki
 * useQuery ayni anahtari kullanmali, yoksa hidrasyondan sonra ikinci bir
 * istek atilir.
 */
export const bookKeys = {
  all: ["books"] as const,
  catalog: (query: BookQuery) => [...bookKeys.all, "catalog", query] as const,
};
