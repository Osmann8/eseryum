import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarRating } from "@/shared/components/StarRating";
import { WorkCover } from "@/features/works/components/WorkCover";
import { useRuntimeLabel } from "@/features/films/hooks/use-runtime-label";
import type { FilmSummary } from "@/features/films/types";

interface FilmListItemProps {
  film: FilmSummary;
  /** Satirin sagindaki rozet (oneri listesinde ortusme yuzdesi). */
  trailing?: ReactNode;
}

/**
 * Kartin liste karsiligi. Izgara gorunumunde kapaga, liste gorunumunde metne
 * yer aciliyor: ayni satira yonetmen ve sure de sigiyor.
 */
export function FilmListItem({ film, trailing }: FilmListItemProps) {
  const t = useTranslations("films.card");
  const runtimeLabel = useRuntimeLabel();

  return (
    <Link
      href={`/works/${film.slug}`}
      className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <WorkCover
        coverUrl={film.coverUrl}
        title={film.title}
        className="w-11 shrink-0"
        compact
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-ink">{film.title}</h3>
        <p className="mt-1 truncate text-xs text-ink-muted">
          {film.year} • {runtimeLabel(film.runtimeMinutes)} • {film.director}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <StarRating value={film.rating} className="text-ink" />
          <p className="mt-1 text-[11px] text-ink-faint">
            {t("ratingCount", { count: film.ratingCount })}
          </p>
        </div>
        {trailing}
      </div>
    </Link>
  );
}
