import {
  Atom,
  Clapperboard,
  Drama,
  Fingerprint,
  Ghost,
  Heart,
  Laugh,
  Sparkles,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { GenreSummary } from "@/features/works/types";

/**
 * Tur ikonlari veriye degil arayuze ait, o yuzden mock'ta degil burada.
 * Listede olmayan bir tur gelirse jenerik ikon cizilir - saglayici yeni bir
 * tur eklediginde sayfa bozulmasin.
 */
const GENRE_ICONS: Record<string, LucideIcon> = {
  drama: Drama,
  "bilim-kurgu": Atom,
  gerilim: Ghost,
  aksiyon: Swords,
  komedi: Laugh,
  suc: Fingerprint,
  fantastik: Sparkles,
  romantik: Heart,
};

export function GenreList({ genres }: { genres: GenreSummary[] }) {
  const t = useTranslations("media.genres");

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-ink">{t("title")}</h2>
        <Link
          href="/discover"
          className="ml-auto text-xs text-brand-strong hover:underline"
        >
          {t("seeAll")}
        </Link>
      </div>

      <ul className="flex flex-col gap-2.5">
        {genres.map((genre) => {
          const Icon = GENRE_ICONS[genre.slug] ?? Clapperboard;

          return (
            <li key={genre.slug} className="flex items-center gap-2 text-xs">
              <Icon className="size-3.5 shrink-0 text-ink-faint" strokeWidth={1.75} />
              <span className="truncate text-ink-muted">{genre.label}</span>
              <span className="ml-auto tabular-nums text-ink-faint">
                {genre.count.toLocaleString("tr-TR")}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
