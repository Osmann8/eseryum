import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/Button";

interface CollectionPageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Dort sayac; etiketler cagirandan gelir ("Izlediğin", "Bitirdiğin"...). */
  counts: { key: string; label: string; value: number }[];
  /** Sag ustteki dugmenin metni ("Film Ekle", "Dizi Ekle"). */
  actionLabel: string;
}

/**
 * Koleksiyon sayfalarinin basligi ve sayaclari. Ana sayfadaki seritten ayri
 * duruyor: oradakiler tum medya turlerini sayiyor, buradakiler tek bir turu.
 */
export function CollectionPageHeader({
  title,
  subtitle,
  icon: Icon,
  counts,
  actionLabel,
}: CollectionPageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-ink">
        {title}
        {/* Sussuz kalmasin diye duran bir ikon; mavi butcesi buraya harcanmaz. */}
        <Icon className="size-5 text-ink-faint" strokeWidth={1.75} />
      </h1>
      <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <dl className="inline-flex flex-wrap rounded-xl border border-line bg-surface">
          {counts.map(({ key, label, value }, index) => (
            <div
              key={key}
              className={`flex min-w-[110px] flex-col gap-1 px-6 py-4 ${
                index > 0 ? "border-l border-line" : ""
              }`}
            >
              <dd className="text-xl font-semibold text-ink">
                {value.toLocaleString("tr-TR")}
              </dd>
              <dt className="text-xs text-ink-muted">{label}</dt>
            </div>
          ))}
        </dl>

        {/*
          Eser ekleme akisi ayri bir ticket (arama + saglayici eslemesi
          gerekiyor). Dugme simdilik Topbar'daki bildirim dugmeleri gibi
          yalnizca gorunum.
        */}
        <Button className="ml-auto">
          {actionLabel}
          <Plus className="size-4" />
        </Button>
      </div>
    </header>
  );
}
