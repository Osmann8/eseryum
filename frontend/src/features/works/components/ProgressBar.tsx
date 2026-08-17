interface ProgressBarProps {
  value: number;
  max: number;
  /** Cubugun altinda yazan metin: "12/19 bölüm", "182/604 sayfa". */
  label: string;
  /** Ekran okuyucuya cubugun ne olculdugunu soyler. */
  ariaLabel: string;
}

/**
 * Devam eden eserlerin kartindaki ilerleme cubugu. Filmde karsiligi yok:
 * bir film ya izlenmis ya izlenmemistir; dizide ve kitapta arada bir yer var
 * ve "nerede kalmistim" sorusunun cevabi kartin kendisinde duruyor.
 *
 * Sayi cubugun altinda ayrica yaziyor - ilerleme yalnizca cubugun boyuna
 * birakilmadi.
 */
export function ProgressBar({ value, max, label, ariaLabel }: ProgressBarProps) {
  // Toplam sifir olamaz ama veri saglayicidan geliyor; sifira bolme kartin
  // tamamini goturmesin.
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="mt-2">
      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={label}
        className="h-1 w-full overflow-hidden rounded-full bg-surface-2"
      >
        <span
          className="block h-full rounded-full bg-brand"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-ink-faint">{label}</p>
    </div>
  );
}
