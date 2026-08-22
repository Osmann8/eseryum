import type { Page } from "@/shared/api/api-client";
import { queryCollection } from "@/features/works/api/collection-query";
import type {
  CollectionCounts,
  GenreSummary,
  RatingBucket,
} from "@/features/works/types";
import type {
  BookQuery,
  BookSummary,
  ReadingActivity,
  RecommendedBook,
} from "@/features/books/types";
import {
  MOCK_BOOK_COUNTS,
  MOCK_BOOKS,
  MOCK_GENRES,
  MOCK_RATING_DISTRIBUTION,
  MOCK_READING_ACTIVITY,
  MOCK_RECOMMENDED_BOOKS,
} from "@/features/books/mock/books-mock";

/**
 * Kitaplar sekmesinin veri kapisi. Su an hepsi mock donuyor; her fonksiyonun
 * uzerinde hangi endpoint'e baglanacagi yazili.
 *
 * Kitap verisi projenin en pahali kalemi (teknoloji belgesi): baslik/ceviri
 * eslemesi elle temizlik gerektirecek. Bilesenler bu isten habersiz kalsin
 * diye tek kapi burasi.
 */

/** Sayfa boyutu tasarimdan: genis ekranda alti sutunluk iki sira. */
export const BOOK_PAGE_SIZE = 12;

/**
 * Sayfa acildiginda gecerli olan sorgu. Sunucudaki prefetch ile istemcideki
 * ilk durum ayni olmali, yoksa hidrasyondan sonra bos yere ikinci bir istek
 * atilir - bu yuzden tek bir sabit.
 */
export const DEFAULT_BOOK_QUERY: BookQuery = {
  collection: "ALL",
  sort: "NEWEST",
};

/** GET /api/users/{id}/books/counts */
export async function fetchBookCounts(): Promise<CollectionCounts> {
  return MOCK_BOOK_COUNTS;
}

/** GET /api/books/genres?scope=me */
export async function fetchBookGenres(): Promise<GenreSummary[]> {
  return MOCK_GENRES;
}

/** GET /api/users/{id}/books/activity?period=month */
export async function fetchReadingActivity(): Promise<ReadingActivity> {
  return MOCK_READING_ACTIVITY;
}

/** GET /api/users/{id}/books/rating-distribution */
export async function fetchRatingDistribution(): Promise<RatingBucket[]> {
  return MOCK_RATING_DISTRIBUTION;
}

/** GET /api/users/{id}/books/recommendations */
export async function fetchRecommendedBooks(): Promise<RecommendedBook[]> {
  return MOCK_RECOMMENDED_BOOKS;
}

/**
 * GET /api/users/{id}/books
 *   ?collection=IN_PROGRESS&sort=NEWEST&decade=2010&minRating=4&genre=roman
 *   &page=0&size=12
 *
 * Cevap Spring `Page` sekli: "Daha Fazlasini Gor" dugmesi `last` alanina
 * bakiyor, toplam sayiyi kendi hesaplamiyor.
 */
export async function fetchBooks(
  query: BookQuery,
  page = 0,
): Promise<Page<BookSummary>> {
  return queryCollection(MOCK_BOOKS, query, { page, size: BOOK_PAGE_SIZE });
}
