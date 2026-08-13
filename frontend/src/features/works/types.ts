/**
 * Eser tipleri. Kapsam belgesindeki "uc medya, tek tablo" karari burada da
 * gecerli: ortak alanlar `Work` uzerinde, ture ozel alanlar ayri arayuzlerde.
 *
 * Alan adlari Bruno koleksiyonundaki sozlesmeyi takip eder
 * (`/api/v1/works`); controller'lar yazildiginda burasi degil, mock katmani
 * degisecek.
 */

export const WORK_TYPES = ["FILM", "SERIES", "BOOK"] as const;

export type WorkType = (typeof WORK_TYPES)[number];

export interface Work {
  id: number;
  slug: string;
  type: WorkType;
  title: string;
  /** Ozgun baslik; Turkce baslikla farkliysa detayda gosterilir. */
  originalTitle?: string;
  year: number;
  coverUrl?: string;
  /** eseryum ortalamasi, 5 uzerinden yarim yildiz hassasiyetinde. */
  rating: number;
  ratingCount: number;
  /** Dis kaynak puani; yoksa rozet cizilmez. */
  imdbRating?: number;
}

export interface FilmDetail extends Work {
  type: "FILM";
  runtimeMinutes: number;
  director: string;
  country: string;
}

export interface SeriesDetail extends Work {
  type: "SERIES";
  seasonCount: number;
  episodeCount: number;
}

export interface BookDetail extends Work {
  type: "BOOK";
  pageCount: number;
  author: string;
  translator?: string;
  isbn?: string;
}
