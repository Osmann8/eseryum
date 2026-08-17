"use client";

import { useTranslations } from "next-intl";
import { MediaCatalog } from "@/features/works/components/MediaCatalog";
import { EpisodeProgress } from "@/features/series/components/EpisodeProgress";
import { useSeriesCatalog } from "@/features/series/hooks/use-series-catalog";
import { useSeriesMeta } from "@/features/series/hooks/use-series-meta";
import {
  SERIES_COLLECTIONS,
  type SeriesCollection,
  type SeriesQuery,
} from "@/features/series/types";

interface SeriesCatalogProps {
  query: SeriesQuery;
  onCollectionChange: (collection: SeriesCollection) => void;
}

/**
 * "Tum Diziler" izgarasi. Duzenin tamami MediaCatalog'da; buradan gecen
 * diziye ozel bilgiler kartin alt satiri ve devam edenlerdeki ilerleme
 * cubugu.
 */
export function SeriesCatalog({ query, onCollectionChange }: SeriesCatalogProps) {
  const t = useTranslations("series");
  const tCollection = useTranslations("series.collection");
  const meta = useSeriesMeta();

  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSeriesCatalog(query);

  return (
    <MediaCatalog
      title={t("catalog.title")}
      emptyLabel={t("catalog.empty")}
      collections={SERIES_COLLECTIONS}
      collectionLabel={(collection) => tCollection(collection)}
      activeCollection={query.collection}
      onCollectionChange={onCollectionChange}
      meta={meta.card}
      // Cubuk sadece devam edenlerde: bitmis dizide %100 dolu bir cubuk
      // bilgi tasimiyor, izleme listesindekinde de bos cubuk.
      footer={(series) =>
        series.isInProgress ? (
          <EpisodeProgress
            watched={series.watchedEpisodes}
            total={series.episodeCount}
          />
        ) : null
      }
      result={{
        items: data?.pages.flatMap((page) => page.content) ?? [],
        isPending,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
      }}
    />
  );
}
