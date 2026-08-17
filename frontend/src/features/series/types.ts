import type {
  CollectionFields,
  MediaQuery,
  SeriesDetail,
} from "@/features/works/types";

/**
 * Diziler sekmesine ozel tipler. Filtre, sayac, tur ve aktivite sekilleri uc
 * koleksiyon sayfasinda da ayni oldugu icin features/works/types.ts'te;
 * burada sadece diziye ozel olanlar var.
 */

/**
 * Filmlerden farkli olarak "Izliyorum" da bir koleksiyon: bir dizi baslamis
 * ama bitmemis olabilir, filmde boyle bir ara durum yok.
 */
export const SERIES_COLLECTIONS = [
  "ALL",
  "IN_PROGRESS",
  "COMPLETED",
  "PLANNED",
  "FAVORITES",
] as const;

export type SeriesCollection = (typeof SERIES_COLLECTIONS)[number];

export type SeriesQuery = MediaQuery<SeriesCollection>;

export interface SeriesSummary extends SeriesDetail, CollectionFields {
  /**
   * Izlenen bolum sayisi. Bitmis dizide `episodeCount`a esit, izleme
   * listesindekinde sifir; ilerleme cubugu bu ikisinin oranini cizer.
   */
  watchedEpisodes: number;
}

export interface RecommendedSeries extends SeriesSummary {
  /** Zevk ortusmesi yuzdesi (0-100); oneri sirasi bu degere gore. */
  matchScore: number;
}
