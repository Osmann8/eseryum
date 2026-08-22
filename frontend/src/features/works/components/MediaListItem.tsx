import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarRating } from "@/shared/components/StarRating";
import { WorkCover } from "@/features/works/components/WorkCover";
import type { Work } from "@/features/works/types";

interface MediaListItemProps {
  work: Work;
  /** Izgaradakinden uzun olabilir: liste gorunumunde satira yer var. */
  meta: string;
  /** Satirin sagindaki rozet (oneri listesinde ortusme yuzdesi). */
  trailing?: ReactNode;
}

/**
 * Kartin liste karsiligi. Izgara gorunumunde kapaga, liste gorunumunde metne
 * yer aciliyor: ayni satira yonetmen/yapimci da sigiyor.
 */
export function MediaListItem({ work, meta, trailing }: MediaListItemProps) {
  const t = useTranslations("media.card");

  return (
    <Link
      href={`/works/${work.id}`}
      className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <WorkCover
        coverUrl={work.coverUrl}
        title={work.title}
        className="w-11 shrink-0"
        compact
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-ink">{work.title}</h3>
        <p className="mt-1 truncate text-xs text-ink-muted">{meta}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <StarRating value={work.rating} className="text-ink" />
          <p className="mt-1 text-[11px] text-ink-faint">
            {t("ratingCount", { count: work.ratingCount })}
          </p>
        </div>
        {trailing}
      </div>
    </Link>
  );
}
