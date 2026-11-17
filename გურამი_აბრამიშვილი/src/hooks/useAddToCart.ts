import { useCallback } from "react";
import type { CartProduct } from "@/types/cart";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import type { AddResult } from "@/types/cart";

// One place that adds to the cart AND tells the user what happened.
export function useAddToCart(): (product: CartProduct, qty?: number) => AddResult {
  const { addItem } = useCart();
  const { toast } = useToast();

  return useCallback(
    (product: CartProduct, qty = 1) => {
      const result = addItem(product, qty);
      if (result.ok) toast("Added to cart ✓");
      else toast(result.message, "error");
      return result;
    },
    [addItem, toast],
  );
}
