import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import {
  DEFAULT_FILM_QUERY,
  fetchFilmCounts,
  fetchFilmGenres,
  fetchFilms,
  fetchRatingDistribution,
  fetchRecommendedFilms,
  fetchWatchActivity,
} from "@/features/films/api/films-api";
import { filmKeys } from "@/features/films/api/query-keys";
import { fetchCurrentUser } from "@/features/home/api/home-api";
import { getQueryClient } from "@/shared/providers/query-client";
import { FilmBrowser } from "@/features/films/components/FilmBrowser";
import { FilmsPageHeader } from "@/features/films/components/FilmsPageHeader";
import { GenreList } from "@/features/films/components/GenreList";
import { RatingDistributionCard } from "@/features/films/components/RatingDistributionCard";
import { RecommendedFilms } from "@/features/films/components/RecommendedFilms";
import { WatchActivityCard } from "@/features/films/components/WatchActivityCard";

/**
 * Filmler sekmesi. Sunucuda cizilir; istemcide kalan tek sey filtre durumu
 * (FilmBrowser) ve oneri satirinin gorunum secimi.
 *
 * Katalogun ilk sayfasi sunucuda dolduruluyor: kartlar ilk boyamada ekranda
 * olsun, "Daha Fazlasini Gor" sadece devamini istesin.
 */
export default async function FilmsPage({
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
      fetchFilmCounts(),
      fetchFilmGenres(),
      fetchRecommendedFilms(),
      fetchWatchActivity(),
      fetchRatingDistribution(),
      queryClient.prefetchInfiniteQuery({
        queryKey: filmKeys.catalog(DEFAULT_FILM_QUERY),
        queryFn: ({ pageParam }) => fetchFilms(DEFAULT_FILM_QUERY, pageParam),
        initialPageParam: 0,
      }),
    ]);

  return (
    // Sag sutun tasarimdaki genislikte sabit; xl altinda ana sutunun altina
    // iner, gizlenmez - tur sayaclari ve puan dagilimi dar ekranda da okunur.
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_248px] xl:items-start">
      <div className="min-w-0">
        <FilmsPageHeader counts={counts} />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <FilmBrowser genres={genres}>
            <RecommendedFilms films={recommended} />
          </FilmBrowser>
        </HydrationBoundary>
      </div>

      <aside className="flex flex-col gap-4">
        <GenreList genres={genres} />
        <WatchActivityCard activity={activity} />
        <RatingDistributionCard
          buckets={distribution}
          statsHref={`/profile/${user.username}`}
        />
      </aside>
    </div>
  );
}
