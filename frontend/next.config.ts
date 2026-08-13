import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// Eklenti, cevirileri src/i18n/request.ts uzerinden yukler.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Dockerfile standalone ciktisini kopyaliyor; bu ayar olmadan imaj build'i
  // .next/standalone bulamaz.
  output: "standalone",
};

export default withNextIntl(nextConfig);
