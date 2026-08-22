import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "@/shared/components/SectionHeader";
import type { CuratedList } from "@/features/home/types";

export function WeeklyLists({ lists }: { lists: CuratedList[] }) {
  const t = useTranslations("home.lists");

  return (
    <section>
      <SectionHeader
        title={t("title")}
        actionLabel={t("discoverAll")}
        actionHref="/lists"
        withArrow
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {lists.map((list) => (
          <li key={list.id}>
            <Link
              href={`/lists/${list.id}`}
              className="flex h-full items-center gap-4 overflow-hidden rounded-xl border border-line bg-surface pr-4 transition-colors hover:border-line-strong hover:bg-surface-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Liste
                  kapaklari su an yer tutucu SVG; ayrintili not WorkCover'da. */}
              <img
                src={list.coverUrl}
                alt=""
                loading="lazy"
                className="h-[86px] w-[104px] shrink-0 object-cover"
              />
              <div className="min-w-0 py-3">
                <h3 className="truncate text-sm font-medium text-ink">
                  {list.title}
                </h3>
                <p className="mt-1 truncate text-xs text-ink-muted">
                  {t("byUser", { username: list.curator.username })}
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  {t("workCount", { count: list.workCount })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
