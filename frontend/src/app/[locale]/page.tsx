import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import {
  fetchCurrentUser,
  fetchFriendActivity,
  fetchProfileStats,
  fetchTrendingWorks,
  fetchWeeklyLists,
} from "@/features/home/api/home-api";
import { homeKeys } from "@/features/home/api/query-keys";
import { getQueryClient } from "@/shared/providers/query-client";
import { GreetingHeader } from "@/features/home/components/GreetingHeader";
import { StatsBar } from "@/features/home/components/StatsBar";
import { FriendsActivity } from "@/features/home/components/FriendsActivity";
import { TrendingSection } from "@/features/home/components/TrendingSection";
import { WeeklyLists } from "@/features/home/components/WeeklyLists";

/**
 * Ana sayfa. Sunucuda cizilir; sadece trend listesinin sekmeleri istemci
 * tarafinda calisir (TrendingSection).
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = getQueryClient();

  const [user, stats, friends, lists] = await Promise.all([
    fetchCurrentUser(),
    fetchProfileStats(),
    fetchFriendActivity(),
    fetchWeeklyLists(),
    // Acilistaki "Tumu" sekmesi sunucuda doldurulur: kartlar ilk boyamada
    // ekranda olsun, arama motoru bos bir izgara gormesin. Diger sekmeler
    // tiklandiginda istemcide cekilir.
    queryClient.prefetchQuery({
      queryKey: homeKeys.trending("ALL"),
      queryFn: () => fetchTrendingWorks("ALL"),
    }),
  ]);

  return (
    <>
      <GreetingHeader user={user} />
      <StatsBar stats={stats} />
      <FriendsActivity items={friends} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TrendingSection />
      </HydrationBoundary>
      <WeeklyLists lists={lists} />
    </>
  );
}
