/**
 * GECICI VERI. Backend'de henuz controller yok (bkz. bruno/README.md), bu
 * yuzden ana sayfa kendi ornek verisiyle cizilir.
 *
 * Kural: bu dosyayi sadece home-api.ts import eder. Endpoint'ler acildiginda
 * home-api.ts icindeki iki satir apiFetch'e cevrilir ve burasi silinir;
 * bilesenlerin hicbiri degismez.
 *
 * Kapaklar public/covers altindaki yer tutucu SVG'lerdir. Gercek kapaklar
 * TMDB'den gelecek (teknoloji belgesi: dosya barindirilmiyor).
 */
import type { Work } from "@/features/works/types";
import type {
  CuratedList,
  FriendActivity,
  MonthlySummary,
  ProfileStats,
  UserSummary,
} from "@/features/home/types";

export const MOCK_CURRENT_USER: UserSummary = { username: "deniz.k" };

export const MOCK_STATS: ProfileStats = {
  watchedCount: 193,
  readCount: 48,
  listCount: 27,
  reviewCount: 86,
};

export const MOCK_MONTHLY: MonthlySummary = {
  filmCount: 4,
  seriesCount: 2,
  bookCount: 1,
  activity: [2, 1, 3, 2, 5, 3, 4, 2, 6, 3, 4, 2],
};

export const MOCK_FRIEND_ACTIVITY: FriendActivity[] = [
  { id: 1, user: { username: "ada.k" }, subject: "The Godfather", rating: 4.5 },
  { id: 2, user: { username: "mert.y" }, subject: "Slow Cinema, No Hurry", rating: 5 },
  { id: 3, user: { username: "zeynep.d" }, subject: "The Prestige", rating: 4 },
  { id: 4, user: { username: "onur" }, subject: "Se7en", rating: 4.5 },
  { id: 5, user: { username: "buse.c" }, subject: "You've Got Mail", rating: 4 },
  { id: 6, user: { username: "baan.t" }, subject: "Dune: Part Two", rating: 4.5 },
];

/**
 * Bugunun trend listesi. Sira dizideki siradir; tur filtresi uygulaninca
 * numaralar bastan hesaplanir (01, 02, 03...).
 */
export const MOCK_TRENDING: Work[] = [
  {
    id: 1,
    slug: "the-godfather",
    type: "FILM",
    title: "The Godfather",
    year: 1972,
    coverUrl: "/covers/the-godfather.svg",
    rating: 4.8,
    ratingCount: 12480,
    imdbRating: 9.2,
  },
  {
    id: 2,
    slug: "forrest-gump",
    type: "FILM",
    title: "Forrest Gump",
    year: 1994,
    coverUrl: "/covers/forrest-gump.svg",
    rating: 4.6,
    ratingCount: 9310,
    imdbRating: 8.8,
  },
  {
    id: 3,
    slug: "the-prestige",
    type: "FILM",
    title: "The Prestige",
    year: 2006,
    coverUrl: "/covers/the-prestige.svg",
    rating: 4.5,
    ratingCount: 7042,
    imdbRating: 8.5,
  },
  {
    id: 4,
    slug: "youve-got-mail",
    type: "FILM",
    title: "You've Got Mail",
    year: 1998,
    coverUrl: "/covers/youve-got-mail.svg",
    rating: 4.3,
    ratingCount: 3884,
    imdbRating: 6.7,
  },
  {
    id: 5,
    slug: "se7en",
    type: "FILM",
    title: "Se7en",
    year: 1995,
    coverUrl: "/covers/se7en.svg",
    rating: 4.4,
    ratingCount: 8106,
    imdbRating: 8.6,
  },
  {
    // Kapagi olmayan kayit bilerek burada: saglayicida gorseli bulunmayan
    // eserin nasil gorunecegi tasarimin parcasi, istisna degil.
    id: 6,
    slug: "bir-sonbahar-hikayesi",
    type: "SERIES",
    title: "Bir Sonbahar Hikâyesi",
    year: 2024,
    rating: 4.2,
    ratingCount: 1902,
    imdbRating: 7.4,
  },
  {
    id: 7,
    slug: "severance",
    type: "SERIES",
    title: "Severance",
    year: 2022,
    coverUrl: "/covers/severance.svg",
    rating: 4.7,
    ratingCount: 5240,
    imdbRating: 8.7,
  },
  {
    id: 8,
    slug: "tutunamayanlar",
    type: "BOOK",
    title: "Tutunamayanlar",
    year: 1972,
    coverUrl: "/covers/tutunamayanlar.svg",
    rating: 4.6,
    ratingCount: 3120,
  },
  {
    id: 9,
    slug: "kurk-mantolu-madonna",
    type: "BOOK",
    title: "Kürk Mantolu Madonna",
    year: 1943,
    coverUrl: "/covers/kurk-mantolu-madonna.svg",
    rating: 4.4,
    ratingCount: 4870,
  },
  {
    id: 10,
    slug: "dune",
    type: "BOOK",
    title: "Dune",
    originalTitle: "Dune",
    year: 1965,
    coverUrl: "/covers/dune.svg",
    rating: 4.5,
    ratingCount: 2615,
  },
];

export const MOCK_WEEKLY_LISTS: CuratedList[] = [
  {
    id: 1,
    slug: "2000lerin-en-iyileri",
    title: "2000'lerin En İyileri",
    curator: { username: "mert.y" },
    workCount: 45,
    coverUrl: "/lists/2000lerin-en-iyileri.svg",
  },
  {
    id: 2,
    slug: "david-fincher-dunyasi",
    title: "David Fincher Dünyası",
    curator: { username: "zeynep.d" },
    workCount: 28,
    coverUrl: "/lists/david-fincher-dunyasi.svg",
  },
  {
    id: 3,
    slug: "klasik-kitaplar",
    title: "Klasik Kitaplar",
    curator: { username: "ada.k" },
    workCount: 63,
    coverUrl: "/lists/klasik-kitaplar.svg",
  },
  {
    id: 4,
    slug: "motivasyon-veren-filmler",
    title: "Motivasyon Veren Filmler",
    curator: { username: "onur" },
    workCount: 27,
    coverUrl: "/lists/motivasyon-veren-filmler.svg",
  },
];
