import { NextRequest, NextResponse } from "next/server";
import { getCustomerProfile } from "../../../lib/customer-account";
import prisma from "../../../lib/prisma";
import { normalizeShopifyCustomerId } from "../../../lib/shopify-customer-id";
import {
  exchangeCustomerAccountCodeForToken,
  resolveCustomerAccountRedirectFromHeaders,
} from "../../../lib/shopify-customer-account";

const PKCE_COOKIE_NAME = "noricraft_pkce_verifier";
const STATE_COOKIE_NAME = "noricraft_oauth_state";
const ACCESS_TOKEN_COOKIE_NAME = "customer_access_token";
const REFRESH_TOKEN_COOKIE_NAME = "customer_refresh_token";
const ID_TOKEN_COOKIE_NAME = "customer_id_token";
const ACCESS_TOKEN_FALLBACK_TTL = 60 * 60;
export const runtime = "nodejs";

function deleteCookie(response: NextResponse, name: string, secure: boolean): void {
  response.cookies.set(name, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

function cleanupAuthFlowCookies(response: NextResponse, secure: boolean): void {
  deleteCookie(response, PKCE_COOKIE_NAME, secure);
  deleteCookie(response, STATE_COOKIE_NAME, secure);
}

function redirectToAccountWithError(
  baseUrl: string,
  reason: string,
  secure: boolean
): NextResponse {
  const url = new URL("/account", baseUrl);
  url.searchParams.set("auth_error", reason);
  const response = NextResponse.redirect(url);
  cleanupAuthFlowCookies(response, secure);
  return response;
}

function redirectToLoginWithError(
  baseUrl: string,
  reason: string,
  secure: boolean
): NextResponse {
  const url = new URL("/login", baseUrl);
  url.searchParams.set("error", reason);
  const response = NextResponse.redirect(url);
  cleanupAuthFlowCookies(response, secure);
  deleteCookie(response, ACCESS_TOKEN_COOKIE_NAME, secure);
  deleteCookie(response, REFRESH_TOKEN_COOKIE_NAME, secure);
  deleteCookie(response, ID_TOKEN_COOKIE_NAME, secure);
  return response;
}

function parseStructuredError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as Record<string, unknown>;
      return { message: error.message, ...parsed };
    } catch {
      return { message: error.message };
    }
  }

  if (typeof error === "string") {
    try {
      return JSON.parse(error) as Record<string, unknown>;
    } catch {
      return { message: error };
    }
  }

  return { message: "unknown_error" };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const redirectContext = resolveCustomerAccountRedirectFromHeaders(
    request.headers,
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI_LOCAL
  );
  const { proto, host, baseUrl, redirectUri, isHttps } = redirectContext;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  const codeVerifier = request.cookies.get(PKCE_COOKIE_NAME)?.value || "";
  const expectedState = request.cookies.get(STATE_COOKIE_NAME)?.value || "";

  console.info("[auth/callback] request received", {
    hasCode: Boolean(code),
    hasVerifier: Boolean(codeVerifier),
    hasState: Boolean(state),
    hasExpectedState: Boolean(expectedState),
    oauthError: oauthError || null,
    proto,
    host,
    baseUrl,
    redirectUri,
    usedFallback: redirectContext.usedFallback,
  });

  if (oauthError) {
    return redirectToLoginWithError(baseUrl, oauthError, isHttps);
  }

  if (!codeVerifier || !expectedState) {
    const presentCookieNames = request.cookies.getAll().map((cookie) => cookie.name);
    console.warn("[auth/callback] missing pkce/state cookies", { presentCookieNames });
    return redirectToAccountWithError(baseUrl, "missing_pkce_or_state", isHttps);
  }

  if (!code) {
    return redirectToLoginWithError(baseUrl, "missing_code_or_verifier", isHttps);
  }

  if (!state || state !== expectedState) {
    return redirectToLoginWithError(baseUrl, "invalid_oauth_state", isHttps);
  }

  let tokenResponse: {
    access_token?: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
  };

  try {
    tokenResponse = await exchangeCustomerAccountCodeForToken({
      code,
      codeVerifier,
      redirectUri,
    });
    console.info("[auth/callback] token response status", { status: 200 });
  } catch (error) {
    console.error("[auth/callback] token exchange failed", error);
    return redirectToLoginWithError(baseUrl, "token_exchange_failed", isHttps);
  }

  if (!tokenResponse.access_token) {
    console.error("[auth/callback] missing access token in token response");
    return redirectToLoginWithError(baseUrl, "missing_access_token", isHttps);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[auth/callback] token response keys", Object.keys(tokenResponse || {}));
    console.info("[auth/callback] access_token prefix", {
      present: Boolean(tokenResponse?.access_token),
      prefix: tokenResponse?.access_token?.slice(0, 6) ?? null,
      length: tokenResponse?.access_token?.length ?? 0,
    });
    console.info("[auth/callback] id_token prefix", {
      present: Boolean(tokenResponse?.id_token),
      prefix: tokenResponse?.id_token?.slice(0, 6) ?? null,
    });
  }

  let customerProfile:
    | {
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
      }
    | null = null;

  try {
    customerProfile = await getCustomerProfile(tokenResponse.access_token);
  } catch (error) {
    const details = parseStructuredError(error);
    console.error("[auth/callback] failed to fetch customer profile", {
      status: details.status ?? null,
      statusText: details.statusText ?? null,
      endpoint: details.endpoint ?? null,
      error: details.error ?? details.message ?? "unknown_error",
      errors: details.errors ?? null,
    });
    customerProfile = null;
  }

  if (!customerProfile?.id) {
    console.warn("[auth/callback] customer profile unavailable, continuing login without profile");
  }

  if (customerProfile?.id) {
    const normalizedCustomerId = normalizeShopifyCustomerId(customerProfile.id);
    if (!normalizedCustomerId) {
      console.error("[auth/callback] invalid normalized customer id");
    } else {
      const firstName = customerProfile.firstName?.trim() || "";
      const lastName = customerProfile.lastName?.trim() || "";
      const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
      const normalizedName = fullName || null;
      const normalizedEmail = customerProfile.email?.trim() || null;

      try {
        await prisma.user.upsert({
          where: {
            shopifyCustomerId: normalizedCustomerId,
          },
          create: {
            shopifyCustomerId: normalizedCustomerId,
            email: normalizedEmail,
            name: normalizedName,
            lastLoginAt: new Date(),
          },
          update: {
            email: normalizedEmail,
            name: normalizedName,
            lastLoginAt: new Date(),
          },
        });
      } catch (error) {
        console.error("[auth/callback] db upsert failed", {
          error:
            error instanceof Error
              ? error.message
              : typeof error === "string"
                ? error
                : "unknown_error",
        });
      }
    }
  }

  const response = NextResponse.redirect(new URL("/account", baseUrl));
  const secure = isHttps;

  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokenResponse.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: tokenResponse.expires_in || ACCESS_TOKEN_FALLBACK_TTL,
  });

  if (tokenResponse.refresh_token) {
    response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokenResponse.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  } else {
    deleteCookie(response, REFRESH_TOKEN_COOKIE_NAME, secure);
  }

  if (tokenResponse.id_token) {
    response.cookies.set(ID_TOKEN_COOKIE_NAME, tokenResponse.id_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: tokenResponse.expires_in || ACCESS_TOKEN_FALLBACK_TTL,
    });
  } else {
    deleteCookie(response, ID_TOKEN_COOKIE_NAME, secure);
  }

  cleanupAuthFlowCookies(response, secure);
  return response;
}

