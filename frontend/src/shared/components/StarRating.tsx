import { Star } from "lucide-react";
import { cn } from "@/shared/lib/cn";

/**
 * Puan rozeti. Puanlar yarim yildiz hassasiyetinde tutuluyor (4.5 gibi), o
 * yuzden bes yildiz cizmek yerine sayiyi yaziyoruz: kartlarda hem daha
 * okunakli hem daha az yer kapliyor.
 */
export function StarRating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // 5 -> "5,0": sutunlar kayar, ondalik hep yazilir. Bicimleme sunucu ve
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
