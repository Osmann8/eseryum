import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/shared/components/Avatar";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { StarRating } from "@/shared/components/StarRating";
import type { FriendActivity } from "@/features/home/types";

export function FriendsActivity({ items }: { items: FriendActivity[] }) {
  const t = useTranslations("home.friends");

  return (
    <section className="mb-9">
      <SectionHeader
        title={t("title")}
        actionLabel={t("seeAll")}
        actionHref="/diary"
      />

      {items.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("empty")}</p>
      ) : (
        // Kartlar dar ekranda alt satira kacmak yerine yatay kayar: sira
        // bilgisi (kim once kaydetti) korunsun.
        <ul className="scroll-row flex gap-3 overflow-x-auto pb-2">
          {items.map((item) => (
            <li key={item.id} className="shrink-0">
              <Link
                href={`/profile/${item.user.username}`}
                // Genislik tasarimdan: genis ekranda alti kart tam sigsin,
                // dar ekranda satir yatay kaysin.
                className="flex w-[196px] items-center gap-3 rounded-xl border border-line bg-surface px-3 py-3 transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <Avatar username={item.user.username} size="lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm text-ink">
                      {item.user.username}
                    </span>
                    <StarRating
                      value={item.rating}
                      className="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-ink"
                    />
                  </div>
                  <p className="mt-1 truncate text-xs text-ink-muted">
                    {item.subject}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
