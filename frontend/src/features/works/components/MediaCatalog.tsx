"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import { MediaCard } from "@/features/works/components/MediaCard";
import { RatingBadge } from "@/features/works/components/RatingBadge";
import type { Work } from "@/features/works/types";

/**
 * Genis ekranda alti sutun: sayfa boyutu 12, yani izgara tam iki sira olarak
 * kapaniyor - son sirada yarim kalan kart olmuyor.
 */
const GRID_CLASSES =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

/**
 * Sorgu sonucunun bu bilesenin ihtiyac duydugu kismi. TanStack tipleri yerine
 * bu kucuk sekil kullaniliyor ki bilesen veri kaynagini bilmek zorunda
 * kalmasin.
 */
export interface CatalogResult<T> {
  items: T[];
  isPending: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

interface MediaCatalogProps<TItem extends Work, TCollection extends string> {
  title: string;
  /** "Bu filtrelerle eşleşen film yok." gibi, ture ozel cumle. */
  emptyLabel: string;
  collections: readonly TCollection[];
  collectionLabel: (collection: TCollection) => string;
  activeCollection: TCollection;
  /** Baslik yanindaki sekmeler ust cubuktaki haplarla ayni secimi yazar. */
  onCollectionChange: (collection: TCollection) => void;
  result: CatalogResult<TItem>;
  meta: (item: TItem) => string;
  /** Karta eklenen ture ozel alt alan (dizilerde ilerleme cubugu). */
  footer?: (item: TItem) => ReactNode;
}

export function MediaCatalog<TItem extends Work, TCollection extends string>({
  title,
  emptyLabel,
  collections,
  collectionLabel,
  activeCollection,
  onCollectionChange,
  result,
  meta,
  footer,
}: MediaCatalogProps<TItem, TCollection>) {
  const t = useTranslations("media");
  const { items, isPending, isError, hasNextPage, isFetchingNextPage } = result;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>

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
              aria-pressed={activeCollection === collection}
              onClick={() => onCollectionChange(collection)}
            >
              {collectionLabel(collection)}
            </Button>
          ))}
        </div>
      </div>

      {isError && <p className="text-sm text-ink-muted">{t("catalog.error")}</p>}

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

      {!isPending && !isError && items.length === 0 && (
        <p className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center text-sm text-ink-muted">
          {emptyLabel}
        </p>
      )}

      {items.length > 0 && (
        <>
          <ul className={GRID_CLASSES}>
            {items.map((item) => (
              <li key={item.id}>
                <MediaCard
                  work={item}
                  meta={meta(item)}
                  badge={<RatingBadge rating={item.rating} />}
                  footer={footer?.(item)}
                />
              </li>
            ))}
          </ul>

          {hasNextPage && (
            <div className="mt-7 flex justify-center">
              <Button
                variant="ghost"
                onClick={() => result.fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full max-w-[280px] border border-line bg-surface"
              >
                {isFetchingNextPage
                  ? t("catalog.loading")
                  : t("catalog.loadMore")}
                <ChevronDown className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
