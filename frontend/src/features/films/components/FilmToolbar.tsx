"use client";

import { useTranslations } from "next-intl";
import { CollectionToolbar } from "@/features/works/components/CollectionToolbar";
import type { GenreSummary } from "@/features/works/types";
import { FILM_COLLECTIONS, type FilmQuery } from "@/features/films/types";

interface FilmToolbarProps {
  query: FilmQuery;
  genres: GenreSummary[];
  onChange: (patch: Partial<FilmQuery>) => void;
  onReset: () => void;
}

export function FilmToolbar({
  query,
  genres,
  onChange,
  onReset,
}: FilmToolbarProps) {
  const t = useTranslations("films.collection");

  return (
    <CollectionToolbar
      query={query}
      genres={genres}
      collections={FILM_COLLECTIONS}
      collectionLabel={(collection) => t(collection)}
      onChange={onChange}
      onReset={onReset}
    />
  );
}
