import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";

/**
 * Kapak alani. Gorseli olmayan eser istisna degil kural: acik katalog
 * verisinde, ozellikle Turkce baskilarda kapak cogu zaman yok. Bu yuzden
 * bos durum kartin bozulmus hali degil, tasarlanmis hali.
 */
export function WorkCover({
  coverUrl,
  title,
  className,
}: {
  coverUrl?: string;
  title: string;
  className?: string;
}) {
  const t = useTranslations("work");

  if (!coverUrl) {
    return (
      <div
        className={cn(
          "flex aspect-[2/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong bg-surface-2/40 px-3 text-center",
          className,
        )}
      >
        <ImageIcon className="size-6 text-ink-faint" strokeWidth={1.5} />
        <span className="text-xs leading-tight text-ink-faint">
          {t("noCover")}
        </span>
      </div>
    );
  }

  return (
    // Kapaklar su an public/ altindaki yer tutucu SVG'ler. TMDB gorselleri
    // baglanip next.config'e remotePatterns eklendiginde next/image'a gecilir.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={coverUrl}
      alt={title}
      loading="lazy"
      className={cn(
        "aspect-[2/3] w-full rounded-lg border border-line object-cover",
        className,
      )}
    />
  );
}
