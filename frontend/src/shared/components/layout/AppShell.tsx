import type { ReactNode } from "react";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Topbar } from "@/shared/components/layout/Topbar";
import {
  fetchCurrentUser,
  fetchMonthlySummary,
} from "@/features/home/api/home-api";

/**
 * Uygulama cercevesi: ustte arama cubugu, solda gezinme.
 *
 * Kullanici ve "Bu Ay" ozeti burada cekiliyor cunku ikisi de her sayfada
 * gorunuyor; sayfalarin bunlari tekrar tekrar istemesi gerekmesin.
 */
export async function AppShell({ children }: { children: ReactNode }) {
  const [user, monthly] = await Promise.all([
    fetchCurrentUser(),
    fetchMonthlySummary(),
  ]);

  return (
    <div className="min-h-screen bg-canvas">
      <Topbar user={user} />
      <Sidebar monthly={monthly} profileHref={`/profile/${user.username}`} />
      <main className="px-5 pt-16 pb-12 md:pl-[190px]">
        <div className="mx-auto max-w-[1180px] px-1 py-7 sm:px-3">
          {children}
        </div>
      </main>
    </div>
  );
}
