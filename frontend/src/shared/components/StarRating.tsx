import { Star } from "lucide-react";
import { cn } from "@/shared/lib/cn";

/**
 * Puan rozeti. Skala 0-10 ve 0.5 adimli (9.5 gibi) - veritabaniyla ayni.
 * Yildiz dizisi cizilmiyor, tek ikon + sayi yaziliyor: yirmi bir kademeyi
 * yildizla gostermek okunaksiz olurdu, sayi hem net hem daha az yer kapliyor.
 */
export function StarRating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // 9 -> "9,0": sutunlar kaymasin diye ondalik hep yazilir. Bicimleme sunucu ve
  // istemcide ayni sonucu versin diye locale acikca veriliyor.
  const formatted = value.toLocaleString("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <span
      className={cn("inline-flex items-center gap-1 text-xs", className)}
      aria-label={formatted}
    >
      {/* Notr ton: bu ikon her kartta gorunuyor, marka rengi burada harcanmaz. */}
      <Star className="size-3 fill-star text-star" />
      <span aria-hidden="true">{formatted}</span>
    </span>
  );
}
