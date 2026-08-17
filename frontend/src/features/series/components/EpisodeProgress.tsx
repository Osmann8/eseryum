import { useTranslations } from "next-intl";
import { ProgressBar } from "@/features/works/components/ProgressBar";

/** Devam eden dizilerin ilerlemesi: "12/19 bölüm". */
export function EpisodeProgress({
  watched,
  total,
}: {
  watched: number;
  total: number;
}) {
  const t = useTranslations("series.progress");

  return (
    <ProgressBar
      value={watched}
      max={total}
      label={t("label", { watched, total })}
      ariaLabel={t("aria")}
    />
  );
}
