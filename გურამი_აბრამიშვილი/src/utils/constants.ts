import type { SortOption } from "@/types/catalog";
import type { DeliveryMethod, DeliveryMethodId } from "@/types/cart";

export const API_BASE_URL = "https://dummyjson.com";
export const PAGE_SIZE = 12;

export const PROMO_CODE = "10X10";
export const PROMO_PERCENT = 10;

export const STORAGE_KEYS = {
  user: "shop_user",
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
  wishlist: "shop_wishlist",
  compare: "shop_compare",
  searchHistory: "shop_search_history",
} as const;

export const COMPARE_LIMIT = 4;
export const SEARCH_HISTORY_LIMIT = 8;

export const DEFAULT_DELIVERY_METHOD: DeliveryMethodId = "standard";

export const DELIVERY_METHODS: readonly DeliveryMethod[] = [
  {
    id: "standard",
    label: "Standard delivery",
    description: "Free on orders of $100 or more",
    eta: "3-5 business days",
    cost: 10,
    freeFrom: 100,
  },
  { id: "express", label: "Express delivery", description: "Priority courier to your door", eta: "1-2 business days", cost: 25 },
  { id: "pickup", label: "Store pickup", description: "Collect your order from our Tbilisi store", eta: "Ready tomorrow", cost: 0 },
];

export function getDeliveryMethod(id: DeliveryMethodId): DeliveryMethod {
  return DELIVERY_METHODS.find((m) => m.id === id) ?? DELIVERY_METHODS[0];
}

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "title-asc", label: "Name A→Z" },
];

export const COUNTRIES = ["Georgia", "Armenia", "Azerbaijan", "Germany", "United Kingdom", "United States", "Turkey"] as const;

export const LOW_STOCK_LIMIT = 5;
