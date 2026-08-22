import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";

/**
 * TMDB posterlerinin oranı 2:3 (w500 = 500x750). next/image'in yer ayirmak
 * icin bir olcuye ihtiyaci var; CSS zaten `aspect-[2/3] w-full` ile uzerine
 * yaziyor, bu degerler sadece oran bilgisi.
 */
const POSTER_WIDTH = 500;
const POSTER_HEIGHT = 750;

/**
 * Kapak alani. Gorseli olmayan eser istisna degil kural: acik katalog
 * verisinde, ozellikle Turkce baskilarda kapak cogu zaman yok. Bu yuzden
 * bos durum kartin bozulmus hali degil, tasarlanmis hali.
 */
export function WorkCover({
  coverUrl,
  title,
  className,
  compact = false,
}: {
  coverUrl?: string;
  title: string;
  className?: string;
  /** Kucuk kucuk resimlerde (liste satiri) bos durumun yazisi sigmaz, kalkar. */
  compact?: boolean;
}) {
  const t = useTranslations("work");

  if (!coverUrl) {
    return (
      <div
        className={cn(
          "flex aspect-[2/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong bg-surface-2/40 px-3 text-center",
          className,
        )}
        title={compact ? t("noCover") : undefined}
      >
        <ImageIcon className="size-6 text-ink-faint" strokeWidth={1.5} />
        {compact ? (
          <span className="sr-only">{t("noCover")}</span>
        ) : (
          <span className="text-xs leading-tight text-ink-faint">
            {t("noCover")}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={coverUrl}
      alt={title}
      width={POSTER_WIDTH}
      height={POSTER_HEIGHT}
      /*
        Liste satirinda kapak 44px; izgarada sutun genisligi kadar. Dogru
        srcset secilsin diye ikisini ayirmak gerekiyor, yoksa 44px'lik
        kucuk resim icin 500px'lik poster iniyor.
      */
      sizes={
        compact ? "44px" : "(min-width: 1280px) 220px, (min-width: 640px) 25vw, 45vw"
      }
      /*
        Kapagi bulunamayan eserler public/covers altindaki yer tutucu
        SVG'lerinde kaliyor. next/image SVG'yi varsayilan olarak optimize
        etmeyi reddediyor (dangerouslyAllowSVG kapali); zaten vektor
        dosyasini kucultmenin anlami yok, optimizeciyi atliyoruz.
      */
      unoptimized={coverUrl.endsWith(".svg")}
      className={cn(
        "aspect-[2/3] w-full rounded-lg border border-line object-cover",
        className,
      )}
    />
  );
}
