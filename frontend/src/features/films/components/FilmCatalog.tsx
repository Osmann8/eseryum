"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import { FilmCard } from "@/features/films/components/FilmCard";
import { UserRatingBadge } from "@/features/films/components/UserRatingBadge";
import { useFilmCatalog } from "@/features/films/hooks/use-film-catalog";
import {
  FILM_COLLECTIONS,
  type FilmCollection,
  type FilmQuery,
} from "@/features/films/types";

/**
 * Genis ekranda alti sutun: sayfa boyutu 12, yani izgara tam iki sira olarak
 * kapaniyor - son sirada yarim kalan kart olmuyor.
 */
const GRID_CLASSES =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

interface FilmCatalogProps {
  query: FilmQuery;
  /** Baslik altindaki sekmeler ust cubuktaki haplarla ayni secimi yazar. */
  onCollectionChange: (collection: FilmCollection) => void;
}

export function FilmCatalog({ query, onCollectionChange }: FilmCatalogProps) {
  const t = useTranslations("films.catalog");
  const tCollection = useTranslations("films.collection");
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFilmCatalog(query);

  const films = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-lg font-semibold text-ink">{t("title")}</h2>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={tCollection("label")}
        >
          {FILM_COLLECTIONS.map((collection) => (
            <Button
              key={collection}
              variant="pill"
              size="sm"
              aria-pressed={query.collection === collection}
              onClick={() => onCollectionChange(collection)}
            >
              {tCollection(collection)}
            </Button>
          ))}
        </div>
      </div>

      {isError && <p className="text-sm text-ink-muted">{t("error")}</p>}

      {isPending && (
        <ul className={GRID_CLASSES}>
          {Array.from({ length: 12 }).map((_, index) => (
            <li key={index} className="animate-pulse">
              <div className="aspect-[2/3] rounded-lg bg-surface-2" />
              <div className="mt-3 h-3 w-3/4 rounded bg-surface-2" />
              <div className="mt-2 h-3 w-1/2 rounded bg-surface-2" />
            </li>
          ))}
        </ul>
      )}

      {data && films.length === 0 && (
        <p className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center text-sm text-ink-muted">
          {t("empty")}
        </p>
      )}

      {films.length > 0 && (
        <>
          <ul className={GRID_CLASSES}>
            {films.map((film) => (
              <li key={film.id}>
                <FilmCard
                  film={film}
                  badge={
                    // Puanlanmamis filmde rozet yok: izleme listesindekiler
                    // boyle ayirt ediliyor.
                    film.userRating !== undefined ? (
                      <UserRatingBadge rating={film.userRating} />
                    ) : undefined
                  }
                />
              </li>
            ))}
          </ul>

          {hasNextPage && (
            <div className="mt-7 flex justify-center">
              <Button
                variant="ghost"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full max-w-[280px] border border-line bg-surface"
              >
                {isFetchingNextPage ? t("loading") : t("loadMore")}
                <ChevronDown className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
