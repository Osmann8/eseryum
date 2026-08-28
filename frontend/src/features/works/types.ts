/**
 * Eser tipleri. Kapsam belgesindeki "uc medya, tek tablo" karari burada da
 * gecerli: ortak alanlar `Work` uzerinde, ture ozel alanlar ayri arayuzlerde.
 *
 * Alan adlari docs/api-endpoints.md'deki sozlesmeyi takip eder; tur
 * bagimsiz kaynagin adi orada `media` (`/api/media`), arayuzde `Work`.
 * Controller'lar yazildiginda burasi degil, mock katmani degisecek.
 */

export const WORK_TYPES = ["FILM", "SERIES", "BOOK"] as const;

export type WorkType = (typeof WORK_TYPES)[number];

export interface Work {
  /**
   * Adresleme anahtari; `media.id` ile birebir. Slug yok: baslik benzersiz
   * degil (`Dune` hem 1965 kitabi hem 2021 filmi) ve tum turler tek id
   * uzayini paylastigi icin (`film_detail.media_id` hem PK hem FK) bir
   * slug'i tek bir esere baglamak ek cakisma stratejisi isterdi.
   */
  id: number;
  type: WorkType;
  title: string;
  /** Ozgun baslik; Turkce baslikla farkliysa detayda gosterilir. */
  originalTitle?: string;
  year: number;
  coverUrl?: string;
  /**
   * eseryum ortalamasi, 0-10. Skala veritabaniyla ayni: tekil puanlar 0.5
   * adimli (`ck_log_entry_rating_scale`), ortalama ara deger alabilir
   * (`media.rating_avg` uzerinde adim kisiti yok).
   */
  rating: number;
  ratingCount: number;
  /**
   * Dis kaynak puani; yoksa rozet cizilmez. IMDb de 0-10 kullaniyor, yani
   * `rating` ile ayni skala - ikisi kartta ayri rozetlerle gosteriliyor,
   * cunku ayni olcekte olmalari ayni sey olduklari anlamina gelmiyor.
   */
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
export const MEDIA_MIN_RATINGS = [9, 8, 7, 6] as const;

export type MediaMinRating = (typeof MEDIA_MIN_RATINGS)[number];

/**
 * Koleksiyon sekmeleri. Adlar ture gore degil duruma gore: ayni durum filmde
 * "İzlediklerim", dizide "Bitirdiklerim", kitapta "Okuduklarım" diye
 * yaziliyor - ceviri her sekmenin kendi dosyasinda, mantik tek yerde.
 */
export const COLLECTION_FILTERS = [
  "ALL",
  "IN_PROGRESS",
  "COMPLETED",
  "PLANNED",
  "FAVORITES",
] as const;

export type CollectionFilter = (typeof COLLECTION_FILTERS)[number];

/**
 * Katalog listesinin tum filtreleri; URL sorgu parametreleriyle birebir.
 * Koleksiyon kumesi ture gore degistigi icin tip parametresi var (filmde
 * "devam eden" diye bir durum yok).
 */
export interface MediaQuery<
  TCollection extends CollectionFilter = CollectionFilter,
> {
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
   * Kullanicinin kendi puani, 0-10 ve 0.5 adimli. Puanlamadiysa yok - sifir
   * degil; 0 gecerli bir puan (`ck_log_entry_rating_scale` 0'a izin veriyor).
   *
   * Kartta gosterilmiyor: rozet her kartta ayni seyi (eseryum ortalamasi)
   * yazsin diye. Eser detayi ve inceleme formu bu alani kullanacak.
   */
  userRating?: number;
  /** Bitirilmis: film izlendi, dizi bitti, kitap okundu. */
  isCompleted: boolean;
  /** Listeye alinmis ama henuz baslanmamis. */
  isPlanned: boolean;
  isFavorite: boolean;
  /**
   * Baslanmis ama bitmemis. Filmde boyle bir ara durum yok, o yuzden istege
   * bagli: alan yoksa "devam etmiyor" demek.
   */
  isInProgress?: boolean;
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

/**
 * "Aktiviten" kartinin ortak alanlari - bu ayin ozeti. Kartin ikinci kutusu
 * ture gore degistigi icin (film/dizide sure, kitapta sayfa) burada degil,
 * sayfanin kendi tipinde.
 */
export interface ActivitySummary {
  /** Filmlerde izlenen film, dizilerde bolum, kitaplarda kitap sayisi. */
  itemCount: number;
  /** 0-10; ortalama oldugu icin 0.5 adimina uymak zorunda degil. */
  averageRating: number;
  /** Gecen aya gore degisim; negatif olabilir. */
  changePercent: number;
}

/** Film ve dizi: bu ay ekranda gecen sure. */
export interface WatchActivity extends ActivitySummary {
  totalMinutes: number;
}

/** Puan dagilimi halkasinin bir dilimi. */
export interface RatingBucket {
  /**
   * Puan bandi, 1-5. Skala 0-10 ve 0.5 adimli oldugu icin 21 olasi deger
   * var; halkaya 21 dilim cizilmez, ikiser puanlik bes banda toplaniyor:
   * 5 = 8.5-10, 4 = 6.5-8, 3 = 4.5-6, 2 = 2.5-4, 1 = 0-2.
   *
   * Band sayisi bes kalmali: `--color-rating-1..5` (globals.css) tek hue'nun
   * bes adimi ve halka bu adimlarla ciziliyor.
   */
  band: number;
  /** Yuzde; dilimlerin toplami 100. */
  percent: number;
}

export interface FilmDetail extends Work {
  type: "FILM";
  runtimeMinutes: number;
  director: string;
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
