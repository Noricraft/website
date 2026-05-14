import "server-only";

type CustomerAccountOAuthDiscovery = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
  jwks_uri?: string;
};

type CustomerAccountApiDiscovery = {
  graphql_api?: string;
};

type CustomerAccountTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
  error_description?: string;
};

export type CustomerAccountConfig = {
  storeDomain: string;
  clientId: string;
  clientSecret?: string;
  apiVersion: string;
  redirectUri: string;
  redirectUriLocal?: string;
  redirectUriProd?: string;
};

type BuildAuthorizeUrlParams = {
  state: string;
  nonce: string;
  codeChallenge: string;
  redirectUri?: string;
  scope?: string;
};

type ExchangeCodeParams = {
  code: string;
  codeVerifier: string;
  redirectUri?: string;
};

type CustomerAccountFetchParams = {
  accessToken: string;
  query: string;
  variables?: Record<string, unknown>;
};

type CustomerAccountGraphQLError = {
  message?: string;
  [key: string]: unknown;
};

type CustomerAccountGraphQLResponse<T> = {
  data?: T;
  errors?: CustomerAccountGraphQLError[];
};

export type CustomerAccountRedirectContext = {
  proto: string;
  host: string;
  baseUrl: string;
  redirectUri: string;
  isHttps: boolean;
  usedFallback: boolean;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Brak zmiennej ENV: ${name}. Sprawdz .env.local i zrestartuj npm run dev.`
    );
  }
  return value.trim();
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeStoreDomain(value: string): string {
  return value
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .trim();
}

function normalizeHeaderValue(value: string | null): string {
  return value?.split(",")[0]?.trim() || "";
}

export function getCustomerAccountConfig(): CustomerAccountConfig {
  const storeDomain =
    optionalEnv("SHOPIFY_STORE_DOMAIN") || requiredEnv("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN");
  const redirectUri = optionalEnv("SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI") || "";
  const redirectUriLocal = optionalEnv("SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI_LOCAL");
  const redirectUriProd = optionalEnv("SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI_PROD");

  return {
    storeDomain: normalizeStoreDomain(storeDomain),
    clientId: requiredEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID"),
    clientSecret: optionalEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET"),
    apiVersion: (optionalEnv("SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION") || "2026-01").trim(),
    redirectUri,
    redirectUriLocal,
    redirectUriProd,
  };
}

export function ensureCallbackUrl(url: string): string {
  const rawUrl = url.trim();
  if (!rawUrl) {
    throw new Error("Missing SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI env");
  }

  const normalizedUrl = /^[a-z][a-z\d+\-.]*:\/\//i.test(rawUrl)
    ? rawUrl
    : `https://${rawUrl}`;

  let parsed: URL;
  try {
    parsed = new URL(normalizedUrl);
  } catch {
    throw new Error(
      "Invalid SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI. Expected full URL, e.g. https://example.com/auth/callback"
    );
  }

  if (parsed.pathname.includes("/auth/callback")) {
    return parsed.toString();
  }

  const basePath = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "");
  parsed.pathname = `${basePath}/auth/callback`;
  return parsed.toString();
}

export function resolveCustomerAccountRedirectFromHeaders(
  headers: Headers,
  fallbackRedirectUri?: string
): CustomerAccountRedirectContext {
  let proto = normalizeHeaderValue(headers.get("x-forwarded-proto")) || "http";
  const host =
    normalizeHeaderValue(headers.get("x-forwarded-host")) ||
    normalizeHeaderValue(headers.get("host"));

  if (host) {
    const hostLower = host.toLowerCase();
    if (proto === "https" && (hostLower.includes("localhost") || hostLower.startsWith("127.0.0.1"))) {
      proto = "http";
    }

    const baseUrl = `${proto}://${host}`;
    return {
      proto,
      host,
      baseUrl,
      redirectUri: `${baseUrl}/auth/callback`,
      isHttps: proto === "https",
      usedFallback: false,
    };
  }

  const fallback = fallbackRedirectUri?.trim() || "";
  if (!fallback) {
    throw new Error(
      "Unable to resolve redirectUri from request headers. Missing host headers and SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI_LOCAL fallback."
    );
  }

  const callbackUri = ensureCallbackUrl(fallback);
  const parsed = new URL(callbackUri);
  let fallbackProto = parsed.protocol.replace(":", "");
  const fallbackHost = parsed.host;
  const fallbackHostLower = fallbackHost.toLowerCase();
  if (
    fallbackProto === "https" &&
    (fallbackHostLower.includes("localhost") || fallbackHostLower.startsWith("127.0.0.1"))
  ) {
    fallbackProto = "http";
  }
  const fallbackBaseUrl = `${fallbackProto}://${fallbackHost}`;
  const fallbackCallbackUri = `${fallbackBaseUrl}/auth/callback`;

  return {
    proto: fallbackProto || "https",
    host: fallbackHost,
    baseUrl: fallbackBaseUrl,
    redirectUri: fallbackCallbackUri,
    isHttps: (fallbackProto || "").toLowerCase() === "https",
    usedFallback: true,
  };
}

export function getCustomerAccountRedirectUri(): string {
  const config = getCustomerAccountConfig();
  if (config.redirectUri) {
    return ensureCallbackUrl(config.redirectUri);
  }

  const envRedirectUri =
    process.env.NODE_ENV === "production"
      ? config.redirectUriProd || ""
      : config.redirectUriLocal || "";

  return ensureCallbackUrl(envRedirectUri);
}

