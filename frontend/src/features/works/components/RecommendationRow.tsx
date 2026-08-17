"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import { MediaCard } from "@/features/works/components/MediaCard";
import { MediaListItem } from "@/features/works/components/MediaListItem";
import { MatchBadge } from "@/features/works/components/MatchBadge";
import type { Work } from "@/features/works/types";

type ViewMode = "GRID" | "LIST";

interface RecommendationRowProps<TItem extends Work & { matchScore: number }> {
  items: TItem[];
  /** Izgara kartinin alt satiri. */
  meta: (item: TItem) => string;
  /** Liste satirinin alt satiri; genelde daha uzun. */
  listMeta: (item: TItem) => string;
  /** "...Birkaç film puanla." gibi ture ozel cumle. */
  emptyLabel: string;
}

/**
 * "Sana Ozel Oneriler" satiri. Veri sunucudan prop olarak geliyor - liste
 * filtrelere bagli degil, yeniden cekilmesi gereken bir durumu yok. Istemci
 * olmasinin tek sebebi gorunum secimi ve yatay kaydirma.
 */
export function RecommendationRow<TItem extends Work & { matchScore: number }>({
  items,
  meta,
  listMeta,
  emptyLabel,
}: RecommendationRowProps<TItem>) {
  const t = useTranslations("media.recommendations");
  const [view, setView] = useState<ViewMode>("GRID");
  const rowRef = useRef<HTMLUListElement>(null);
  // Oklar kaydirilacak yer kalmadiginda gizlenir; ilk boyamada sadece sag ok
  // gorunur cunku satir basindayiz.
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const syncEdges = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    setEdges({
      atStart: row.scrollLeft <= 1,
      atEnd: row.scrollLeft + row.clientWidth >= row.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    syncEdges();
    // Pencere genisleyince kaydirilacak yer kalmayabilir, daralinca olusur.
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges, view, items]);

  function scrollRow(direction: -1 | 1) {
    const row = rowRef.current;
    if (!row) return;

    // Tam ekran genisligi degil: bir sonraki karttan bir parca gorunsun ki
    // satirin devami oldugu belli olsun.
    row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className="mb-9">
      <div className="mb-4 flex flex-wrap items-start gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-ink">{t("title")}</h2>
          <p className="mt-1 text-xs text-ink-muted">{t("description")}</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1 text-sm text-brand-strong hover:underline"
          >
            {t("seeAll")}
            <ArrowRight className="size-3.5" />
          </Link>

          <div
            role="group"
            aria-label={t("view.label")}
            className="flex items-center gap-0.5 rounded-lg border border-line p-0.5"
          >
            {(
              [
                ["GRID", LayoutGrid],
                ["LIST", List],
              ] as const
            ).map(([mode, Icon]) => (
              <button
                key={mode}
                type="button"
                aria-pressed={view === mode}
                aria-label={t(`view.${mode}`)}
                onClick={() => setView(mode)}
                className="rounded-md p-1.5 text-ink-muted transition-colors hover:text-ink aria-pressed:bg-brand aria-pressed:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Icon className="size-4" strokeWidth={1.75} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {items.length === 0 && <p className="text-sm text-ink-muted">{emptyLabel}</p>}

      {items.length > 0 && view === "LIST" && (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <MediaListItem
                work={item}
                meta={listMeta(item)}
                trailing={<MatchBadge score={item.matchScore} />}
              />
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && view === "GRID" && (
        <div className="relative">
          <ul
            ref={rowRef}
            onScroll={syncEdges}
            className="scroll-row flex gap-5 overflow-x-auto pb-2"
          >
            {items.map((item) => (
              <li key={item.id} className="w-[152px] shrink-0">
                <MediaCard
                  work={item}
                  meta={meta(item)}
                  badge={<MatchBadge score={item.matchScore} />}
                />
              </li>
            ))}
          </ul>

          {(
            [
              ["left", ChevronLeft, edges.atStart, -1],
              ["right", ChevronRight, edges.atEnd, 1],
            ] as const
          ).map(([side, Icon, hidden, direction]) =>
            hidden ? null : (
              <button
                key={side}
                type="button"
                aria-label={t(`scroll.${side}`)}
                onClick={() => scrollRow(direction)}
                // Dikey konum kapagin ortasi: 152px genislikte 2/3 oranli kapak
                // 228px yuksek, yarisi 114px.
                className={cn(
                  "absolute top-[114px] hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-surface/95 text-ink-muted shadow-lg transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex",
                  side === "left" ? "-left-3" : "-right-3",
                )}
              >
                <Icon className="size-4" strokeWidth={2} />
              </button>
            ),
          )}
        </div>
      )}
    </section>
  );
}
