import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/types/product";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isProductList } from "@/utils/guards";
import { STORAGE_KEYS } from "@/utils/constants";

interface WishlistContextValue {
  items: Product[];
  has: (id: number) => boolean;
  toggle: (product: Product) => boolean; // returns true when the product was ADDED
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// BONUS feature: wishlist persisted in localStorage.
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<Product[]>(STORAGE_KEYS.wishlist, [], isProductList);

  const has = useCallback((id: number) => items.some((p) => p.id === id), [items]);

  const toggle = useCallback(
    (product: Product): boolean => {
      const exists = items.some((p) => p.id === product.id);
      setItems(exists ? items.filter((p) => p.id !== product.id) : [product, ...items]);
      return !exists;
    },
    [items, setItems],
  );

  const clear = useCallback(() => setItems([]), [setItems]);
  const value = useMemo(() => ({ items, has, toggle, clear }), [items, has, toggle, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (ctx === null) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
