import { useTranslations } from "next-intl";
import { ProgressBar } from "@/features/works/components/ProgressBar";

/** Okunmakta olan kitaplarin ilerlemesi: "182/604 sayfa". */
export function PageProgress({ read, total }: { read: number; total: number }) {
  const t = useTranslations("books.progress");

  return (
    <ProgressBar
      value={read}
      max={total}
      label={t("label", { read, total })}
      ariaLabel={t("aria")}
    />
  );
}
