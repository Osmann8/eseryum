import { useTranslations } from "next-intl";
import { StarRating } from "@/shared/components/StarRating";

/**
 * Katalog kartinin kapagindaki puan rozeti. Bu, kullanicinin kendi verdigi
 * puan; basligin altindaki puan sitenin ortalamasi. Ikisi ayni kartta yan yana
 * durdugu icin rozetin ne oldugu ekran okuyucuya ayrica soyleniyor.
 */
export function UserRatingBadge({ rating }: { rating: number }) {
  const t = useTranslations("films.card");

  return (
    <span className="inline-flex items-center rounded-md bg-canvas/85 px-1.5 py-0.5 ring-1 ring-line-strong backdrop-blur-sm">
      <span className="sr-only">{t("yourRating")}</span>
      <StarRating value={rating} className="text-ink" />
    </span>
  );
}
