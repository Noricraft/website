import "server-only";

type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
};

type ShopifyError = {
  message?: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type ShopifyGraphQLResponse<T> = {
  data?: T;
  errors?: ShopifyError[];
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isThrottled<T>(
  json: ShopifyGraphQLResponse<T> | null
): boolean {
  if (!json?.errors?.length) {
    return false;
  }

  return json.errors.some((error) => error.extensions?.code === "THROTTLED");
}

function buildAuthHeaders(token: string): Record<string, string> {
  if (token.startsWith("shpat_")) {
    return {
      "Shopify-Storefront-Private-Token": token,
    };
  }

  return {
    "X-Shopify-Storefront-Access-Token": token,
  };
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache,
}: ShopifyFetchParams): Promise<T> {
  const domain = requiredEnv("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN");
  const token = requiredEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN");
  const apiVersion = (process.env.SHOPIFY_API_VERSION || "2026-01").trim();
  const url = `https://${domain}/api/${apiVersion}/graphql.json`;

  const maxAttempts = 3;
  const body = JSON.stringify({ query, variables });
  const authHeaders = buildAuthHeaders(token);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body,
      ...(cache ? { cache } : {}),
    });

    let json: ShopifyGraphQLResponse<T> | null = null;
    try {
      json = (await res.json()) as ShopifyGraphQLResponse<T>;
    } catch {
      json = null;
    }

    if (isThrottled(json) && attempt < maxAttempts - 1) {
      await sleep(250 * 2 ** attempt);
      continue;
    }

    if (!res.ok || (json?.errors && json.errors.length > 0)) {
      if (res.status === 401) {
        throw new Error(
          JSON.stringify(
            {
              status: res.status,
              url,
              envUsed: {
                NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: domain,
                SHOPIFY_API_VERSION: apiVersion,
                tokenPresent: Boolean(token),
              },
              errors: json?.errors ?? null,
            },
            null,
            2
          )
        );
      }

      throw new Error(
        JSON.stringify(
          {
            status: res.status,
            statusText: res.statusText,
            url,
            tokenPresent: Boolean(token),
            errors: json?.errors ?? null,
          },
          null,
          2
        )
      );
    }

    if (!json?.data) {
      throw new Error(
        JSON.stringify(
          {
            status: res.status,
            statusText: res.statusText,
            url,
            tokenPresent: Boolean(token),
            errors: [{ message: "Missing data field in Shopify response." }],
          },
          null,
          2
        )
      );
    }

    return json.data;
  }

  throw new Error(
    JSON.stringify(
      {
        status: 500,
        statusText: "Unknown",
        message: "shopifyFetch failed after THROTTLED retries",
      },
      null,
      2
    )
  );
}
