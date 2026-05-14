import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { normalizeShopifyCustomerId } from "../../../../lib/shopify-customer-id";

export const runtime = "nodejs";

type ShopifyCustomerWebhookPayload = {
  id?: string | number | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

const CUSTOMER_TOPICS = new Set(["customers/create", "customers/update"]);

function verifyWebhookHmac(rawBody: string, providedHmac: string, secret: string): boolean {
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const provided = Buffer.from(providedHmac, "utf8");
  const expected = Buffer.from(digest, "utf8");

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}

function normalizeString(value?: string | null): string | null {
  const normalized = value?.trim() || "";
  return normalized || null;
}

function deriveName(payload: ShopifyCustomerWebhookPayload): string | null {
  const firstName = normalizeString(payload.first_name ?? payload.firstName ?? null) || "";
  const lastName = normalizeString(payload.last_name ?? payload.lastName ?? null) || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || null;
}

export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim() || "";
  if (!secret) {
    return NextResponse.json({ ok: false, error: "missing_webhook_secret" }, { status: 500 });
  }

  const topic = request.headers.get("x-shopify-topic")?.trim().toLowerCase() || "";
  const providedHmac = request.headers.get("x-shopify-hmac-sha256")?.trim() || "";
  const rawBody = await request.text();

  if (!providedHmac || !verifyWebhookHmac(rawBody, providedHmac, secret)) {
    return NextResponse.json({ ok: false, error: "invalid_hmac" }, { status: 401 });
  }

  if (!CUSTOMER_TOPICS.has(topic)) {
    return NextResponse.json({ ok: true, ignored: true, topic }, { status: 202 });
  }

  let payload: ShopifyCustomerWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as ShopifyCustomerWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const shopifyCustomerId = normalizeShopifyCustomerId(payload.id);
  if (!shopifyCustomerId) {
    return NextResponse.json({ ok: false, error: "missing_customer_id" }, { status: 400 });
  }

  const email = normalizeString(payload.email);
  const name = deriveName(payload);

  try {
    await prisma.user.upsert({
      where: {
        shopifyCustomerId,
      },
      create: {
        shopifyCustomerId,
        email,
        name,
        lastLoginAt: new Date(),
      },
      update: {
        email,
        name,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "db_upsert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