export function buildCustomerAccountDiscoveryUrl(storeDomain?: string): string {
  const config = getCustomerAccountConfig();
  const domain = normalizeStoreDomain(storeDomain || config.storeDomain);
  return `https://${domain}/.well-known/openid-configuration`;
}

export function buildCustomerAccountApiDiscoveryUrl(storeDomain?: string): string {
  const config = getCustomerAccountConfig();
  const domain = normalizeStoreDomain(storeDomain || config.storeDomain);
  return `https://${domain}/.well-known/customer-account-api`;
}

export async function fetchCustomerAccountOAuthDiscovery(
  storeDomain?: string
): Promise<CustomerAccountOAuthDiscovery> {
  const discoveryUrl = buildCustomerAccountDiscoveryUrl(storeDomain);
  const response = await fetch(discoveryUrl, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Customer Account discovery request failed: ${response.status} ${response.statusText}`
    );
  }

  const discovery = (await response.json()) as CustomerAccountOAuthDiscovery;
  if (!discovery.authorization_endpoint || !discovery.token_endpoint) {
    throw new Error(
      "Customer Account discovery response is missing OAuth endpoints."
    );
  }

  return discovery;
}

export async function fetchCustomerAccountApiDiscovery(
  storeDomain?: string
): Promise<CustomerAccountApiDiscovery> {
  const discoveryUrl = buildCustomerAccountApiDiscoveryUrl(storeDomain);
  const response = await fetch(discoveryUrl, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Customer Account API discovery request failed: ${response.status} ${response.statusText}`
    );
  }

  const discovery = (await response.json()) as CustomerAccountApiDiscovery;
  if (!discovery.graphql_api) {
    throw new Error("Customer Account API discovery is missing graphql_api.");
  }

  return discovery;
}

function resolveCustomerAccountGraphqlEndpoint(
  discoveryGraphqlApi: string,
  apiVersion: string
): string {
  const match = discoveryGraphqlApi.match(/\/customer\/api\/[^/]+\/graphql$/);
  if (!match) {
    return discoveryGraphqlApi;
  }

  return discoveryGraphqlApi.replace(
    /\/customer\/api\/[^/]+\/graphql$/,
    `/customer/api/${apiVersion}/graphql`
  );
}

export async function getCustomerAccountGraphqlEndpoint(
  storeDomain?: string
): Promise<string> {
  const config = getCustomerAccountConfig();
  const discovery = await fetchCustomerAccountApiDiscovery(storeDomain || config.storeDomain);
  return resolveCustomerAccountGraphqlEndpoint(
    discovery.graphql_api || "",
    config.apiVersion
  );
}

export async function buildCustomerAccountAuthorizeUrl({
  state,
  nonce,
  codeChallenge,
  redirectUri,
  scope = "openid email customer-account-api:full",
}: BuildAuthorizeUrlParams): Promise<string> {
  const config = getCustomerAccountConfig();
  const discovery = await fetchCustomerAccountOAuthDiscovery(config.storeDomain);
  const callbackUri = ensureCallbackUrl(redirectUri || getCustomerAccountRedirectUri());

  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: callbackUri,
    scope,
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${discovery.authorization_endpoint}?${params.toString()}`;
}

export async function exchangeCustomerAccountCodeForToken({
  code,
  codeVerifier,
  redirectUri,
}: ExchangeCodeParams): Promise<CustomerAccountTokenResponse> {
  const config = getCustomerAccountConfig();
  const discovery = await fetchCustomerAccountOAuthDiscovery(config.storeDomain);
  const callbackUri = ensureCallbackUrl(redirectUri || getCustomerAccountRedirectUri());

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    redirect_uri: callbackUri,
    code,
    code_verifier: codeVerifier,
  });

  if (config.clientSecret) {
    params.set("client_secret", config.clientSecret);
  }

  const response = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params.toString(),
    cache: "no-store",
  });

  const json = (await response.json()) as CustomerAccountTokenResponse;
  if (!response.ok || json.error) {
    throw new Error(
      JSON.stringify(
        {
          status: response.status,
          statusText: response.statusText,
          url: discovery.token_endpoint,
          error: json.error || "token_exchange_failed",
          errorDescription: json.error_description || null,
        },
        null,
        2
      )
    );
  }

  return json;
}

export async function customerAccountFetch<T>({
  accessToken,
  query,
  variables,
}: CustomerAccountFetchParams): Promise<T> {
  const endpoint = await getCustomerAccountGraphqlEndpoint();
  const authorization = accessToken.trim().replace(/^Bearer\s+/i, "");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = (await response.json()) as CustomerAccountGraphQLResponse<T>;
  if (!response.ok || (json.errors && json.errors.length > 0) || !json.data) {
    throw new Error(
      JSON.stringify(
        {
          status: response.status,
          statusText: response.statusText,
          endpoint,
          errors: json.errors || null,
        },
        null,
        2
      )
    );
  }

  return json.data;
}

type CustomerAccountCustomer = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: {
    emailAddress?: string | null;
  } | null;
};

type CustomerAccountCustomerQueryResponse = {
  customer?: CustomerAccountCustomer | null;
};

const CUSTOMER_ACCOUNT_CUSTOMER_QUERY = `
  query CustomerAccountCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

export async function fetchCustomerAccountCustomer(
  accessToken: string
): Promise<CustomerAccountCustomer | null> {
  const data = await customerAccountFetch<CustomerAccountCustomerQueryResponse>({
    accessToken,
    query: CUSTOMER_ACCOUNT_CUSTOMER_QUERY,
  });

  return data.customer ?? null;
}
