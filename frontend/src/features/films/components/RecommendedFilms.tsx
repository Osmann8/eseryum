"use client";

import { useTranslations } from "next-intl";
import { RecommendationRow } from "@/features/works/components/RecommendationRow";
import { useRuntimeLabel } from "@/features/works/hooks/use-runtime-label";
import type { RecommendedFilm } from "@/features/films/types";

/**
 * "Sana Ozel Oneriler" satirinin film hali: satirin kendisi ortak, buradan
 * gecen tek sey kartin ve liste satirinin alt metni.
 */
export function RecommendedFilms({ films }: { films: RecommendedFilm[] }) {
  const t = useTranslations("films.recommendations");
  const runtimeLabel = useRuntimeLabel();

  return (
    <RecommendationRow
      items={films}
      emptyLabel={t("empty")}
      meta={(film) => `${film.year} • ${runtimeLabel(film.runtimeMinutes)}`}
      listMeta={(film) =>
        `${film.year} • ${runtimeLabel(film.runtimeMinutes)} • ${film.director}`
      }
    />
  );
}
