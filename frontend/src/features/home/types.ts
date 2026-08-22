import type { Work, WorkType } from "@/features/works/types";

/** Ana sayfadaki kart ve satirlarin veri sekilleri. */

export interface UserSummary {
  username: string;
}

/** Profil sayaclari: izleme, okuma, liste, inceleme. */
export interface ProfileStats {
  watchedCount: number;
  readCount: number;
  listCount: number;
  reviewCount: number;
}

/** "Arkadaslarin sunlari izliyor" satirindaki tek kayit. */
export interface FriendActivity {
  id: number;
  user: UserSummary;
  /** Puanlanan esere ait baslik ya da liste adi. */
  subject: string;
  /** 5 uzerinden, yarim yildiz hassasiyetinde. */
  rating: number;
}

export interface CuratedList {
  /**
   * Adresleme anahtari; `list.id` ile birebir. Slug yok: baslik kullanicinin
   * serbest girdisi - yeniden adlandirmada paylasilmis baglanti kirilirdi,
   * ustelik semada liste baglantisinin kalici olmasi bilincli bir karar
   * (`is_public` varsayilan acik, silme soft delete).
   */
  id: number;
  title: string;
  curator: UserSummary;
  workCount: number;
  coverUrl: string;
}

/** Kenar cubugundaki "Bu Ay" karti. */
export interface MonthlySummary {
  filmCount: number;
  seriesCount: number;
  bookCount: number;
  /** Ayin gunlerine dagilmis kayit sayilari; mini sutun grafigi bunu cizer. */
  activity: number[];
}

/** Trend listesinin filtre secenegi: tur secilmemisse "ALL". */
export type TrendingFilter = "ALL" | WorkType;

export interface TrendingWork extends Work {
  /** Bugunku sirasi; filtre degistikce yeniden hesaplanir. */
  rank: number;
}
