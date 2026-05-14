import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  buildCustomerAccountAuthorizeUrl,
  getCustomerAccountConfig,
  resolveCustomerAccountRedirectFromHeaders,
} from "../../lib/shopify-customer-account";

const PKCE_COOKIE_NAME = "noricraft_pkce_verifier";
const STATE_COOKIE_NAME = "noricraft_oauth_state";
const ACCESS_TOKEN_COOKIE_NAME = "customer_access_token";
const PKCE_TTL_SECONDS = 60 * 10;
export const runtime = "nodejs";

function toBase64Url(value: Buffer): string {
  return value
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createCodeVerifier(): string {
  return toBase64Url(randomBytes(64));
}

function createCodeChallenge(codeVerifier: string): string {
  const hash = createHash("sha256").update(codeVerifier).digest();
  return toBase64Url(hash);
}

function createRandomState(): string {
  return toBase64Url(randomBytes(32));
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const redirectContext = resolveCustomerAccountRedirectFromHeaders(
    request.headers,
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI_LOCAL
  );
  const { proto, host, baseUrl, redirectUri, isHttps } = redirectContext;

  console.info("[login] redirect context", {
    proto,
    host,
    baseUrl,
    redirectUri,
    usedFallback: redirectContext.usedFallback,
  });

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value?.trim() || "";
  const alreadyAuthenticated = Boolean(accessToken);

  console.info(`[login] alreadyAuthenticated: ${alreadyAuthenticated}`);

  if (alreadyAuthenticated) {
    return NextResponse.redirect(new URL("/account", baseUrl));
  }

  try {
    const config = getCustomerAccountConfig();

    if (!config.storeDomain) {
      throw new Error("Missing SHOPIFY_STORE_DOMAIN env");
    }
    if (!config.clientId) {
      throw new Error("Missing SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID env");
    }

    const codeVerifier = createCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);
    const state = createRandomState();
    const nonce = createRandomState();

    console.info("[login] customer auth init", {
      storeDomain: config.storeDomain,
      clientIdPresent: Boolean(config.clientId),
      proto,
      host,
      baseUrl,
      redirectUri,
      pkceGenerated: Boolean(codeVerifier && codeChallenge),
      usedFallback: redirectContext.usedFallback,
    });
    console.info(`[login] redirectUri: ${redirectUri}`);

    const authorizeUrl = await buildCustomerAccountAuthorizeUrl({
      state,
      nonce,
      codeChallenge,
      redirectUri,
    });

    const response = NextResponse.redirect(authorizeUrl);
    const secure = isHttps;
    const cookieOptions = {
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/",
      maxAge: PKCE_TTL_SECONDS,
    };

    response.cookies.set(PKCE_COOKIE_NAME, codeVerifier, cookieOptions);
    response.cookies.set(STATE_COOKIE_NAME, state, cookieOptions);
    console.info("[login] cookies set", {
      cookieNames: [PKCE_COOKIE_NAME, STATE_COOKIE_NAME],
      secure,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("[login] failed to initialize customer auth", error);
    throw error;
  }
}

