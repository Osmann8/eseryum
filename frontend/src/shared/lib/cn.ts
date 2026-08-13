import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Kosullu siniflari birlestirir; cakisan Tailwind siniflarinda sonuncu kazanir. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
