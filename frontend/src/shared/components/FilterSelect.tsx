import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface FilterSelectProps {
  /** Ekran okuyucu icin; gorunur onek yoksa tek bilgi kaynagi bu. */
  label: string;
  /** Tasarimdaki "Siralama:" gibi kutunun icinde duran sabit metin. */
  prefix?: string;
  /** Bos deger secenegi: filtre uygulanmamis hali ("Yil", "Puan", "Tur"). */
  placeholder?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

/**
 * Filtre acilir kutusu. Yerlesik `select` kullaniliyor: klavye, mobil ve ekran
 * okuyucu davranisi hazir geliyor - tasarim sistemi kurmamak icin verilen
 * karar burada da gecerli, ok isareti disinda hicbir sey yeniden yazilmadi.
 */
export function FilterSelect({
  label,
  prefix,
  placeholder,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="relative inline-flex h-9 items-center rounded-lg border border-line bg-surface pr-7 pl-3 text-xs focus-within:border-brand">
      {prefix && (
        <span className="mr-1 whitespace-nowrap text-ink-muted">{prefix}</span>
      )}

      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          // Acilir liste ogeleri tarayicinin kendi cizimidir; koyu temada
          // okunakli kalsin diye renkleri ayrica veriliyor.
          "cursor-pointer appearance-none bg-transparent pr-1 outline-none [&>option]:bg-surface-2 [&>option]:text-ink",
          value === "" ? "text-ink-muted" : "text-ink",
        )}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 text-ink-faint" />
    </div>
  );
}
