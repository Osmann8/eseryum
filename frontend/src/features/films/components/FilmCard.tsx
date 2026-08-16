import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarRating } from "@/shared/components/StarRating";
import { WorkCover } from "@/features/works/components/WorkCover";
import { useRuntimeLabel } from "@/features/films/hooks/use-runtime-label";
import type { FilmSummary } from "@/features/films/types";

interface FilmCardProps {
  film: FilmSummary;
  /**
   * Kapagin sol ustune konan rozet: oneri satirinda zevk ortusmesi, katalogda
   * kullanicinin kendi puani. Kart hangisi oldugunu bilmiyor, sadece yerini
   * ayiriyor.
   */
  badge?: ReactNode;
}

/**
 * Filmler sekmesinin kart bileseni. WorkCard'dan ayri duruyor cunku burada
 * tur yazmiyor (zaten hepsi film), yerine sure var - ve rozet alani ana
 * sayfadaki sira numarasindan farkli isler yapiyor.
 */
export function FilmCard({ film, badge }: FilmCardProps) {
  const t = useTranslations("work");
  // Degerlendirme sayisi bu sayfada parantez icinde yaziliyor, o yuzden
  // metin ortak "work" anahtarindan degil films'ten geliyor.
  const tCard = useTranslations("films.card");
  const runtimeLabel = useRuntimeLabel();

  return (
    <article className="group">
      <Link
        href={`/works/${film.slug}`}
        className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <div className="relative">
          <WorkCover
            coverUrl={film.coverUrl}
            title={film.title}
            className="transition-opacity group-hover:opacity-90"
          />
          {badge && <div className="absolute top-2 left-2">{badge}</div>}
        </div>

        <h3 className="mt-3 truncate text-sm font-medium text-ink">
          {film.title}
        </h3>
      </Link>

      <p className="mt-1 truncate text-xs text-ink-muted">
        {film.year} • {runtimeLabel(film.runtimeMinutes)}
      </p>

      {/*
        Dar sutunda "4,7 (6.884 degerlendirme)" tek satira sigmiyor. Kirpmak
        sayiyi okunmaz yapardi - satir sarilir, kart bir tik uzar.
      */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <StarRating value={film.rating} className="text-ink" />
        <span className="text-xs text-ink-muted">
          {tCard("ratingCount", { count: film.ratingCount })}
        </span>
      </div>

      {film.imdbRating !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-sm bg-imdb px-1.5 py-px text-[10px] font-bold text-black">
            {t("imdb")}
          </span>
          <span className="text-xs text-imdb">
            ★{" "}
            {film.imdbRating.toLocaleString("tr-TR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </span>
        </div>
      )}
    </article>
  );
}
