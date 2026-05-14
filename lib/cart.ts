import "server-only";

import { shopifyFetch } from "./shopify";

type MoneyV2 = {
  amount?: string | null;
  currencyCode?: string | null;
};

export type CartUserError = {
  field?: string[] | null;
  message?: string | null;
};

type ProductVariantMerchandise = {
  id?: string | null;
  title?: string | null;
  image?: {
    url?: string | null;
    altText?: string | null;
  } | null;
  product?: {
    handle?: string | null;
    title?: string | null;
  } | null;
};

type CartLine = {
  id?: string | null;
  quantity?: number | null;
  cost?: {
    amountPerQuantity?: MoneyV2 | null;
    subtotalAmount?: MoneyV2 | null;
  } | null;
  merchandise?: ProductVariantMerchandise | null;
};

export type ShopifyCart = {
  id?: string | null;
  checkoutUrl?: string | null;
  totalQuantity?: number | null;
  cost?: {
    subtotalAmount?: MoneyV2 | null;
    totalAmount?: MoneyV2 | null;
  } | null;
  lines?: {
    edges?: Array<{
      node?: CartLine | null;
    } | null> | null;
  } | null;
};

export type CartLineInput = {
  merchandiseId: string;
  quantity?: number;
  sellingPlanId?: string;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
};

export type CartLineUpdateInput = {
  id: string;
  merchandiseId?: string;
  quantity?: number;
  sellingPlanId?: string;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
};

type CartCreateResponse = {
  cartCreate?: {
    cart?: ShopifyCart | null;
    userErrors?: CartUserError[] | null;
  } | null;
};

type CartGetResponse = {
  cart?: ShopifyCart | null;
};

type CartLinesAddResponse = {
  cartLinesAdd?: {
    cart?: ShopifyCart | null;
    userErrors?: CartUserError[] | null;
  } | null;
};

type CartLinesUpdateResponse = {
  cartLinesUpdate?: {
    cart?: ShopifyCart | null;
    userErrors?: CartUserError[] | null;
  } | null;
};

type CartLinesRemoveResponse = {
  cartLinesRemove?: {
    cart?: ShopifyCart | null;
    userErrors?: CartUserError[] | null;
  } | null;
};

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        cost {
          amountPerQuantity {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
            }
            product {
              handle
              title
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate {
    cartCreate {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_GET_QUERY = `
  query CartGet($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function ensureNonEmpty(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }
  return normalized;
}

function throwIfUserErrors(operationName: string, userErrors?: CartUserError[] | null): void {
  const errors = (userErrors ?? []).filter((error) => Boolean(error?.message));
  if (errors.length === 0) {
    return;
  }

  const message = errors
    .map((error) => {
      const messagePart = error.message?.trim() || "Unknown cart error.";
      const fieldPart = error.field?.filter(Boolean).join(".");
      return fieldPart ? `${fieldPart}: ${messagePart}` : messagePart;
    })
    .join(" | ");

  throw new Error(`${operationName} failed: ${message}`);
}

function requireCart(operationName: string, cart?: ShopifyCart | null): ShopifyCart {
  if (!cart?.id) {
    throw new Error(`${operationName} failed: missing cart in Shopify response.`);
  }
  return cart;
}

export async function cartCreate(): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
    cache: "no-store",
  });

  const payload = data.cartCreate;
  throwIfUserErrors("cartCreate", payload?.userErrors);
  return requireCart("cartCreate", payload?.cart);
}

export async function cartGet(cartId: string): Promise<ShopifyCart | null> {
  const normalizedCartId = ensureNonEmpty(cartId, "cartId");
  const data = await shopifyFetch<CartGetResponse>({
    query: CART_GET_QUERY,
    variables: { cartId: normalizedCartId },
    cache: "no-store",
  });

  return data.cart ?? null;
}

export async function cartLinesAdd(cartId: string, lines: CartLineInput[]): Promise<ShopifyCart> {
  const normalizedCartId = ensureNonEmpty(cartId, "cartId");

  const data = await shopifyFetch<CartLinesAddResponse>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId: normalizedCartId,
      lines,
    },
    cache: "no-store",
  });

  const payload = data.cartLinesAdd;
  throwIfUserErrors("cartLinesAdd", payload?.userErrors);
  return requireCart("cartLinesAdd", payload?.cart);
}

export async function cartLinesUpdate(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<ShopifyCart> {
  const normalizedCartId = ensureNonEmpty(cartId, "cartId");

  const data = await shopifyFetch<CartLinesUpdateResponse>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId: normalizedCartId,
      lines,
    },
    cache: "no-store",
  });

  const payload = data.cartLinesUpdate;
  throwIfUserErrors("cartLinesUpdate", payload?.userErrors);
  return requireCart("cartLinesUpdate", payload?.cart);
}

export async function cartLinesRemove(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const normalizedCartId = ensureNonEmpty(cartId, "cartId");

  const data = await shopifyFetch<CartLinesRemoveResponse>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId: normalizedCartId,
      lineIds,
    },
    cache: "no-store",
  });

  const payload = data.cartLinesRemove;
  throwIfUserErrors("cartLinesRemove", payload?.userErrors);
  return requireCart("cartLinesRemove", payload?.cart);
}
