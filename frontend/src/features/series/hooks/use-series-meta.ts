import { useTranslations } from "next-intl";
import type { SeriesSummary } from "@/features/series/types";

/**
 * Kartin ve liste satirinin alt metni. Iki bilesende de ayni cumle kurulsun
 * diye tek yerde: "2022 • 2 sezon • 19 bölüm".
 *
 * Liste gorunumunde satira daha cok yer var, yapimcinin adi da giriyor.
 */
export function useSeriesMeta() {
  const t = useTranslations("series.meta");

  const base = (series: SeriesSummary) =>
    `${series.year} • ${t("seasons", { count: series.seasonCount })} • ${t("episodes", { count: series.episodeCount })}`;

  return {
    card: base,
    list: (series: SeriesSummary) => `${base(series)} • ${series.creator}`,
  };
}
