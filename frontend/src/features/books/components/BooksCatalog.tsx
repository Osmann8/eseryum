"use client";

import { useTranslations } from "next-intl";
import { MediaCatalog } from "@/features/works/components/MediaCatalog";
import { PageProgress } from "@/features/books/components/PageProgress";
import { useBooksCatalog } from "@/features/books/hooks/use-books-catalog";
import { useBookMeta } from "@/features/books/hooks/use-book-meta";
import {
  BOOK_COLLECTIONS,
  type BookCollection,
  type BookQuery,
} from "@/features/books/types";

interface BooksCatalogProps {
  query: BookQuery;
  onCollectionChange: (collection: BookCollection) => void;
}

/**
 * "Tum Kitaplar" izgarasi. Duzenin tamami MediaCatalog'da; buradan gecen
 * kitaba ozel bilgiler kartin alt satiri ve okunmakta olanlardaki ilerleme
 * cubugu.
 */
export function BooksCatalog({ query, onCollectionChange }: BooksCatalogProps) {
  const t = useTranslations("books");
  const tCollection = useTranslations("books.collection");
  const meta = useBookMeta();

  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useBooksCatalog(query);

  return (
    <MediaCatalog
      title={t("catalog.title")}
      emptyLabel={t("catalog.empty")}
      collections={BOOK_COLLECTIONS}
      collectionLabel={(collection) => tCollection(collection)}
      activeCollection={query.collection}
      onCollectionChange={onCollectionChange}
      meta={meta.card}
      // Cubuk sadece okunmakta olanlarda: bitmis kitapta %100 dolu bir cubuk
      // bilgi tasimiyor, okuma listesindekinde de bos cubuk.
      footer={(book) =>
        book.isInProgress ? (
          <PageProgress read={book.readPages} total={book.pageCount} />
        ) : null
      }
      result={{
        items: data?.pages.flatMap((page) => page.content) ?? [],
        isPending,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
      }}
    />
  );
}
