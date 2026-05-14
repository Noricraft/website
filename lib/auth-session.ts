import "server-only";

import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE_NAME = "customer_access_token";

export async function getCustomerAccessToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value?.trim() || "";
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getCustomerAccessToken();
  return Boolean(token);
}
