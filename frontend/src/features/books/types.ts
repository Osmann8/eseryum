import type {
  BookDetail,
  CollectionFields,
  MediaQuery,
} from "@/features/works/types";
import type { ActivitySummary } from "@/features/works/types";

/**
 * Kitaplar sekmesine ozel tipler. Filtre, sayac ve tur sekilleri uc koleksiyon
 * sayfasinda da ayni oldugu icin features/works/types.ts'te; burada sadece
 * kitaba ozel olanlar var.
 */

/** Dizideki gibi bir ara durum var: baslanmis ama bitmemis kitap. */
export const BOOK_COLLECTIONS = [
  "ALL",
  "IN_PROGRESS",
  "COMPLETED",
  "PLANNED",
  "FAVORITES",
] as const;

export type BookCollection = (typeof BOOK_COLLECTIONS)[number];

export type BookQuery = MediaQuery<BookCollection>;

export interface BookSummary extends BookDetail, CollectionFields {
  /**
   * Okunan sayfa sayisi. Bitmis kitapta `pageCount`a esit, okuma
   * listesindekinde sifir; ilerleme cubugu bu ikisinin oranini cizer.
   */
  readPages: number;
}

export interface RecommendedBook extends BookSummary {
  /** Zevk ortusmesi yuzdesi (0-100); oneri sirasi bu degere gore. */
  matchScore: number;
}

/**
 * Kitapta "ekranda gecen sure" diye bir sey yok; aylik ozetin ikinci kutusu
 * okunan sayfayi sayiyor.
 */
export interface ReadingActivity extends ActivitySummary {
  totalPages: number;
}
