import type { CartItem, DeliveryMethodId } from "@/types/cart";
import { DEFAULT_DELIVERY_METHOD, PROMO_CODE, PROMO_PERCENT, getDeliveryMethod } from "@/utils/constants";
import { discountedPrice, round2 } from "@/utils/format";

export interface ICart {
  subtotal(): number;
  discount(): number;
  shipping(): number;
  total(): number;
}

// All price maths lives here, without any UI: easy to reason about and to test.
export class Cart implements ICart {
  static readonly FREE_SHIPPING_FROM = 100;
  static readonly SHIPPING_COST = 10;

  constructor(
    private readonly items: readonly CartItem[],
    private readonly promoCode: string | null,
    private readonly method: DeliveryMethodId = DEFAULT_DELIVERY_METHOD,
  ) {}

  get deliveryMethod(): DeliveryMethodId {
    return this.method;
  }

  get lines(): readonly CartItem[] {
    return this.items;
  }

  get itemCount(): number {
    return this.items.reduce((n, item) => n + item.quantity, 0);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get hasPromo(): boolean {
    return this.promoCode === PROMO_CODE;
  }

  static unitPrice(item: CartItem): number {
    return discountedPrice(item.price, item.discountPercentage);
  }

  static lineTotal(item: CartItem): number {
    return round2(Cart.unitPrice(item) * item.quantity);
  }

  subtotal(): number {
    return round2(this.items.reduce((sum, item) => sum + Cart.lineTotal(item), 0));
  }

  discount(): number {
    return this.hasPromo ? round2((this.subtotal() * PROMO_PERCENT) / 100) : 0;
  }

  shipping(): number {
    if (this.isEmpty) return 0;
    return Cart.shippingFor(this.method, this.subtotal() - this.discount());
  }

  // Price of one delivery method for an order amount (after discount); also used to list all options.
  static shippingFor(method: DeliveryMethodId, amountAfterDiscount: number): number {
    const { cost, freeFrom } = getDeliveryMethod(method);
    return freeFrom !== undefined && amountAfterDiscount >= freeFrom ? 0 : cost;
  }

  total(): number {
    return round2(this.subtotal() - this.discount() + this.shipping());
  }
}
