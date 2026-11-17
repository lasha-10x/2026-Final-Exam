import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { OrderData, ShippingInfo } from "@/types/order";
import type { Cart } from "@/models/Cart";
import { Order } from "@/models/Order";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isOrderList } from "@/utils/guards";
import { STORAGE_KEYS } from "@/utils/constants";

interface OrdersContextValue {
  orders: OrderData[]; // newest first
  placeOrder: (cart: Cart, shipping: ShippingInfo) => OrderData;
  clearOrders: () => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useLocalStorage<OrderData[]>(STORAGE_KEYS.orders, [], isOrderList);

  const placeOrder = useCallback(
    (cart: Cart, shipping: ShippingInfo): OrderData => {
      const order = Order.create(cart, shipping, orders.length + 1).toJSON();
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [orders.length, setOrders],
  );

  const clearOrders = useCallback(() => setOrders([]), [setOrders]);
  const value = useMemo(() => ({ orders, placeOrder, clearOrders }), [orders, placeOrder, clearOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (ctx === null) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
}
