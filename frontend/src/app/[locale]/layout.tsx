import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/shared/providers/query-provider";
import { AppShell } from "@/shared/components/layout/AppShell";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "eseryum",
  description:
    "İzlediğin, okuduğun, bitirdiğin her şey tek bir yerde. Film, dizi ve kitap için tek profil.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Statik cizim icin gerekli: bu cagri olmadan sayfalar istege bagli
  // (dynamic) render'a duser.
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <QueryProvider>
            <AppShell>{children}</AppShell>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
