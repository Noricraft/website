import "server-only";

export function normalizeShopifyCustomerId(
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined) {
    return "";
  }

  const raw = String(value).trim();
  if (!raw) {
    return "";
  }

  if (/^\d+$/.test(raw)) {
    return raw;
  }

  const customerGidMatch = raw.match(/^gid:\/\/shopify\/Customer\/(\d+)$/);
  if (customerGidMatch?.[1]) {
    return customerGidMatch[1];
  }

  return raw;
}
