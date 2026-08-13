import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface SectionHeaderProps {
  title: string;
  actionLabel: string;
  actionHref: string;
  /** Basligin sagina eklenen filtre sekmeleri gibi ogeler. */
  children?: ReactNode;
  /** Tasarimda "Tum Listeleri Kesfet" oku aliyor, "Tumunu Gor" almiyor. */
  withArrow?: boolean;
}

export function SectionHeader({
  title,
  actionLabel,
  actionHref,
  children,
  withArrow = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {children}
      <Link
        href={actionHref}
        className="ml-auto inline-flex items-center gap-1 text-sm text-brand-strong hover:underline"
      >
        {actionLabel}
        {withArrow && <ArrowRight className="size-3.5" />}
      </Link>
    </div>
  );
}
