import type { Page } from "@/shared/api/api-client";
import type {
  CollectionFields,
  MediaDecade,
  MediaQuery,
  MediaSort,
  Work,
} from "@/features/works/types";

/**
 * Koleksiyon listelerinin filtrelenmesi, siralanmasi ve sayfalanmasi.
 *
 * GECICI: bu isin tamami sunucuda, sorgu parametreleriyle yapilacak. Endpoint
 * acildiginda film ve dizi api dosyalarindaki cagrilar apiFetch'e cevrilir ve
 * burasi silinir. Iki sayfada ayni davranis olsun diye tek yerde duruyor -
 * "Filmlerde 1990'lar 1990-1999, dizilerde 1990-2000" gibi bir fark cikmasin.
 */

/** On yillik dilimin alt ve ust siniri; ust sinir dahil degil. */
const DECADE_RANGES: Record<MediaDecade, { from: number; to: number }> = {
  "2020": { from: 2020, to: Number.POSITIVE_INFINITY },
  "2010": { from: 2010, to: 2020 },
  "2000": { from: 2000, to: 2010 },
  "1990": { from: 1990, to: 2000 },
  OLDER: { from: Number.NEGATIVE_INFINITY, to: 1990 },
};

type CollectionItem = Work & Pick<CollectionFields, "genres">;

function matchesFilters(item: CollectionItem, query: MediaQuery): boolean {
  if (query.genre !== undefined && !item.genres.includes(query.genre)) {
    return false;
  }

  if (query.minRating !== undefined && item.rating < query.minRating) {
    return false;
  }

  if (query.decade !== undefined) {
    const { from, to } = DECADE_RANGES[query.decade];
    if (item.year < from || item.year >= to) {
      return false;
    }
  }

  return true;
}

function compare(a: CollectionItem, b: CollectionItem, sort: MediaSort): number {
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
 * Verilen listeyi sorguya gore suzup Spring `Page` seklinde dondurur.
 *
 * Koleksiyon sekmesi (izlediklerim, favorilerim...) ture gore degistigi icin
 * disaridan bir yuklem olarak geliyor: dizilerde "izliyorum" var, filmlerde
 * yok.
 */
export function queryCollection<T extends CollectionItem>(
  items: T[],
  query: MediaQuery,
  matchesCollection: (item: T, collection: string) => boolean,
  { page, size }: { page: number; size: number },
): Page<T> {
  const matched = items
    .filter(
      (item) =>
        matchesCollection(item, query.collection) && matchesFilters(item, query),
    )
    .sort((a, b) => compare(a, b, query.sort));

  const start = page * size;
  const content = matched.slice(start, start + size);
  const totalPages = Math.max(Math.ceil(matched.length / size), 1);

  return {
    content,
    number: page,
    size,
    totalElements: matched.length,
    totalPages,
    first: page === 0,
    last: page >= totalPages - 1,
  };
}
