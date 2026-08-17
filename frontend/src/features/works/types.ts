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

/**
 * Koleksiyon sayfalarinin (Filmler, Diziler, ileride Kitaplar) ortak sozlugu.
 *
 * Uc sayfa da ayni ekran: sayaclar, filtre cubugu, oneri satiri, katalog ve
 * sag sutun. Ture ozel olan sadece kart ustundeki bir satir metin ve
 * koleksiyon sekmelerinin adlari; geri kalan her sey burada tanimli.
 */

export const MEDIA_SORTS = ["NEWEST", "OLDEST", "RATING", "TITLE"] as const;

export type MediaSort = (typeof MEDIA_SORTS)[number];

/**
 * Yil filtresi tek tek yillarla degil on yillik dilimlerle calisir: 90 satirlik
 * bir acilir liste kimsenin isine yaramaz. "OLDER" 1990 oncesi demek.
 */
export const MEDIA_DECADES = ["2020", "2010", "2000", "1990", "OLDER"] as const;

export type MediaDecade = (typeof MEDIA_DECADES)[number];

/** Puan filtresi: secilen degerin altindakiler elenir. */
export const MEDIA_MIN_RATINGS = [4.5, 4, 3.5, 3] as const;

export type MediaMinRating = (typeof MEDIA_MIN_RATINGS)[number];

/**
 * Katalog listesinin tum filtreleri; URL sorgu parametreleriyle birebir.
 * Koleksiyon kumesi ture gore degistigi icin tip parametresi var.
 */
export interface MediaQuery<TCollection extends string = string> {
  collection: TCollection;
  sort: MediaSort;
  decade?: MediaDecade;
  minRating?: MediaMinRating;
  /** Tur slug'i (`bilim-kurgu` gibi). */
  genre?: string;
}

/**
 * Kullanicinin esere ait durumu. Bunlar esere degil, esere bakan kisiye ait
 * oldugu icin `Work` uzerinde degil burada.
 */
export interface CollectionFields {
  /** Tur slug'lari; filtre bunlarla eslesir. */
  genres: string[];
  /**
   * Kullanicinin kendi puani. Puanlamadiysa yok - sifir degil.
   *
   * Kartta gosterilmiyor: rozet her kartta ayni seyi (eseryum ortalamasi)
   * yazsin diye. Eser detayi ve inceleme formu bu alani kullanacak.
   */
  userRating?: number;
  isWatched: boolean;
  inWatchlist: boolean;
  isFavorite: boolean;
}

/** Sayfa basligindaki dort sayac. */
export interface CollectionCounts {
  watchedCount: number;
  ratedCount: number;
  watchlistCount: number;
  reviewCount: number;
}

/** Kenar cubugundaki tur listesinin bir satiri. */
export interface GenreSummary {
  slug: string;
  label: string;
  /** Kullanicinin o turde kac eseri var. */
  count: number;
}

/** "Izleme Aktiviten" karti - bu ayin ozeti. */
export interface WatchActivity {
  /** Filmlerde izlenen film, dizilerde izlenen bolum sayisi. */
  itemCount: number;
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
  /** Ortalama bolum suresi; toplam izleme suresi bununla hesaplanir. */
  episodeMinutes: number;
  creator: string;
  country: string;
}

export interface BookDetail extends Work {
  type: "BOOK";
  pageCount: number;
  author: string;
  translator?: string;
  isbn?: string;
}
