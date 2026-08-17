"use client";

import { useTranslations } from "next-intl";
import { CollectionToolbar } from "@/features/works/components/CollectionToolbar";
import type { GenreSummary } from "@/features/works/types";
import { SERIES_COLLECTIONS, type SeriesQuery } from "@/features/series/types";

interface SeriesToolbarProps {
  query: SeriesQuery;
  genres: GenreSummary[];
  onChange: (patch: Partial<SeriesQuery>) => void;
  onReset: () => void;
}

export function SeriesToolbar({
  query,
  genres,
  onChange,
  onReset,
}: SeriesToolbarProps) {
  const t = useTranslations("series.collection");

  return (
    <CollectionToolbar
      query={query}
      genres={genres}
      collections={SERIES_COLLECTIONS}
      collectionLabel={(collection) => t(collection)}
      onChange={onChange}
      onReset={onReset}
    />
  );
}
