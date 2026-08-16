"use client";

import {
  BookOpen,
  CalendarDays,
  Film,
  House,
  List,
  Search,
  Settings,
  Tv,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import { MonthlySummaryCard } from "@/features/home/components/MonthlySummaryCard";
import type { MonthlySummary } from "@/features/home/types";

interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

/**
 * Gruplar tasarimdaki ayirac cizgileriyle birebir: once medya turleri, sonra
 * kesif, en altta hesap.
 */
const NAV_GROUPS: NavItem[][] = [
  [
    { href: "/", labelKey: "home", icon: House },
    { href: "/films", labelKey: "films", icon: Film },
    { href: "/series", labelKey: "series", icon: Tv },
    { href: "/books", labelKey: "books", icon: BookOpen },
  ],
  [
    { href: "/discover", labelKey: "discover", icon: Search },
    { href: "/lists", labelKey: "lists", icon: List },
    { href: "/diary", labelKey: "diary", icon: CalendarDays },
  ],
  [
    { href: "/profile", labelKey: "profile", icon: User },
    { href: "/settings", labelKey: "settings", icon: Settings },
  ],
];

interface SidebarProps {
  monthly: MonthlySummary;
  profileHref: string;
}

export function Sidebar({ monthly, profileHref }: SidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <aside className="fixed top-16 bottom-0 left-0 z-30 hidden w-[190px] flex-col justify-between border-r border-line bg-shell md:flex">
      <nav className="flex flex-col gap-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-1">
            {groupIndex > 0 && <hr className="my-3 border-line" />}
            {group.map(({ href, labelKey, icon: Icon }) => {
              // "/" her yolun onekidir; ana sayfa tam eslesmeyle isaretlenir.
              const target = href === "/profile" ? profileHref : href;
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={target}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-brand-soft font-medium text-brand-strong"
                      : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                  {t(labelKey)}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3">
        <MonthlySummaryCard summary={monthly} />
      </div>
    </aside>
  );
}
