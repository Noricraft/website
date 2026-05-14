"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  cartGet,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
} from "../../lib/cart";
import { ensureCartId } from "../../lib/cart-cookie";

type CartActionResult = {
  totalQuantity: number;
};

function normalizeId(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }
  return normalized;
}

function normalizeQuantity(value: number | undefined, fallback: number): number {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.floor(numericValue);
}

function toResult(totalQuantity?: number | null): CartActionResult {
  return {
    totalQuantity: totalQuantity ?? 0,
  };
}

function revalidateCartPaths(includeHome = false): void {
  revalidatePath("/cart");
  if (includeHome) {
    revalidatePath("/");
  }
}

function extractLineIds(
  cart:
    | {
        lines?: {
          edges?: Array<{
            node?: {
              id?: string | null;
            } | null;
          } | null> | null;
        } | null;
      }
    | null
): string[] {
  return (
    cart?.lines?.edges
      ?.map((edge) => edge?.node?.id?.trim() || "")
      .filter(Boolean) ?? []
  );
}

export async function addToCart(
  variantId: string,
  quantity = 1
): Promise<CartActionResult> {
  const cartId = await ensureCartId();
  const normalizedVariantId = normalizeId(variantId, "variantId");
  const normalizedQuantity = Math.max(1, normalizeQuantity(quantity, 1));

  const cart = await cartLinesAdd(cartId, [
    {
      merchandiseId: normalizedVariantId,
      quantity: normalizedQuantity,
    },
  ]);

  revalidateCartPaths(true);
  return toResult(cart.totalQuantity);
}

export async function addToCartAndRedirect(
  variantId: string,
  quantity = 1
): Promise<never> {
  await addToCart(variantId, quantity);
  redirect("/cart");
}

export async function updateLine(
  lineId: string,
  quantity: number
): Promise<CartActionResult> {
  const normalizedLineId = normalizeId(lineId, "lineId");
  const normalizedQuantity = normalizeQuantity(quantity, 1);

  if (normalizedQuantity < 1) {
    return removeLine(normalizedLineId);
  }

  const cartId = await ensureCartId();
  const cart = await cartLinesUpdate(cartId, [
    {
      id: normalizedLineId,
      quantity: normalizedQuantity,
    },
  ]);

  revalidateCartPaths(true);
  return toResult(cart.totalQuantity);
}

export async function removeLine(lineId: string): Promise<CartActionResult> {
  const cartId = await ensureCartId();
  const normalizedLineId = normalizeId(lineId, "lineId");
  const cart = await cartLinesRemove(cartId, [normalizedLineId]);

  revalidateCartPaths(true);
  return toResult(cart.totalQuantity);
}

export async function clearCart(): Promise<CartActionResult> {
  const cartId = await ensureCartId();
  const cart = await cartGet(cartId);
  const lineIds = extractLineIds(cart);

  if (lineIds.length === 0) {
    return toResult(cart?.totalQuantity);
  }

  const updatedCart = await cartLinesRemove(cartId, lineIds);
  revalidateCartPaths(true);
  return toResult(updatedCart.totalQuantity);
}
