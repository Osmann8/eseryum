import { useTranslations } from "next-intl";

/**
 * Dakikayi "2sa 28dk" bicimine cevirir. Metin tr.json'dan geldigi icin bir
 * cevirmen hook'u; sunucu bilesenlerinde de calisir (next-intl'in senkron
 * API'si).
 *
 * Bir saatin altindaki filmler icin saat kismi hic yazilmaz: "0sa 47dk" degil
 * "47dk".
 */
export function useRuntimeLabel() {
  const t = useTranslations("films.runtime");

  return (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0
      ? t("hoursMinutes", { hours, minutes })
      : t("minutes", { minutes });
  };
}
