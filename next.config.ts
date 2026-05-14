import type { NextConfig } from "next";

function normalizeOrigin(value?: string): string {
  const raw = value?.trim();
  if (!raw) {
    return "";
  }

  const normalized = /^[a-z][a-z\d+\-.]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(normalized).origin;
  } catch {
    return "";
  }
}

function getDevAllowedOrigins(): string[] {
  const origins = new Set<string>(["https://*.trycloudflare.com", "*.trycloudflare.com"]);

  const fromEnv = [
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI,
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI_LOCAL,
    process.env.DEV_TUNNEL_ORIGIN,
  ];

  fromEnv.forEach((candidate) => {
    const origin = normalizeOrigin(candidate);
    if (origin) {
      origins.add(origin);
    }
  });

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "development"
    ? {
        allowedDevOrigins: getDevAllowedOrigins(),
      }
    : {}),
};

export default nextConfig;
