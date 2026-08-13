import { BookOpen, List, PenLine, Play, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ProfileStats } from "@/features/home/types";

export function StatsBar({ stats }: { stats: ProfileStats }) {
  const t = useTranslations("home.stats");

  const cells: { key: string; value: number; icon: LucideIcon }[] = [
    { key: "watched", value: stats.watchedCount, icon: Play },
    { key: "read", value: stats.readCount, icon: BookOpen },
    { key: "lists", value: stats.listCount, icon: List },
    { key: "reviews", value: stats.reviewCount, icon: PenLine },
  ];

  return (
    <dl className="mb-9 inline-flex flex-wrap rounded-xl border border-line bg-surface">
      {cells.map(({ key, value, icon: Icon }, index) => (
        <div
          key={key}
          className={`flex min-w-[110px] flex-col gap-1 px-6 py-4 ${
            index > 0 ? "border-l border-line" : ""
          }`}
        >
          <dd className="flex items-center gap-2 text-xl font-semibold text-ink">
            <Icon className="size-4 text-ink-muted" strokeWidth={1.75} />
            {value.toLocaleString("tr-TR")}
          </dd>
          <dt className="text-xs text-ink-muted">{t(key)}</dt>
        </div>
      ))}
    </dl>
  );
}
