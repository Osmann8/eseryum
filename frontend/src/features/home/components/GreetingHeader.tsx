import { useTranslations } from "next-intl";
import type { UserSummary } from "@/features/home/types";

export function GreetingHeader({ user }: { user: UserSummary }) {
  const t = useTranslations("home");
  const tApp = useTranslations("app");

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-ink">
        {t("greeting", { username: user.username })}{" "}
        <span role="img" aria-label="selam">
          👋
        </span>
      </h1>
      <p className="mt-1 text-sm text-ink-muted">{tApp("tagline")}</p>
    </div>
  );
}
