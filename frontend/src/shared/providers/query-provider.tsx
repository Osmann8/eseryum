"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * QueryClient state icinde tutulur: modul seviyesinde yaratilirsa sunucuda
 * tum istekler ayni onbellegi paylasir, bir kullanicinin verisi digerine
 * sizar.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            // Sekme degistirip geri gelmek istek atmasin; kullanici
            // tarayicida gezerken arka planda trafik uretmeyelim.
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
