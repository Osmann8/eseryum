import { getTranslations } from "next-intl/server";
import { ComingSoon } from "@/shared/components/ComingSoon";

export default async function Page() {
  const t = await getTranslations("nav");
  return <ComingSoon title={t("lists")} />;
}
