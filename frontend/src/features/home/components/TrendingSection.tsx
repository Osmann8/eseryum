"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { WorkCard } from "@/features/works/components/WorkCard";
import { useTrendingWorks } from "@/features/home/hooks/use-trending-works";
import type { TrendingFilter } from "@/features/home/types";

const FILTERS: TrendingFilter[] = ["ALL", "FILM", "SERIES", "BOOK"];

/**
 * Tek istemci adasi. Sayfanin geri kalani sunucuda cizilir; burada sekme
 * durumu ve TanStack Query onbellegi var, cunku tur degistikce liste
 * yeniden cekilecek (endpoint gelince: /api/v1/works/trending?type=...).
 */
export function TrendingSection() {
  const t = useTranslations("home.trending");
  const [filter, setFilter] = useState<TrendingFilter>("ALL");
  const { data, isPending, isError } = useTrendingWorks(filter);

  return (
    <section className="mb-9">
      <SectionHeader
        title={t("title")}
        actionLabel={t("seeAll")}
        actionHref="/discover"
      >
        <div className="flex flex-wrap gap-2" role="group">
          {FILTERS.map((option) => (
            <Button
              key={option}
              variant="pill"
              size="sm"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
            >
              {t(`filter.${option}`)}
            </Button>
          ))}
        </div>
      </SectionHeader>

      {isError && <p className="text-sm text-ink-muted">{t("error")}</p>}

      {isPending && (
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="animate-pulse">
              <div className="aspect-[2/3] rounded-lg bg-surface-2" />
              <div className="mt-3 h-3 w-3/4 rounded bg-surface-2" />
              <div className="mt-2 h-3 w-1/2 rounded bg-surface-2" />
            </li>
          ))}
        </ul>
      )}

      {data && data.length === 0 && (
        <p className="text-sm text-ink-muted">{t("empty")}</p>
      )}

      {data && data.length > 0 && (
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {data.map((work) => (
            <li key={work.id}>
              <WorkCard work={work} rank={work.rank} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
