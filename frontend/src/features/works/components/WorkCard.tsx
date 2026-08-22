import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarRating } from "@/shared/components/StarRating";
import { WorkCover } from "@/features/works/components/WorkCover";
import type { Work } from "@/features/works/types";

interface WorkCardProps {
  work: Work;
  /** Verilirse kapagin sol ustunde sira rozeti cizilir (01, 02...). */
  rank?: number;
}

export function WorkCard({ work, rank }: WorkCardProps) {
  const t = useTranslations("work");
  const tType = useTranslations("workType");

  return (
    <article className="group">
      <Link
        href={`/works/${work.id}`}
        className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <div className="relative">
          <WorkCover
            coverUrl={work.coverUrl}
            title={work.title}
            className="transition-opacity group-hover:opacity-90"
          />
          {rank !== undefined && (
            <span className="absolute top-2 left-2 rounded-md bg-canvas/85 px-1.5 py-0.5 font-mono text-xs text-ink">
              {/* 1 -> "01": sutun genisligi sabit kalsin. */}
              {String(rank).padStart(2, "0")}
            </span>
          )}
        </div>

        <h3 className="mt-3 truncate text-sm font-medium text-ink">
          {work.title}
        </h3>
      </Link>

      <p className="mt-1 text-xs text-ink-muted">
        {work.year} • {tType(work.type)}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <StarRating value={work.rating} className="text-ink" />
        <span className="truncate text-xs text-ink-muted">
          {t("ratingCount", { count: work.ratingCount })}
        </span>
      </div>

      {work.imdbRating !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-sm bg-imdb px-1.5 py-px text-[10px] font-bold text-black">
            {t("imdb")}
          </span>
          <span className="text-xs text-imdb">
            ★{" "}
            {work.imdbRating.toLocaleString("tr-TR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </span>
        </div>
      )}
    </article>
  );
}
