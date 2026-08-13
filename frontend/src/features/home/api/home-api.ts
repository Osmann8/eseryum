import type {
  CuratedList,
  FriendActivity,
  MonthlySummary,
  ProfileStats,
  TrendingFilter,
  TrendingWork,
  UserSummary,
} from "@/features/home/types";
import {
  MOCK_CURRENT_USER,
  MOCK_FRIEND_ACTIVITY,
  MOCK_MONTHLY,
  MOCK_STATS,
  MOCK_TRENDING,
  MOCK_WEEKLY_LISTS,
} from "@/features/home/mock/home-mock";

/**
 * Ana sayfanin veri kapisi. Su an hepsi mock donuyor; her fonksiyonun
 * uzerinde hangi endpoint'e baglanacagi yazili.
 *
 * Fonksiyonlarin Promise dondurmesi bilincli: endpoint acildiginda imza
 * degismesin, sadece govde apiFetch'e cevrilsin.
 */

/** GET /api/v1/auth/me */
export async function fetchCurrentUser(): Promise<UserSummary> {
  return MOCK_CURRENT_USER;
}

/** GET /api/v1/users/{username}/stats */
export async function fetchProfileStats(): Promise<ProfileStats> {
  return MOCK_STATS;
}

/** GET /api/v1/users/{username}/summary?period=month */
export async function fetchMonthlySummary(): Promise<MonthlySummary> {
  return MOCK_MONTHLY;
}

/** GET /api/v1/feed/friends */
export async function fetchFriendActivity(): Promise<FriendActivity[]> {
  return MOCK_FRIEND_ACTIVITY;
}

/** GET /api/v1/lists/featured?period=week */
export async function fetchWeeklyLists(): Promise<CuratedList[]> {
  return MOCK_WEEKLY_LISTS;
}

/**
 * GET /api/v1/works/trending?type=FILM
 *
 * Sira numarasi backend'den gelmez, gelen sirayla uretilir: "ALL" listesinde
 * 06 olan bir dizi, Diziler sekmesinde 02 olur.
 */
export async function fetchTrendingWorks(
  filter: TrendingFilter,
): Promise<TrendingWork[]> {
  const works =
    filter === "ALL"
      ? MOCK_TRENDING.slice(0, 6)
      : MOCK_TRENDING.filter((work) => work.type === filter);

  return works.map((work, index) => ({ ...work, rank: index + 1 }));
}
