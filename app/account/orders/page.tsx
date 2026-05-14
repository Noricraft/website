import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerOrders, type CustomerOrder } from "../../../lib/customer-account";

function formatMoney(amount?: string | null, currencyCode?: string | null): string {
  const numericAmount = Number(amount ?? "0");
  const currency = currencyCode || "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatOrderTitle(order: CustomerOrder): string {
  if (order.name?.trim()) {
    return order.name.trim();
  }

  if (order.number !== null && order.number !== undefined) {
    return `Order #${order.number}`;
  }

  return "Order";
}

export default async function AccountOrdersPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("customer_access_token")?.value?.trim() || "";

  if (!accessToken) {
    redirect("/login");
  }

  let orders: CustomerOrder[] = [];
  try {
    orders = await getCustomerOrders(accessToken, 10);
  } catch {
    redirect("/login");
  }

  return (
    <section aria-labelledby="account-orders-title" className="space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 id="account-orders-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
          Orders
        </h1>
        <p className="mt-2 text-sm text-black/60">Your latest 10 orders.</p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        {orders.length === 0 ? (
          <p className="text-sm text-black/60">No orders found yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-black/10 bg-white px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-black">{formatOrderTitle(order)}</p>
                  <p className="text-sm font-semibold text-[#15803d]">
                    {formatMoney(order.totalPrice?.amount, order.totalPrice?.currencyCode)}
                  </p>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/60">
                  <span>{formatDate(order.processedAt)}</span>
                  {order.financialStatus ? <span>Payment: {order.financialStatus}</span> : null}
                  {order.fulfillmentStatus ? <span>Fulfillment: {order.fulfillmentStatus}</span> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
