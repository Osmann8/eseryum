import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarRating } from "@/shared/components/StarRating";
import { WorkCover } from "@/features/works/components/WorkCover";
import type { Work } from "@/features/works/types";

interface MediaCardProps {
  work: Work;
  /**
   * Basligin altindaki tek satir: filmlerde "1972 • 2sa 55dk", dizilerde
   * "2022 • 2 sezon • 18 bolum". Ture ozel olan tek sey bu oldugu icin kart
   * hazir metin aliyor.
   */
  meta: string;
  /**
   * Kapagin sol ustune konan rozet: oneri satirinda zevk ortusmesi, katalogda
   * eseryum puani. Kart hangisi oldugunu bilmiyor, sadece yerini ayiriyor.
   */
  badge?: ReactNode;
  /** Puan satirinin altina eklenen alan (dizilerde ilerleme cubugu). */
  footer?: ReactNode;
}

/**
 * Koleksiyon sayfalarinin kart bileseni. Ana sayfadaki WorkCard'dan ayri
 * duruyor: orada tur ve sira numarasi var, burada ture ozel bir alt satir ve
 * puan rozeti.
 */
export function MediaCard({ work, meta, badge, footer }: MediaCardProps) {
  const t = useTranslations("media.card");
  const tWork = useTranslations("work");

  return (
    <article className="group">
      <Link
        href={`/works/${work.slug}`}
        className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <div className="relative">
          <WorkCover
            coverUrl={work.coverUrl}
            title={work.title}
            className="transition-opacity group-hover:opacity-90"
          />
          {badge && <div className="absolute top-2 left-2">{badge}</div>}
        </div>

        <h3 className="mt-3 truncate text-sm font-medium text-ink">
          {work.title}
        </h3>
      </Link>

      <p className="mt-1 truncate text-xs text-ink-muted">{meta}</p>

      {/*
        Dar sutunda "4,7 (6.884 degerlendirme)" tek satira sigmiyor. Kirpmak
        sayiyi okunmaz yapardi - satir sarilir, kart bir tik uzar.
      */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <StarRating value={work.rating} className="text-ink" />
        <span className="text-xs text-ink-muted">
          {t("ratingCount", { count: work.ratingCount })}
        </span>
      </div>

      {work.imdbRating !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-sm bg-imdb px-1.5 py-px text-[10px] font-bold text-black">
            {tWork("imdb")}
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

      {footer}
    </article>
  );
}
