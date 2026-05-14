import Link from "next/link";
import { redirect } from "next/navigation";
import CartLineControls from "./CartLineControls";
import { cartGet } from "../../lib/cart";
import { getCartIdFromCookie } from "../../lib/cart-cookie";

type CartLineViewModel = {
  id: string;
  quantity: number;
  subtotalAmount?: string | null;
  subtotalCurrencyCode?: string | null;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  imageUrl: string;
  imageAlt: string;
};

function formatMoney(amount?: string | null, currencyCode?: string | null): string {
  const numericAmount = Number(amount ?? "0");
  const currency = currencyCode || "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
}

function toLineViewModel(
  line:
    | {
        id?: string | null;
        quantity?: number | null;
        cost?: {
          subtotalAmount?: {
            amount?: string | null;
            currencyCode?: string | null;
          } | null;
        } | null;
        merchandise?: {
          title?: string | null;
          image?: {
            url?: string | null;
            altText?: string | null;
          } | null;
          product?: {
            handle?: string | null;
            title?: string | null;
          } | null;
        } | null;
      }
    | null
): CartLineViewModel | null {
  if (!line) {
    return null;
  }

  const id = line?.id?.trim();
  if (!id) {
    return null;
  }

  const quantity = line.quantity ?? 0;
  const productTitle = line.merchandise?.product?.title?.trim() || "Product";
  const variantTitle = line.merchandise?.title?.trim() || "Default";
  const productHandle = line.merchandise?.product?.handle?.trim() || "";
  const imageUrl = line.merchandise?.image?.url?.trim() || "";
  const imageAlt = line.merchandise?.image?.altText?.trim() || productTitle;

  return {
    id,
    quantity,
    subtotalAmount: line.cost?.subtotalAmount?.amount ?? null,
    subtotalCurrencyCode: line.cost?.subtotalAmount?.currencyCode ?? null,
    variantTitle,
    productTitle,
    productHandle,
    imageUrl,
    imageAlt,
  };
}

export default async function CartPage() {
  const cartId = await getCartIdFromCookie();
  const cart = cartId ? await cartGet(cartId) : null;
  const lines =
    cart?.lines?.edges
      ?.map((edge) => toLineViewModel(edge?.node ?? null))
      .filter((line): line is CartLineViewModel => Boolean(line)) ?? [];

  const totalQuantity = cart?.totalQuantity ?? 0;
  const subtotal = formatMoney(
    cart?.cost?.subtotalAmount?.amount,
    cart?.cost?.subtotalAmount?.currencyCode
  );
  const total = formatMoney(
    cart?.cost?.totalAmount?.amount,
    cart?.cost?.totalAmount?.currencyCode
  );
  const checkoutUrl = cart?.checkoutUrl?.trim() || "";
  const canCheckout = totalQuantity > 0 && Boolean(checkoutUrl);

  async function checkoutAction() {
    "use server";

    const currentCartId = await getCartIdFromCookie();
    if (!currentCartId) {
      return;
    }

    const currentCart = await cartGet(currentCartId);
    const currentCheckoutUrl = currentCart?.checkoutUrl?.trim() || "";
    const currentTotalQuantity = Math.max(0, currentCart?.totalQuantity ?? 0);
    if (!currentCheckoutUrl || currentTotalQuantity < 1) {
      return;
    }

    redirect(currentCheckoutUrl);
  }

  return (
    <main>
      <section aria-labelledby="cart-title" className="space-y-6">
        <header className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h1 id="cart-title" className="text-3xl font-semibold tracking-tight md:text-4xl">
            Cart
          </h1>
          <p className="mt-2 text-sm text-black/60">
            {totalQuantity > 0 ? `${totalQuantity} item${totalQuantity === 1 ? "" : "s"}` : "Your cart is empty."}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-6">
            {lines.length === 0 ? (
              <div className="p-2">
                <p className="text-sm text-black/60">No products in cart yet.</p>
                <Link
                  href="/shop"
                  className="mt-4 inline-flex h-10 items-center rounded-full border border-black/10 px-4 text-sm font-medium no-underline hover:bg-black/5"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-black/10">
                {lines.map((line) => (
                  <li key={line.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="h-24 w-24 overflow-hidden rounded-xl border border-black/10 bg-black/5">
                        {line.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={line.imageUrl}
                            alt={line.imageAlt}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xs text-black/50">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        {line.productHandle ? (
                          <Link
                            href={`/shop/${line.productHandle}`}
                            className="text-sm font-semibold text-black no-underline hover:underline"
                          >
                            {line.productTitle}
                          </Link>
                        ) : (
                          <p className="text-sm font-semibold text-black">{line.productTitle}</p>
                        )}
                        <p className="mt-1 text-xs text-black/60">{line.variantTitle}</p>
                        <p className="mt-2 text-sm font-semibold text-[#15803d]">
                          {formatMoney(line.subtotalAmount, line.subtotalCurrencyCode)}
                        </p>

                        <CartLineControls lineId={line.id} quantity={line.quantity} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-black/60">Subtotal</dt>
                <dd className="font-medium text-black">{subtotal}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-2">
                <dt className="text-black/80">Total</dt>
                <dd className="text-base font-semibold text-black">{total}</dd>
              </div>
            </dl>

            <form action={checkoutAction} className="mt-5">
              <button
                type="submit"
                disabled={!canCheckout}
                className={`inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-medium transition ${
                  canCheckout
                    ? "bg-black text-white hover:bg-black/90"
                    : "border border-black/10 text-black/40 cursor-not-allowed"
                }`}
              >
                Checkout
              </button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  );
}
