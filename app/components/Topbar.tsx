import { isAuthenticated } from "../../lib/auth-session";
import { cartGet } from "../../lib/cart";
import { getCartIdFromCookie } from "../../lib/cart-cookie";
import TopbarClient from "./TopbarClient";

export default async function Topbar() {
  const [hasCustomerSession, cartId] = await Promise.all([
    isAuthenticated(),
    getCartIdFromCookie(),
  ]);

  let cartQuantity = 0;
  if (cartId) {
    try {
      const cart = await cartGet(cartId);
      cartQuantity = Math.max(0, cart?.totalQuantity ?? 0);
    } catch {
      cartQuantity = 0;
    }
  }

  return (
    <TopbarClient
      hasCustomerSession={hasCustomerSession}
      cartQuantity={cartQuantity}
    />
  );
}
