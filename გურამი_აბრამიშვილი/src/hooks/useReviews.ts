import { useCallback, useMemo } from "react";
import type { Review } from "@/types/product";
import { StorageService } from "@/models/StorageService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isReviewsMap } from "@/utils/guards";
import { STORAGE_KEYS } from "@/utils/constants";

type ReviewsMap = Record<string, Review[]>;

// Exported so the Profile page can wipe the key ("Clear local data").
export const reviewsStorage = new StorageService<ReviewsMap>(STORAGE_KEYS.reviews, isReviewsMap);

// Reviews written by the user live in localStorage: shop_reviews = { [productId]: Review[] }.
export function useReviews(productId: number): {
  localReviews: Review[];
  addReview: (review: Review) => void;
  updateReview: (date: string, changes: Pick<Review, "rating" | "comment">) => void;
  removeReview: (date: string) => void;
} {
  const [all, setAll] = useLocalStorage<ReviewsMap>(STORAGE_KEYS.reviews, {}, isReviewsMap);

  const localReviews = useMemo(() => all[String(productId)] ?? [], [all, productId]);

  const addReview = useCallback(
    (review: Review) => {
      setAll((prev) => ({ ...prev, [String(productId)]: [review, ...(prev[String(productId)] ?? [])] }));
    },
    [productId, setAll],
  );

  // A review's `date` (ISO timestamp with milliseconds) is its identity: only the user's own reviews live here.
  const updateReview = useCallback(
    (date: string, changes: Pick<Review, "rating" | "comment">) => {
      setAll((prev) => ({
        ...prev,
        [String(productId)]: (prev[String(productId)] ?? []).map((r) => (r.date === date ? { ...r, ...changes } : r)),
      }));
    },
    [productId, setAll],
  );

  const removeReview = useCallback(
    (date: string) => {
      setAll((prev) => ({ ...prev, [String(productId)]: (prev[String(productId)] ?? []).filter((r) => r.date !== date) }));
    },
    [productId, setAll],
  );

  return { localReviews, addReview, updateReview, removeReview };
}
