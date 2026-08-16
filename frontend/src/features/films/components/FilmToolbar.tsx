"use client";

import { FilterX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import { FilterSelect } from "@/features/films/components/FilterSelect";
import {
  FILM_COLLECTIONS,
  FILM_DECADES,
  FILM_MIN_RATINGS,
  FILM_SORTS,
  type FilmDecade,
  type FilmMinRating,
  type FilmQuery,
  type FilmSort,
  type GenreSummary,
} from "@/features/films/types";

/**
 * On yillik dilimlerin ceviri anahtarlari. Turkce'de sayi ekleri duzenli
 * degil ("2010'lar" ama "2000'ler"), bu yuzden uretilmiyor, tek tek yaziliyor.
 */
const DECADE_KEYS: Record<FilmDecade, string> = {
  "2020": "y2020",
  "2010": "y2010",
  "2000": "y2000",
  "1990": "y1990",
  OLDER: "older",
};

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
  const t = useTranslations("films");

  // Koleksiyon ve siralama hep bir degere sahip; "temizlenecek" olan bu uc
  // filtre.
  const hasFilters =
    query.decade !== undefined ||
    query.minRating !== undefined ||
    query.genre !== undefined;

  const ratingLabel = (value: number) =>
    t("rating.min", {
      value: value.toLocaleString("tr-TR", { maximumFractionDigits: 1 }),
    });

  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("collection.label")}>
        {FILM_COLLECTIONS.map((collection) => (
          <Button
            key={collection}
            variant="pill"
            size="sm"
            aria-pressed={query.collection === collection}
            onClick={() => onChange({ collection })}
          >
            {t(`collection.${collection}`)}
          </Button>
        ))}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <FilterSelect
          label={t("sort.label")}
          prefix={t("sort.prefix")}
          value={query.sort}
          options={FILM_SORTS.map((sort) => ({
            value: sort,
            label: t(`sort.${sort}`),
          }))}
          onChange={(value) => onChange({ sort: value as FilmSort })}
        />

        <FilterSelect
          label={t("year.label")}
          placeholder={t("year.label")}
          value={query.decade ?? ""}
          options={FILM_DECADES.map((decade) => ({
            value: decade,
            label: t(`year.options.${DECADE_KEYS[decade]}`),
          }))}
          onChange={(value) =>
            onChange({ decade: value === "" ? undefined : (value as FilmDecade) })
          }
        />

        <FilterSelect
          label={t("rating.label")}
          placeholder={t("rating.label")}
          value={query.minRating?.toString() ?? ""}
          options={FILM_MIN_RATINGS.map((value) => ({
            value: value.toString(),
            label: ratingLabel(value),
          }))}
          onChange={(value) =>
            onChange({
              minRating:
                value === "" ? undefined : (Number(value) as FilmMinRating),
            })
          }
        />

        <FilterSelect
          label={t("genre.label")}
          placeholder={t("genre.label")}
          value={query.genre ?? ""}
          options={genres.map((genre) => ({
            value: genre.slug,
            label: genre.label,
          }))}
          onChange={(value) =>
            onChange({ genre: value === "" ? undefined : value })
          }
        />

        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          aria-label={t("filters.reset")}
          title={t("filters.reset")}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-40"
        >
          <FilterX className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
