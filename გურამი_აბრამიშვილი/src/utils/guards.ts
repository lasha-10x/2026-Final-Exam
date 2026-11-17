import type { AuthUser } from "@/types/user";
import type { CartItem, CartState, DeliveryMethodId } from "@/types/cart";
import type { OrderData } from "@/types/order";
import type { Product, Review } from "@/types/product";
import type { Theme } from "@/types/catalog";

// JSON has no types, so everything read from localStorage goes through these guards.
export function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export function isTheme(x: unknown): x is Theme {
  return x === "light" || x === "dark";
}

export function isAuthUser(x: unknown): x is AuthUser {
  return (
    isRecord(x) &&
    typeof x.username === "string" &&
    typeof x.isLoggedIn === "boolean" &&
    typeof x.firstName === "string" &&
    typeof x.lastName === "string" &&
    typeof x.email === "string" &&
    typeof x.phone === "string"
  );
}

export function isCartItem(x: unknown): x is CartItem {
  return (
    isRecord(x) &&
    typeof x.productId === "number" &&
    typeof x.title === "string" &&
    typeof x.thumbnail === "string" &&
    typeof x.price === "number" &&
    typeof x.discountPercentage === "number" &&
    typeof x.stock === "number" &&
    typeof x.quantity === "number"
  );
}

export function isDeliveryMethodId(x: unknown): x is DeliveryMethodId {
  return x === "standard" || x === "express" || x === "pickup";
}

export function isCartState(x: unknown): x is CartState {
  return (
    isRecord(x) &&
    Array.isArray(x.items) &&
    x.items.every(isCartItem) &&
    (x.promoCode === undefined || x.promoCode === null || typeof x.promoCode === "string") &&
    (x.deliveryMethod === undefined || isDeliveryMethodId(x.deliveryMethod))
  );
}

export function isStringList(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((s) => typeof s === "string");
}

export function isReview(x: unknown): x is Review {
  return (
    isRecord(x) &&
    typeof x.rating === "number" &&
    typeof x.comment === "string" &&
    typeof x.date === "string" &&
    typeof x.reviewerName === "string"
  );
}

export function isReviewsMap(x: unknown): x is Record<string, Review[]> {
  return isRecord(x) && Object.values(x).every((list) => Array.isArray(list) && list.every(isReview));
}

export function isOrderData(x: unknown): x is OrderData {
  return (
    isRecord(x) &&
    typeof x.id === "number" &&
    typeof x.number === "string" &&
    Array.isArray(x.items) &&
    x.items.every(isCartItem) &&
    isRecord(x.shipping) &&
    typeof x.subtotal === "number" &&
    typeof x.discount === "number" &&
    typeof x.shippingCost === "number" &&
    typeof x.total === "number" &&
    (x.deliveryMethod === undefined || isDeliveryMethodId(x.deliveryMethod)) &&
    typeof x.placedAt === "string"
  );
}

export function isOrderList(x: unknown): x is OrderData[] {
  return Array.isArray(x) && x.every(isOrderData);
}

export function isProduct(x: unknown): x is Product {
  return (
    isRecord(x) &&
    typeof x.id === "number" &&
    typeof x.title === "string" &&
    typeof x.price === "number" &&
    typeof x.thumbnail === "string" &&
    typeof x.stock === "number" &&
    Array.isArray(x.images) &&
    Array.isArray(x.reviews)
  );
}

export function isProductList(x: unknown): x is Product[] {
  return Array.isArray(x) && x.every(isProduct);
}
