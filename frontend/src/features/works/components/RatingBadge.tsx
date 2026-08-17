import { useTranslations } from "next-intl";
import { StarRating } from "@/shared/components/StarRating";

/**
 * Kapagin sol ustundeki puan rozeti: eseryum ortalamasi. Her kartta var,
 * cunku her eserin bir ortalamasi var - kullanicinin kendi puani rozete
 * konsaydi puanlanmamis eserlerde rozet bosluk birakirdi ve izgara duzensiz
 * gorunurdu.
 *
 * Ayni sayi basligin altinda da yaziyor; oradaki degerlendirme sayisiyla
 * birlikte okunuyor, buradaki ise kapaga bakarken tek bakista gorunsun diye.
 */
export function RatingBadge({ rating }: { rating: number }) {
  const t = useTranslations("media.card");

  return (
    <span className="inline-flex items-center rounded-md bg-canvas/85 px-1.5 py-0.5 ring-1 ring-line-strong backdrop-blur-sm">
      {/* IMDb puani da kartta duruyor; bu rozetin hangisi oldugu soylensin. */}
      <span className="sr-only">{t("rating")}</span>
      <StarRating value={rating} className="text-ink" />
    </span>
  );
}
