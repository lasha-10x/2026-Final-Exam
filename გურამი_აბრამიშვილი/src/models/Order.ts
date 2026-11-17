import type { OrderData, OrderStatus, ShippingInfo } from "@/types/order";
import { PROMO_CODE } from "@/utils/constants";
import type { Cart } from "./Cart";

const MINUTE = 60_000;

export class Order {
  private constructor(private readonly data: OrderData) {}

  // Static factory: builds a new order from the current cart.
  static create(cart: Cart, shipping: ShippingInfo, sequence: number, now = new Date()): Order {
    return new Order({
      id: now.getTime(),
      number: `10X-${String(sequence).padStart(5, "0")}`,
      items: cart.lines.map((item) => ({ ...item })),
      shipping: { ...shipping },
      promoCode: cart.hasPromo ? PROMO_CODE : null,
      deliveryMethod: cart.deliveryMethod,
      subtotal: cart.subtotal(),
      discount: cart.discount(),
      shippingCost: cart.shipping(),
      total: cart.total(),
      placedAt: now.toISOString(),
    });
  }

  static from(data: OrderData): Order {
    return new Order(data);
  }

  // The status is never stored: it is computed from the elapsed time (no state to keep in sync).
  static statusAt(placedAt: string, now: Date): OrderStatus {
    const elapsed = now.getTime() - new Date(placedAt).getTime();
    if (elapsed < MINUTE) return "Processing";
    if (elapsed <= 3 * MINUTE) return "Shipped";
    return "Delivered";
  }

  getStatus(now: Date = new Date()): OrderStatus {
    return Order.statusAt(this.data.placedAt, now);
  }

  toJSON(): OrderData {
    return this.data;
  }
}
