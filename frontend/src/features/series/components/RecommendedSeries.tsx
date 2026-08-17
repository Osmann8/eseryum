"use client";

import { useTranslations } from "next-intl";
import { RecommendationRow } from "@/features/works/components/RecommendationRow";
import { useSeriesMeta } from "@/features/series/hooks/use-series-meta";
import type { RecommendedSeries as RecommendedSeriesItem } from "@/features/series/types";

/**
 * "Sana Ozel Oneriler" satirinin dizi hali: satirin kendisi ortak, buradan
 * gecen tek sey kartin ve liste satirinin alt metni.
 */
export function RecommendedSeries({
  series,
}: {
  series: RecommendedSeriesItem[];
}) {
  const t = useTranslations("series.recommendations");
  const meta = useSeriesMeta();

  return (
    <RecommendationRow
      items={series}
      emptyLabel={t("empty")}
      meta={meta.card}
      listMeta={meta.list}
    />
  );
}
