"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "Notion Templates" },
  { href: "/automations", label: "AI Automations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type TopbarClientProps = {
  hasCustomerSession: boolean;
  cartQuantity: number;
};

export default function TopbarClient({
  hasCustomerSession,
  cartQuantity,
}: TopbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`topbar-shell ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="topbar">
        <Link href="/" className="topbar-brand" aria-label="Noricraft home">
          <Image src="/logo.svg" alt="Noricraft logo" width={116} height={28} priority />
        </Link>

        <nav className="topbar-nav" aria-label="Primary navigation">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} href={item.href} className="topbar-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="topbar-actions">
          <Link href={hasCustomerSession ? "/account" : "/login"} className="topbar-signin">
            {hasCustomerSession ? "Account" : "Sign in"}
          </Link>

          <Link href="/cart" className="topbar-cart-placeholder" aria-label="Open cart">
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 5H5L7.2 14.5C7.32 15.03 7.79 15.4 8.33 15.4H17.8C18.32 15.4 18.77 15.06 18.92 14.56L20.6 8.8C20.82 8.05 20.26 7.3 19.48 7.3H6.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="19" r="1.5" fill="currentColor" />
              <circle cx="17" cy="19" r="1.5" fill="currentColor" />
            </svg>
            {cartQuantity > 0 ? (
              <span className="topbar-cart-badge" aria-hidden="true">
                {cartQuantity > 99 ? "99+" : cartQuantity}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
