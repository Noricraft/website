import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountDownloadsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("customer_access_token")?.value?.trim() || "";

  if (!accessToken) {
    redirect("/login");
  }

  return (
    <section aria-labelledby="account-downloads-title" className="space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 id="account-downloads-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
          Downloads
        </h1>
        <p className="mt-2 text-sm text-black/60">
          Purchased digital products will appear here after webhook processing is connected.
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-black/60">No downloadable products available yet.</p>
      </div>
    </section>
  );
}
