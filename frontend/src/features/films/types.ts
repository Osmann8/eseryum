import type { FilmDetail } from "@/features/works/types";

/**
 * Filmler sekmesinin veri sekilleri.
 *
 * Sayfa kullanicinin kendi koleksiyonunu gosteriyor: bir filmin "izlendi",
 * "izleme listesinde" ya da "favori" olmasi esere degil, esere bakan kisiye
 * ait bir bilgi. Bu yuzden bayraklar `Work` uzerinde degil burada.
 */

/** Ust seritteki dort sayac. */
export interface FilmCounts {
  watchedCount: number;
  ratedCount: number;
  watchlistCount: number;
  reviewCount: number;
}

/**
 * Ust filtre haplari ve "Tum Filmler" sekmeleri ayni kumeyi kullanir; tasarimda
 * iki yerde duruyorlar ama tek bir secim var.
 */
export const FILM_COLLECTIONS = [
  "ALL",
  "WATCHED",
  "WATCHLIST",
  "FAVORITES",
] as const;

export type FilmCollection = (typeof FILM_COLLECTIONS)[number];

export const FILM_SORTS = ["NEWEST", "OLDEST", "RATING", "TITLE"] as const;

export type FilmSort = (typeof FILM_SORTS)[number];

/**
 * Yil filtresi tek tek yillarla degil on yillik dilimlerle calisir: 90 satirlik
 * bir acilir liste kimsenin isine yaramaz. "OLDER" 1990 oncesi demek.
 */
export const FILM_DECADES = ["2020", "2010", "2000", "1990", "OLDER"] as const;

export type FilmDecade = (typeof FILM_DECADES)[number];

/** Puan filtresi: secilen degerin altindakiler elenir. */
export const FILM_MIN_RATINGS = [4.5, 4, 3.5, 3] as const;

export type FilmMinRating = (typeof FILM_MIN_RATINGS)[number];

/** Katalog listesinin tum filtreleri; URL sorgu parametreleriyle birebir. */
export interface FilmQuery {
  collection: FilmCollection;
  sort: FilmSort;
  decade?: FilmDecade;
  minRating?: FilmMinRating;
  /** Tur slug'i (`bilim-kurgu` gibi). */
  genre?: string;
}

export interface FilmSummary extends FilmDetail {
  /** Tur slug'lari; filtre bunlarla eslesir. */
  genres: string[];
  /** Kullanicinin kendi puani. Puanlamadiysa yok - sifir degil. */
  userRating?: number;
  isWatched: boolean;
  inWatchlist: boolean;
  isFavorite: boolean;
}

export interface RecommendedFilm extends FilmSummary {
  /** Zevk ortusmesi yuzdesi (0-100); oneri sirasi bu degere gore. */
  matchScore: number;
}

/** Kenar cubugundaki tur listesinin bir satiri. */
export interface GenreSummary {
  slug: string;
  label: string;
  /** Kullanicinin o turde kac filmi var. */
  count: number;
}

/** "Izleme Aktiviten" karti - bu ayin ozeti. */
export interface WatchActivity {
  filmCount: number;
  totalMinutes: number;
  /** 5 uzerinden, yarim yildiz hassasiyetinde. */
  averageRating: number;
  /** Gecen aya gore degisim; negatif olabilir. */
  changePercent: number;
}

/** Puan dagilimi halkasinin bir dilimi. */
export interface RatingBucket {
  /** 1-5 arasi yildiz sayisi. */
  stars: number;
  /** Yuzde; dilimlerin toplami 100. */
  percent: number;
}
