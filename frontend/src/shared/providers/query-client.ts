import { cache } from "react";
import { QueryClient } from "@tanstack/react-query";

/**
 * Sunucu tarafinda prefetch icin kullanilan istemci. `cache` ile sarildigi
 * icin her istek kendi QueryClient'ini alir; modul seviyesinde tek bir
 * client tutulsaydi bir kullanicinin verisi digerine sizardi.
 */
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    }),
);
