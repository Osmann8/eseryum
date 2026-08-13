import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // Tarih/sayi bicimleri Turkce: 12.480 (nokta binlik), 4,5 (virgul ondalik).
    timeZone: "Europe/Istanbul",
  };
});
