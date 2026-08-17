import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import {
  DEFAULT_BOOK_QUERY,
  fetchBookCounts,
  fetchBookGenres,
  fetchBooks,
  fetchRatingDistribution,
  fetchReadingActivity,
  fetchRecommendedBooks,
} from "@/features/books/api/books-api";
import { bookKeys } from "@/features/books/api/query-keys";
import { fetchCurrentUser } from "@/features/home/api/home-api";
import { getQueryClient } from "@/shared/providers/query-client";
import { GenreList } from "@/features/works/components/GenreList";
import { RatingDistributionCard } from "@/features/works/components/RatingDistributionCard";
import { BookActivityCard } from "@/features/books/components/BookActivityCard";
import { BooksBrowser } from "@/features/books/components/BooksBrowser";
import { BooksPageHeader } from "@/features/books/components/BooksPageHeader";
import { RecommendedBooks } from "@/features/books/components/RecommendedBooks";

/**
 * Kitaplar sekmesi. Filmler ve Diziler ile ayni iskelet (bkz. features/works):
 * sunucuda cizilir, istemcide kalan tek sey filtre durumu ve oneri satirinin
 * gorunum secimi.
 */
export default async function BooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = getQueryClient();

  const [user, counts, genres, recommended, activity, distribution] =
    await Promise.all([
      fetchCurrentUser(),
      fetchBookCounts(),
      fetchBookGenres(),
      fetchRecommendedBooks(),
      fetchReadingActivity(),
      fetchRatingDistribution(),
      queryClient.prefetchInfiniteQuery({
        queryKey: bookKeys.catalog(DEFAULT_BOOK_QUERY),
        queryFn: ({ pageParam }) => fetchBooks(DEFAULT_BOOK_QUERY, pageParam),
        initialPageParam: 0,
      }),
    ]);

  return (
    // Sag sutun tasarimdaki genislikte sabit; xl altinda ana sutunun altina
    // iner, gizlenmez - tur sayaclari ve puan dagilimi dar ekranda da okunur.
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_248px] xl:items-start">
      <div className="min-w-0">
        <BooksPageHeader counts={counts} />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <BooksBrowser genres={genres}>
            <RecommendedBooks books={recommended} />
          </BooksBrowser>
        </HydrationBoundary>
      </div>

      <aside className="flex flex-col gap-4">
        <GenreList genres={genres} />
        <BookActivityCard activity={activity} />
        <RatingDistributionCard
          buckets={distribution}
          statsHref={`/profile/${user.username}`}
        />
      </aside>
    </div>
  );
}
