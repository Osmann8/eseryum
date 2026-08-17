"use client";

import { useTranslations } from "next-intl";
import { MediaCatalog } from "@/features/works/components/MediaCatalog";
import { useRuntimeLabel } from "@/features/works/hooks/use-runtime-label";
import { useFilmCatalog } from "@/features/films/hooks/use-film-catalog";
import {
  FILM_COLLECTIONS,
  type FilmCollection,
  type FilmQuery,
  type FilmSummary,
} from "@/features/films/types";

interface FilmCatalogProps {
  query: FilmQuery;
  onCollectionChange: (collection: FilmCollection) => void;
}

/**
 * "Tum Filmler" izgarasi. Duzenin tamami MediaCatalog'da; buradan gecen tek
 * filme ozel bilgi kartin alt satiri (yil + sure) ve sekme adlari.
 */
export function FilmCatalog({ query, onCollectionChange }: FilmCatalogProps) {
  const t = useTranslations("films");
  const tCollection = useTranslations("films.collection");
  const runtimeLabel = useRuntimeLabel();

  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFilmCatalog(query);

  return (
    <MediaCatalog
      title={t("catalog.title")}
      emptyLabel={t("catalog.empty")}
      collections={FILM_COLLECTIONS}
      collectionLabel={(collection) => tCollection(collection)}
      activeCollection={query.collection}
      onCollectionChange={onCollectionChange}
      meta={(film: FilmSummary) =>
        `${film.year} • ${runtimeLabel(film.runtimeMinutes)}`
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
