import { cn } from "@/shared/lib/cn";

/**
 * Profil fotografi yuklenene kadar kullanilan harf avatari. Renk kullanici
 * adindan turetilir: ayni kisi her yerde ayni renkte gorunur.
 */

const PALETTE = [
  "bg-[#3d4f8a]",
  "bg-[#6b4a7a]",
  "bg-[#3f6b63]",
  "bg-[#7a5638]",
  "bg-[#4a5b7a]",
  "bg-[#6b3f4a]",
];

const SIZES = {
  sm: "size-7 text-[11px]",
  md: "size-9 text-xs",
  lg: "size-11 text-sm",
} as const;

function paletteIndex(seed: string): number {
  let total = 0;
  for (let i = 0; i < seed.length; i += 1) {
    total += seed.charCodeAt(i);
  }
  return total % PALETTE.length;
}

interface AvatarProps {
  username: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function Avatar({ username, size = "md", className }: AvatarProps) {
  // Turkce buyuk harf: "i" -> "İ" olsun diye locale veriliyor.
  const initials = username.slice(0, 2).toLocaleUpperCase("tr-TR");

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white/90 ring-1 ring-white/10",
        PALETTE[paletteIndex(username)],
        SIZES[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
