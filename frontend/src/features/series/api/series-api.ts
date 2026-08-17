import type { Page } from "@/shared/api/api-client";
import { queryCollection } from "@/features/works/api/collection-query";
import type {
  CollectionCounts,
  GenreSummary,
  RatingBucket,
  WatchActivity,
} from "@/features/works/types";
import type {
  RecommendedSeries,
  SeriesCollection,
  SeriesQuery,
  SeriesSummary,
} from "@/features/series/types";
import {
  MOCK_GENRES,
  MOCK_RATING_DISTRIBUTION,
  MOCK_RECOMMENDED_SERIES,
  MOCK_SERIES,
  MOCK_SERIES_COUNTS,
  MOCK_WATCH_ACTIVITY,
} from "@/features/series/mock/series-mock";

/**
 * Diziler sekmesinin veri kapisi. Su an hepsi mock donuyor; her fonksiyonun
 * uzerinde hangi endpoint'e baglanacagi yazili.
 *
 * Filtreleme ve siralama queryCollection'da (features/works): Filmler ile ayni
 * kod, boylece iki sayfada "1990'lar" ayni araliga denk geliyor.
 */

/** Sayfa boyutu tasarimdan: genis ekranda alti sutunluk iki sira. */
export const SERIES_PAGE_SIZE = 12;

/**
 * Sayfa acildiginda gecerli olan sorgu. Sunucudaki prefetch ile istemcideki
 * ilk durum ayni olmali, yoksa hidrasyondan sonra bos yere ikinci bir istek
 * atilir - bu yuzden tek bir sabit.
 */
export const DEFAULT_SERIES_QUERY: SeriesQuery = {
  collection: "ALL",
  sort: "NEWEST",
};

/** GET /api/v1/users/{username}/series/counts */
export async function fetchSeriesCounts(): Promise<CollectionCounts> {
  return MOCK_SERIES_COUNTS;
}

/** GET /api/v1/series/genres?scope=me */
export async function fetchSeriesGenres(): Promise<GenreSummary[]> {
  return MOCK_GENRES;
}

/** GET /api/v1/users/{username}/series/activity?period=month */
export async function fetchWatchActivity(): Promise<WatchActivity> {
  return MOCK_WATCH_ACTIVITY;
}

/** GET /api/v1/users/{username}/series/rating-distribution */
export async function fetchRatingDistribution(): Promise<RatingBucket[]> {
  return MOCK_RATING_DISTRIBUTION;
}

/** GET /api/v1/users/{username}/series/recommendations */
export async function fetchRecommendedSeries(): Promise<RecommendedSeries[]> {
  return MOCK_RECOMMENDED_SERIES;
}

function matchesCollection(series: SeriesSummary, collection: string): boolean {
  switch (collection as SeriesCollection) {
    case "WATCHING":
      return series.isWatching;
    case "WATCHED":
      return series.isWatched;
    case "WATCHLIST":
      return series.inWatchlist;
    case "FAVORITES":
      return series.isFavorite;
    case "ALL":
      return true;
  }
}

/**
 * GET /api/v1/users/{username}/series
 *   ?collection=WATCHING&sort=NEWEST&decade=2010&minRating=4&genre=drama
 *   &page=0&size=12
 *
 * Cevap Spring `Page` sekli: "Daha Fazlasini Gor" dugmesi `last` alanina
 * bakiyor, toplam sayiyi kendi hesaplamiyor.
 */
export async function fetchSeries(
  query: SeriesQuery,
  page = 0,
): Promise<Page<SeriesSummary>> {
  return queryCollection(MOCK_SERIES, query, matchesCollection, {
    page,
    size: SERIES_PAGE_SIZE,
  });
}
