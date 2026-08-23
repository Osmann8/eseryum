import { getTranslations } from "next-intl/server";
import { ComingSoon } from "@/shared/components/ComingSoon";

export default async function Page() {
  const t = await getTranslations("pages");
  return <ComingSoon title={t("list")} />;
}
