import type { OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = {
  Processing: "bg-surface-2 text-muted",
  Shipped: "bg-brand/15 text-accent",
  Delivered: "bg-success/15 text-success",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>{status}</span>;
}
