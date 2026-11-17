import type { Product } from "./product";

export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  stock: number;
  quantity: number;
}

export type DeliveryMethodId = "standard" | "express" | "pickup";

export interface DeliveryMethod {
  id: DeliveryMethodId;
  label: string;
  description: string;
  eta: string; // human readable delivery time
  cost: number;
  freeFrom?: number; // order amount (after discount) from which this method becomes free
}

export interface CartState {
  items: CartItem[];
  promoCode?: string | null;
  deliveryMethod?: DeliveryMethodId; // missing in older saved carts -> "standard"
}

// The only product fields the cart needs (utility type instead of a copy of Product).
export type CartProduct = Pick<
  Product,
  "id" | "title" | "thumbnail" | "price" | "discountPercentage" | "stock"
>;

export type AddResult = { ok: true } | { ok: false; message: string };
