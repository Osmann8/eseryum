"use client";

import { FilterX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import { FilterSelect } from "@/shared/components/FilterSelect";
import {
  MEDIA_DECADES,
  MEDIA_MIN_RATINGS,
  MEDIA_SORTS,
  type CollectionFilter,
  type GenreSummary,
  type MediaDecade,
  type MediaMinRating,
  type MediaQuery,
  type MediaSort,
} from "@/features/works/types";

/**
 * On yillik dilimlerin ceviri anahtarlari. Turkce'de sayi ekleri duzenli
 * degil ("2010'lar" ama "2000'ler"), bu yuzden uretilmiyor, tek tek yaziliyor.
 */
const DECADE_KEYS: Record<MediaDecade, string> = {
  "2020": "y2020",
  "2010": "y2010",
  "2000": "y2000",
  "1990": "y1990",
  OLDER: "older",
};

interface CollectionToolbarProps<TCollection extends CollectionFilter> {
  query: MediaQuery<TCollection>;
  genres: GenreSummary[];
  /** Koleksiyon haplari; kume ture gore degisir (dizilerde "Izliyorum" var). */
  collections: readonly TCollection[];
  collectionLabel: (collection: TCollection) => string;
  onChange: (patch: Partial<MediaQuery<TCollection>>) => void;
  onReset: () => void;
}

export function CollectionToolbar<TCollection extends CollectionFilter>({
  query,
  genres,
  collections,
  collectionLabel,
  onChange,
  onReset,
}: CollectionToolbarProps<TCollection>) {
  const t = useTranslations("media");

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
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t("collectionLabel")}
      >
        {collections.map((collection) => (
          <Button
            key={collection}
            variant="pill"
            size="sm"
            aria-pressed={query.collection === collection}
            onClick={() => onChange({ collection })}
          >
            {collectionLabel(collection)}
          </Button>
        ))}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <FilterSelect
          label={t("sort.label")}
          prefix={t("sort.prefix")}
          value={query.sort}
          options={MEDIA_SORTS.map((sort) => ({
            value: sort,
            label: t(`sort.${sort}`),
          }))}
          onChange={(value) => onChange({ sort: value as MediaSort })}
        />

        <FilterSelect
          label={t("year.label")}
          placeholder={t("year.label")}
          value={query.decade ?? ""}
          options={MEDIA_DECADES.map((decade) => ({
            value: decade,
            label: t(`year.options.${DECADE_KEYS[decade]}`),
          }))}
          onChange={(value) =>
            onChange({ decade: value === "" ? undefined : (value as MediaDecade) })
          }
        />

        <FilterSelect
          label={t("rating.label")}
          placeholder={t("rating.label")}
          value={query.minRating?.toString() ?? ""}
          options={MEDIA_MIN_RATINGS.map((value) => ({
            value: value.toString(),
            label: ratingLabel(value),
          }))}
          onChange={(value) =>
            onChange({
              minRating:
                value === "" ? undefined : (Number(value) as MediaMinRating),
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
