import { NextResponse } from "next/server";

const COOKIES_TO_CLEAR = [
  "customer_access_token",
  "customer_refresh_token",
  "customer_id_token",
  "ca_code_verifier",
  "ca_oauth_state",
  "ca_oauth_nonce",
];

export async function GET(request: Request): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL("/", request.url));
  const secure = process.env.NODE_ENV === "production";

  COOKIES_TO_CLEAR.forEach((name) => {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  });

  return response;
}

