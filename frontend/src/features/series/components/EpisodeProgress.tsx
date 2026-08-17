import { useTranslations } from "next-intl";

interface EpisodeProgressProps {
  watched: number;
  total: number;
}

/**
 * Devam eden dizilerin kartindaki ilerleme cubugu. Filmde karsiligi yok:
 * bir film ya izlenmis ya izlenmemistir, dizide arada bir yer var ve
 * "nerede kalmistim" sorusunun cevabi kartin kendisinde duruyor.
 *
 * Sayi cubugun altinda ayrica yaziyor - ilerleme yalnizca cubugun boyuna
 * birakilmadi.
 */
export function EpisodeProgress({ watched, total }: EpisodeProgressProps) {
  const t = useTranslations("series.progress");

  // Bolum sayisi sifir olamaz ama veri saglayicidan geliyor; sifira bolme
  // kartin tamamini goturmesin.
  const percent = total > 0 ? Math.round((watched / total) * 100) : 0;

  return (
    <div className="mt-2">
      <div
        role="progressbar"
        aria-label={t("aria")}
        aria-valuenow={watched}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuetext={t("label", { watched, total })}
        className="h-1 w-full overflow-hidden rounded-full bg-surface-2"
      >
        <span
          className="block h-full rounded-full bg-brand"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-ink-faint">
        {t("label", { watched, total })}
      </p>
    </div>
  );
}
