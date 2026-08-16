import { Target } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Oneri kartinin kapagindaki "%92 Ortusme" rozeti. Yuzde, oneriyi ureten
 * benzerlik puani; kullanicinin ya da sitenin verdigi puanla ilgisi yok.
 */
export function MatchBadge({ score }: { score: number }) {
  const t = useTranslations("films.recommendations");

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-canvas/85 px-1.5 py-0.5 text-[10px] font-medium text-brand-strong ring-1 ring-brand/40 backdrop-blur-sm">
      <Target className="size-3" strokeWidth={2} />
      {t("match", { score })}
    </span>
  );
}
