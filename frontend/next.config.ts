import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// Eklenti, cevirileri src/i18n/request.ts uzerinden yukler.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Dockerfile standalone ciktisini kopyaliyor; bu ayar olmadan imaj build'i
  // .next/standalone bulamaz.
  output: "standalone",

  images: {
    // Kapak gorselleri kaynaktan degil bu iki CDN'den geliyor; URL'ler mock
    // dosyalarina `npm run covers` ile yazildi (bkz. scripts/fetch-covers.mjs).
    // next/image yalnizca burada sayili host'lardan gorsel optimize eder -
    // liste disi bir host runtime'da hata verir, sessizce gecmez.
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
      { protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/**" },
    ],
  },
};

export default withNextIntl(nextConfig);
