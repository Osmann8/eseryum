import { defineRouting } from "next-intl/routing";

/**
 * Su an tek dil var (tr), ama yonlendirme ve anahtar yapisi bastan kurulu:
 * ikinci dil eklendiginde burasi tek satirlik degisiklik olur.
 *
 * localePrefix "as-needed": varsayilan dil URL'de gorunmez (/ , /filmler),
 * eklenecek diller /en/... seklinde ayrisir. SSR'lanan eser sayfalarinin
 * adresi ileride dil eklenince degismesin diye bu secildi.
 */
export const routing = defineRouting({
  locales: ["tr"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
