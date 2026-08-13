import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// next/link yerine bunlar kullanilir: dil oneki adrese otomatik eklenir.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
