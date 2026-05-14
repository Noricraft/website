import Link from "next/link";

const ACCOUNT_SUBNAV = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account?tab=profile", label: "Profile" },
  { href: "/account/downloads", label: "Downloads" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full max-w-none py-10 md:py-14">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 xl:max-w-[1320px]">
        <nav aria-label="Account navigation" className="mb-6 flex flex-wrap gap-2">
          {ACCOUNT_SUBNAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/75 no-underline transition hover:border-black/30 hover:bg-black/5 hover:text-black"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/logout"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/75 no-underline transition hover:border-black/30 hover:bg-black/5 hover:text-black"
          >
            Log out
          </Link>
        </nav>

        {children}
      </div>
    </main>
  );
}
