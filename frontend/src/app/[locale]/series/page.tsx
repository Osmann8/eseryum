import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  DEFAULT_SERIES_QUERY,
  fetchRatingDistribution,
  fetchRecommendedSeries,
  fetchSeries,
  fetchSeriesCounts,
  fetchSeriesGenres,
  fetchWatchActivity,
} from "@/features/series/api/series-api";
import { seriesKeys } from "@/features/series/api/query-keys";
import { fetchCurrentUser } from "@/features/home/api/home-api";
import { getQueryClient } from "@/shared/providers/query-client";
import { ActivityCard } from "@/features/works/components/ActivityCard";
import { GenreList } from "@/features/works/components/GenreList";
import { RatingDistributionCard } from "@/features/works/components/RatingDistributionCard";
import { RecommendedSeries } from "@/features/series/components/RecommendedSeries";
import { SeriesBrowser } from "@/features/series/components/SeriesBrowser";
import { SeriesPageHeader } from "@/features/series/components/SeriesPageHeader";

/**
 * Diziler sekmesi. Filmler ile ayni iskelet (bkz. features/works): sunucuda
 * cizilir, istemcide kalan tek sey filtre durumu ve oneri satirinin gorunum
 * secimi.
 *
 * Katalogun ilk sayfasi sunucuda dolduruluyor: kartlar ilk boyamada ekranda
 * olsun, "Daha Fazlasini Gor" sadece devamini istesin.
 */
export default async function SeriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = getQueryClient();
  const tActivity = await getTranslations("series.activity");

  const [user, counts, genres, recommended, activity, distribution] =
    await Promise.all([
      fetchCurrentUser(),
      fetchSeriesCounts(),
      fetchSeriesGenres(),
      fetchRecommendedSeries(),
      fetchWatchActivity(),
      fetchRatingDistribution(),
      queryClient.prefetchInfiniteQuery({
        queryKey: seriesKeys.catalog(DEFAULT_SERIES_QUERY),
        queryFn: ({ pageParam }) => fetchSeries(DEFAULT_SERIES_QUERY, pageParam),
        initialPageParam: 0,
      }),
    ]);

  return (
    // Sag sutun tasarimdaki genislikte sabit; xl altinda ana sutunun altina
    // iner, gizlenmez - tur sayaclari ve puan dagilimi dar ekranda da okunur.
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_248px] xl:items-start">
      <div className="min-w-0">
        <SeriesPageHeader counts={counts} />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <SeriesBrowser genres={genres}>
            <RecommendedSeries series={recommended} />
          </SeriesBrowser>
        </HydrationBoundary>
      </div>

      <aside className="flex flex-col gap-4">
        <GenreList genres={genres} />
        <ActivityCard activity={activity} countLabel={tActivity("countLabel")} />
        <RatingDistributionCard
          buckets={distribution}
          statsHref={`/profile/${user.username}`}
        />
      </aside>
    </div>
  );
}
