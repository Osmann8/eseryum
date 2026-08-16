import { Bell, ChevronDown, Mail, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/shared/components/Avatar";
import type { UserSummary } from "@/features/home/types";

export async function Topbar({ user }: { user: UserSummary }) {
  const t = await getTranslations("topbar");
  const tApp = await getTranslations("app");

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-line bg-shell">
      <div className="flex w-[190px] shrink-0 items-center px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-ink hover:text-brand-strong"
        >
          {tApp("name")}
        </Link>
      </div>

      <div className="flex flex-1 items-center gap-3 px-4 sm:px-6">
        {/*
          Arama su an sadece gorunum: /search sayfasi ve provider aramasi ayri
          ticket. Form olarak yazildi ki klavyeyle davranisi bastan dogru olsun.
        */}
        <form action="/search" className="relative w-full max-w-[420px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            name="q"
            aria-label={t("searchLabel")}
            placeholder={t("searchPlaceholder")}
            className="h-10 w-full rounded-lg border border-line bg-surface-2 pr-20 pl-9 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 gap-1 text-[10px] text-ink-faint">
            <kbd className="rounded border border-line px-1.5 py-0.5">Ctrl</kbd>
            <kbd className="rounded border border-line px-1.5 py-0.5">K</kbd>
          </span>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label={t("notifications")}
            className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Bell className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={t("messages")}
            className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Mail className="size-5" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            aria-label={t("accountMenu")}
            className="ml-2 flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 transition-colors hover:bg-surface-2"
          >
            <Avatar username={user.username} />
            <span className="hidden text-sm text-ink sm:inline">
              {user.username}
            </span>
            <ChevronDown className="size-4 text-ink-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
