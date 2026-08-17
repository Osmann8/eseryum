import type {
  CollectionFields,
  FilmDetail,
  MediaQuery,
} from "@/features/works/types";

/**
 * Filmler sekmesine ozel tipler. Filtre, sayac, tur ve aktivite sekilleri uc
 * koleksiyon sayfasinda da ayni oldugu icin features/works/types.ts'te;
 * burada sadece filme ozel olanlar var.
 */

/**
 * Ust filtre haplari ve "Tum Filmler" sekmeleri ayni kumeyi kullanir; tasarimda
 * iki yerde duruyorlar ama tek bir secim var.
 *
 * "Devam eden" yok: bir film ya izlenmis ya izlenmemistir.
 */
export const FILM_COLLECTIONS = [
  "ALL",
  "COMPLETED",
  "PLANNED",
  "FAVORITES",
] as const;

export type FilmCollection = (typeof FILM_COLLECTIONS)[number];

export type FilmQuery = MediaQuery<FilmCollection>;

export interface FilmSummary extends FilmDetail, CollectionFields {}

export interface RecommendedFilm extends FilmSummary {
  /** Zevk ortusmesi yuzdesi (0-100); oneri sirasi bu degere gore. */
  matchScore: number;
}
