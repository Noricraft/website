import "server-only";

import { cookies } from "next/headers";
import { cartCreate } from "./cart";

const CART_ID_COOKIE_NAME = "shopify_cart_id";
const CART_ID_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30;

export async function getCartIdFromCookie(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_ID_COOKIE_NAME)?.value?.trim() || "";
}

export async function setCartIdCookie(cartId: string): Promise<void> {
  const normalizedCartId = cartId.trim();
  if (!normalizedCartId) {
    throw new Error("cartId is required.");
  }

  const cookieStore = await cookies();
  cookieStore.set(CART_ID_COOKIE_NAME, normalizedCartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_ID_COOKIE_TTL_SECONDS,
  });
}

export async function ensureCartId(): Promise<string> {
  const existingCartId = await getCartIdFromCookie();
  if (existingCartId) {
    return existingCartId;
  }

  const cart = await cartCreate();
  if (!cart.id) {
    throw new Error("cartCreate failed: missing cart id.");
  }

  await setCartIdCookie(cart.id);
  return cart.id;
}
