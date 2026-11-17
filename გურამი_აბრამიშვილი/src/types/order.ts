import type { CartItem, DeliveryMethodId } from "./cart";

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

// No payment method on purpose: payments are out of scope for this project.
export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
  postalCode: string;
  country: string;
}

export interface OrderData {
  id: number; // Date.now() at placement
  number: string; // "10X-00001"
  items: CartItem[];
  shipping: ShippingInfo;
  promoCode: string | null;
  deliveryMethod?: DeliveryMethodId; // missing in orders placed before delivery methods existed
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  placedAt: string; // ISO string
}
