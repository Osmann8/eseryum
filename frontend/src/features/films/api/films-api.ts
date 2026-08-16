import type { Page } from "@/shared/api/api-client";
import type {
  FilmCounts,
  FilmDecade,
  FilmQuery,
  FilmSummary,
  GenreSummary,
  RatingBucket,
  RecommendedFilm,
  WatchActivity,
} from "@/features/films/types";
import {
  MOCK_FILM_COUNTS,
  MOCK_FILMS,
  MOCK_GENRES,
  MOCK_RATING_DISTRIBUTION,
  MOCK_RECOMMENDED_FILMS,
  MOCK_WATCH_ACTIVITY,
} from "@/features/films/mock/films-mock";

/**
 * Filmler sekmesinin veri kapisi. Su an hepsi mock donuyor; her fonksiyonun
 * uzerinde hangi endpoint'e baglanacagi yazili.
 *
 * Filtreleme ve siralama bilerek bu dosyada: gercekte bu is sunucuda,
 * sorgu parametreleriyle yapilacak. Bilesenler listeyi hazir aliyor ki
 * endpoint acildiginda sadece burasi degissin.
 */

/** Sayfa boyutu tasarimdan: genis ekranda alti sutunluk iki sira. */
export const FILM_PAGE_SIZE = 12;

/** GET /api/v1/users/{username}/films/counts */
export async function fetchFilmCounts(): Promise<FilmCounts> {
  return MOCK_FILM_COUNTS;
}

/** GET /api/v1/films/genres?scope=me */
export async function fetchFilmGenres(): Promise<GenreSummary[]> {
  return MOCK_GENRES;
}

/** GET /api/v1/users/{username}/films/activity?period=month */
export async function fetchWatchActivity(): Promise<WatchActivity> {
  return MOCK_WATCH_ACTIVITY;
}

/** GET /api/v1/users/{username}/films/rating-distribution */
export async function fetchRatingDistribution(): Promise<RatingBucket[]> {
  return MOCK_RATING_DISTRIBUTION;
}

/** GET /api/v1/users/{username}/films/recommendations */
export async function fetchRecommendedFilms(): Promise<RecommendedFilm[]> {
  return MOCK_RECOMMENDED_FILMS;
}

/** On yillik dilimin alt ve ust siniri; ust sinir dahil degil. */
const DECADE_RANGES: Record<FilmDecade, { from: number; to: number }> = {
  "2020": { from: 2020, to: Number.POSITIVE_INFINITY },
  "2010": { from: 2010, to: 2020 },
  "2000": { from: 2000, to: 2010 },
  "1990": { from: 1990, to: 2000 },
  OLDER: { from: Number.NEGATIVE_INFINITY, to: 1990 },
};

function matchesCollection(film: FilmSummary, query: FilmQuery): boolean {
  switch (query.collection) {
    case "WATCHED":
      return film.isWatched;
    case "WATCHLIST":
      return film.inWatchlist;
    case "FAVORITES":
      return film.isFavorite;
    case "ALL":
      return true;
  }
}

function matchesFilters(film: FilmSummary, query: FilmQuery): boolean {
  if (query.genre !== undefined && !film.genres.includes(query.genre)) {
    return false;
  }

  if (query.minRating !== undefined && film.rating < query.minRating) {
    return false;
  }

  if (query.decade !== undefined) {
    const { from, to } = DECADE_RANGES[query.decade];
    if (film.year < from || film.year >= to) {
      return false;
    }
  }

  return true;
}

function compareFilms(
  a: FilmSummary,
  b: FilmSummary,
  sort: FilmQuery["sort"],
): number {
  switch (sort) {
    case "NEWEST":
      return b.year - a.year;
    case "OLDEST":
      return a.year - b.year;
    case "RATING":
      return b.rating - a.rating;
    case "TITLE":
      // Turkce siralama: "Ç" C'den sonra, "I" ve "İ" ayri harfler.
      return a.title.localeCompare(b.title, "tr");
  }
}

/**
 * GET /api/v1/users/{username}/films
 *   ?collection=WATCHED&sort=NEWEST&decade=2010&minRating=4&genre=drama
 *   &page=0&size=12
 *
 * Cevap Spring `Page` sekli: "Daha Fazlasini Gor" dugmesi `last` alanina
 * bakiyor, toplam sayiyi kendi hesaplamiyor.
 */
export async function fetchFilms(
  query: FilmQuery,
  page = 0,
): Promise<Page<FilmSummary>> {
  const matched = MOCK_FILMS.filter(
    (film) => matchesCollection(film, query) && matchesFilters(film, query),
  ).sort((a, b) => compareFilms(a, b, query.sort));

  const start = page * FILM_PAGE_SIZE;
  const content = matched.slice(start, start + FILM_PAGE_SIZE);
  const totalPages = Math.max(Math.ceil(matched.length / FILM_PAGE_SIZE), 1);

  return {
    content,
    number: page,
    size: FILM_PAGE_SIZE,
    totalElements: matched.length,
    totalPages,
    first: page === 0,
    last: page >= totalPages - 1,
  };
}
