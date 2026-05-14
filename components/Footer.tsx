import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

const batangas = localFont({
  src: "../public/fonts/Batangas Bold 700.otf",
  weight: "700",
  style: "normal",
  display: "swap",
});

const NAV_LINKS = [
  { href: "/shop", label: "Notion Templates" },
  { href: "/automations", label: "AI Automations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/people/Noricraft-Studio/61587904087831/",
    label: "Noricraft on Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
        <path d="M13.5 21V12.8H16l.4-3h-2.9V7.9c0-.9.2-1.5 1.5-1.5h1.6V3.7c-.3 0-1.2-.1-2.3-.1-2.2 0-3.8 1.3-3.8 3.9v2.2H8v3h2.5V21h3z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/noricraft_studio",
    label: "Noricraft on Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="16" height="16">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://x.com/noricraftstudio?s=21",
    label: "Noricraft on X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
        <path d="M18.8 4h-2.7l-3.5 4.1L9.4 4H4.5l5.6 7.5L4 20h2.7l4.1-4.8 3.8 4.8h4.9l-5.8-7.8L18.8 4zm-3.1 14h-1.5L8.3 6h1.5l5.9 12z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@noricraft.studio",
    label: "Noricraft on TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
        <path d="M14.5 4v9.1a3.5 3.5 0 1 1-3-3.4V7.3a6 6 0 1 0 5.5 6V9.5c1 .8 2.3 1.2 3.6 1.2V8.2c-2.2 0-4-1.8-4-4h-2.1z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@Noricraft-studio",
    label: "Noricraft on YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="16" height="16">
        <rect x="3" y="6.2" width="18" height="11.6" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 9.4v5.2l4.8-2.6L10 9.4z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-10 md:px-6 xl:max-w-[1320px]">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-3">
            <Link href="/" aria-label="Noricraft home" className="inline-flex no-underline">
              <Image src="/logo.svg" alt="Noricraft logo" width={116} height={28} />
            </Link>
            <p className={`${batangas.className} text-sm text-black/60`}>
              Digital products & automation systems for modern teams.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-black/50">Navigate</p>
            <ul className="space-y-2 text-black/75">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-[0.85rem] font-medium leading-none no-underline hover:text-black"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-black/50">Follow</p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition hover:border-black/30 hover:bg-black/5"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4 text-black/70">
              <Link
                href="/terms"
                className="font-sans text-[0.85rem] font-medium leading-none no-underline hover:text-black"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="font-sans text-[0.85rem] font-medium leading-none no-underline hover:text-black"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-4 md:px-6 xl:max-w-[1320px]">
          <p className="text-xs text-black/50">&copy; {currentYear} Noricraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
