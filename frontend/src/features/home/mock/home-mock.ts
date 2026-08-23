/**
 * GECICI VERI. Backend'de henuz controller yok (bkz. bruno/README.md), bu
 * yuzden ana sayfa kendi ornek verisiyle cizilir.
 *
 * Kural: bu dosyayi sadece home-api.ts import eder. Endpoint'ler acildiginda
 * home-api.ts icindeki iki satir apiFetch'e cevrilir ve burasi silinir;
 * bilesenlerin hicbiri degismez.
 *
 * Kapak URL'lerini `npm run covers` yaziyor (scripts/fetch-covers.mjs):
 * film ve diziler TMDB'den, kitaplar OpenLibrary'den. Gorseller CDN'den
 * geliyor, dosya barindirilmiyor (teknoloji belgesindeki karar).
 * Haftanin listeleri istisna: onlarin kapagi eser degil, public/lists
 * altindaki kendi tasarlanmis gorselleri.
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
    type: "FILM",
    title: "The Godfather",
    year: 1972,
    coverUrl: "https://image.tmdb.org/t/p/w500/vseIVRdN4xasYwStQIi6SI7DcEu.jpg",
    rating: 9.6,
    ratingCount: 12480,
    imdbRating: 9.2,
  },
  {
    id: 2,
    type: "FILM",
    title: "Forrest Gump",
    year: 1994,
    coverUrl: "https://image.tmdb.org/t/p/w500/Cw4hIUIAmSYfK9QfaUW5igp9La.jpg",
    rating: 9.2,
    ratingCount: 9310,
    imdbRating: 8.8,
  },
  {
    id: 3,
    type: "FILM",
    title: "The Prestige",
    year: 2006,
    coverUrl: "https://image.tmdb.org/t/p/w500/wiSuje8hdVuwM0pvhtSFirCHmJF.jpg",
    rating: 9,
    ratingCount: 7042,
    imdbRating: 8.5,
  },
  {
    id: 4,
    type: "FILM",
    title: "You've Got Mail",
    year: 1998,
    coverUrl: "https://image.tmdb.org/t/p/w500/neNZH6xc7rvbuCoawZ9uNWbaCMT.jpg",
    rating: 8.6,
    ratingCount: 3884,
    imdbRating: 6.7,
  },
  {
    id: 5,
    type: "FILM",
    title: "Se7en",
    year: 1995,
    coverUrl: "https://image.tmdb.org/t/p/w500/3qpOnTbxPK2HeHObBHttcvQHLGI.jpg",
    rating: 8.8,
    ratingCount: 8106,
    imdbRating: 8.6,
  },
  {
    // Kapagi olmayan kayit bilerek burada: saglayicida gorseli bulunmayan
    // eserin nasil gorunecegi tasarimin parcasi, istisna degil.
    id: 6,
    type: "SERIES",
    title: "Bir Sonbahar Hikâyesi",
    year: 2024,
    rating: 8.4,
    ratingCount: 1902,
    imdbRating: 7.4,
  },
  {
    id: 7,
    type: "SERIES",
    title: "Severance",
    year: 2022,
    coverUrl: "https://image.tmdb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
    rating: 9.4,
    ratingCount: 5240,
    imdbRating: 8.7,
  },
  {
    id: 8,
    type: "BOOK",
    title: "Tutunamayanlar",
    year: 1972,
    coverUrl: "https://covers.openlibrary.org/b/id/8730101-L.jpg",
    rating: 9.2,
    ratingCount: 3120,
  },
  {
    id: 9,
    type: "BOOK",
    title: "Kürk Mantolu Madonna",
    year: 1943,
    coverUrl: "https://covers.openlibrary.org/b/id/10848013-L.jpg",
    rating: 8.8,
    ratingCount: 4870,
  },
  {
    id: 10,
    type: "BOOK",
    title: "Dune",
    originalTitle: "Dune",
    year: 1965,
    coverUrl: "https://covers.openlibrary.org/b/id/11481354-L.jpg",
    rating: 9,
    ratingCount: 2615,
  },
];

export const MOCK_WEEKLY_LISTS: CuratedList[] = [
  {
    id: 1,
    title: "2000'lerin En İyileri",
    curator: { username: "mert.y" },
    workCount: 45,
    coverUrl: "/lists/2000lerin-en-iyileri.svg",
  },
  {
    id: 2,
    title: "David Fincher Dünyası",
    curator: { username: "zeynep.d" },
    workCount: 28,
    coverUrl: "/lists/david-fincher-dunyasi.svg",
  },
  {
    id: 3,
    title: "Klasik Kitaplar",
    curator: { username: "ada.k" },
    workCount: 63,
    coverUrl: "/lists/klasik-kitaplar.svg",
  },
  {
    id: 4,
    title: "Motivasyon Veren Filmler",
    curator: { username: "onur" },
    workCount: 27,
    coverUrl: "/lists/motivasyon-veren-filmler.svg",
  },
];
