import Link from "next/link";
import { getCustomerAccessToken } from "../../lib/auth-session";
import { redirect } from "next/navigation";
import { getCustomerProfile } from "../../lib/customer-account";

const ACCOUNT_LINKS = [
  { href: "/account/orders", label: "Orders" },
  { href: "/account?tab=profile", label: "Profile" },
  { href: "/account/downloads", label: "Downloads" },
];

type AccountPageProps = {
  searchParams?: Promise<{
    auth_error?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const authError = resolvedSearchParams?.auth_error;
  const accessToken = await getCustomerAccessToken();

  if (!accessToken) {
    if (authError) {
      return (
        <section aria-labelledby="account-auth-error-title" className="space-y-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <h1 id="account-auth-error-title" className="text-xl font-semibold tracking-tight text-red-900">
              Sign-in failed
            </h1>
            <p className="mt-2 text-sm text-red-800">
              We could not complete your login ({authError}). Please try signing in again.
            </p>
            <div className="mt-4">
              <Link
                href="/login"
                className="inline-flex h-11 items-center rounded-full border border-red-300 px-5 text-sm font-medium text-red-900 no-underline transition hover:bg-red-100"
              >
                Try sign in again
              </Link>
            </div>
          </div>
        </section>
      );
    }
    redirect("/login");
  }

  let customer:
    | {
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
      }
    | null = null;

  try {
    customer = await getCustomerProfile(accessToken);
  } catch {
    customer = null;
  }

  const firstName = customer?.firstName?.trim() || "";
  const lastName = customer?.lastName?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const email = customer?.email?.trim() || "";
  const greetingName = fullName || email || "there";
  const hasProfile = Boolean(customer);

  return (
    <section aria-labelledby="account-dashboard-title" className="space-y-6">
      {authError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Login warning: {authError}
        </div>
      ) : null}

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 id="account-dashboard-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {hasProfile ? `Hello, ${greetingName}` : "Logged in"}
        </h1>
        {hasProfile ? (
          email ? <p className="mt-2 text-sm text-black/60">{email}</p> : null
        ) : (
          <p className="mt-2 text-sm text-black/60">
            We could not load your customer profile yet.{" "}
            <Link href="/account" className="underline-offset-2">
              Retry
            </Link>
            .
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-black/70">Dashboard</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {ACCOUNT_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium no-underline transition hover:border-black/30 hover:bg-black/5"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
