import { useTranslations } from "next-intl";

/**
 * Gezinme cubugundaki her baglantinin bir karsiligi olsun diye duran gecici
 * ekran. Ilgili ticket geldiginde route dosyasi bu bileseni degil gercek
 * sayfayi cizecek.
 */
export function ComingSoon({ title }: { title: string }) {
  const t = useTranslations("common");

  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
      <h1 className="text-lg font-semibold text-ink">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        {t("soonDescription")}
      </p>
      <p className="mt-4 inline-block rounded-full border border-line px-3 py-1 text-xs text-ink-faint">
        {t("soon")}
      </p>
    </div>
  );
}
