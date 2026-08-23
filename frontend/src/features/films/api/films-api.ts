import type { Page } from "@/shared/api/api-client";
import { queryCollection } from "@/features/works/api/collection-query";
import type {
  CollectionCounts,
  GenreSummary,
  RatingBucket,
  WatchActivity,
} from "@/features/works/types";
import type {
  FilmQuery,
  FilmSummary,
  RecommendedFilm,
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
 * Filtreleme ve siralama queryCollection'da: gercekte bu is sunucuda, sorgu
 * parametreleriyle yapilacak. Bilesenler listeyi hazir aliyor ki endpoint
 * acildiginda sadece bu dosya degissin.
 */

/** Sayfa boyutu tasarimdan: genis ekranda alti sutunluk iki sira. */
export const FILM_PAGE_SIZE = 12;

/**
 * Sayfa acildiginda gecerli olan sorgu. Sunucudaki prefetch ile istemcideki
 * ilk durum ayni olmali, yoksa hidrasyondan sonra bos yere ikinci bir istek
 * atilir - bu yuzden tek bir sabit.
 */
export const DEFAULT_FILM_QUERY: FilmQuery = {
  collection: "ALL",
  sort: "NEWEST",
};

/** GET /api/users/{id}/films/counts */
export async function fetchFilmCounts(): Promise<CollectionCounts> {
  return MOCK_FILM_COUNTS;
}

/** GET /api/films/genres?scope=me */
export async function fetchFilmGenres(): Promise<GenreSummary[]> {
  return MOCK_GENRES;
}

/** GET /api/users/{id}/films/activity?period=month */
export async function fetchWatchActivity(): Promise<WatchActivity> {
  return MOCK_WATCH_ACTIVITY;
}

/** GET /api/users/{id}/films/rating-distribution */
export async function fetchRatingDistribution(): Promise<RatingBucket[]> {
  return MOCK_RATING_DISTRIBUTION;
}

/** GET /api/users/{id}/films/recommendations */
export async function fetchRecommendedFilms(): Promise<RecommendedFilm[]> {
  return MOCK_RECOMMENDED_FILMS;
}

/**
 * GET /api/users/{id}/films
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
  return queryCollection(MOCK_FILMS, query, { page, size: FILM_PAGE_SIZE });
}
