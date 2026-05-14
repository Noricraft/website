import Image from "next/image";
import Link from "next/link";
import DesktopDemo from "../components/DesktopDemo";
import { shopifyFetch } from "../lib/shopify";
import {
  SHOP_PRODUCTS_QUERY,
} from "../lib/shopify-queries";

const FEATURES = [
  {
    title: "Notion Templates",
    description:
      "Structured workspaces for planning, content, finance, and daily execution.",
  },
  {
    title: "AI Automations",
    description:
      "Custom workflows that connect your tools and remove repetitive manual tasks.",
  },
  {
    title: "Setup & Onboarding",
    description:
      "Hands-on implementation so your team can adopt systems quickly and confidently.",
  },
  {
    title: "Support",
    description:
      "Ongoing optimization, troubleshooting, and iteration as your operations grow.",
  },
];

type MoneyV2 = {
  amount?: string | null;
  currencyCode?: string | null;
};

type FeaturedProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    url?: string | null;
    altText?: string | null;
  } | null;
  priceRange?: {
    minVariantPrice?: MoneyV2 | null;
  } | null;
};

type FeaturedEdges = Array<{
  node?: FeaturedProduct | null;
} | null>;

type ProductsListResponse = {
  products?: {
    edges?: FeaturedEdges | null;
  } | null;
};

function mapProducts(edges?: FeaturedEdges | null): FeaturedProduct[] {
  return (
    edges
      ?.map((edge) => edge?.node)
      .filter((node): node is FeaturedProduct => Boolean(node?.handle)) ?? []
  );
}

function formatMoney(money?: MoneyV2 | null): string {
  const amount = Number(money?.amount ?? "0");
  const currency = money?.currencyCode || "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export default async function Home() {
  const latestProductsResponse = await shopifyFetch<ProductsListResponse>({
    query: SHOP_PRODUCTS_QUERY,
    variables: { first: 4 },
  });
  const featuredProducts = mapProducts(latestProductsResponse.products?.edges).slice(0, 4);

  return (
    <main className="home-page" style={{ width: "100%", maxWidth: "none" }}>
      <section className="py-10 md:py-14 overflow-x-clip" aria-labelledby="hero-title">
        <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6 xl:max-w-[1320px]">
          <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-6">
            <div className="mx-auto w-full max-w-[1520px]">
              <div className="hero relative w-full overflow-hidden">
                <div className="hero-grid md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center">
                  <div className="hero-copy">
                    <h1 id="hero-title">Build smarter operations with Notion and AI.</h1>
                    <p className="lead">
                      We design digital products and automation services for teams that want
                      clarity, speed, and reliable execution.
                    </p>
                    <div className="hero-actions">
                      <Link href="/shop" className="button primary">
                        Browse templates
                      </Link>
                      <a href="#contact" className="button ghost">
                        Tell us what you need
                      </a>
                    </div>
                    <div className="hero-proof">
                      <Image src="/logo.svg" alt="" aria-hidden="true" width={18} height={18} />
                      <span>Drag the windows to explore the demo workspace.</span>
                    </div>
                  </div>

                  <div className="relative mt-8 md:mt-0 md:-ml-4 lg:-ml-8">
                    <DesktopDemo />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6 xl:max-w-[1320px]">
        <section aria-labelledby="what-we-do-title">
          <div className="section-head">
            <h2 id="what-we-do-title">Practical systems for modern teams.</h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="automation-title">
          <div className="section-head">
            <h2 id="automation-title">From idea to workflow in clear steps.</h2>
            <p>
              We map the process, connect the stack, and deploy clean automations
              your team can actually maintain.
            </p>
          </div>
          <div className="automation-placeholder" role="img" aria-label="Future SVG animation area">
            <span>SVG animation placeholder</span>
          </div>
        </section>

        <section aria-labelledby="featured-title">
          <div className="section-head">
            <h2 id="featured-title">Best starters for fast implementation.</h2>
          </div>
          {featuredProducts.length === 0 ? (
            <p>No featured products are available right now.</p>
          ) : (
            <>
              <div className="product-grid">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.handle}`}
                    className="group w-full max-w-[220px] mx-auto overflow-hidden bg-white border border-black/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 no-underline"
                    style={{ borderRadius: "20px" }}
                  >
                    <div className="p-2">
                      <div
                        className="relative w-full aspect-square overflow-hidden bg-black/5"
                        style={{ borderRadius: "20px" }}
                      >
                        {product.featuredImage?.url ? (
                          <img
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div
                            className="h-full w-full grid place-items-center text-sm text-black/60"
                            aria-hidden="true"
                          >
                            No image
                          </div>
                        )}
                      </div>

                      <div className="pt-3 text-center">
                        <h3 className="featured-product-title font-semibold text-black leading-snug line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="featured-product-price text-sm text-black/70">
                          {formatMoney(product.priceRange?.minVariantPrice)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="product-actions">
                <Link href="/shop" className="button ghost">
                  View all products
                </Link>
              </div>
            </>
          )}
        </section>

        <section aria-labelledby="about-title">
          <div className="section-head">
            <h2 id="about-title">Small team, high-leverage delivery.</h2>
            <p>
              Noricraft helps founders and operators turn scattered tools into one
              calm, scalable operating system built around Notion and AI.
            </p>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title">
          <div className="section-head">
            <h2 id="contact-title">Tell us what you want to automate.</h2>
            <p>
              Email us at{" "}
              <a href="mailto:hello@noricraft.com">hello@noricraft.com</a> or use
              the form below.
            </p>
          </div>

          <form className="contact-form" method="post" action="#">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" autoComplete="name" placeholder="Your name" />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
            />

            <label htmlFor="message">Project brief</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Describe your current workflow and your goal."
            />

            <button type="submit" className="button primary">
              Send request
            </button>
          </form>
        </section>
      </div>

      <style>{`
        .home-page {
          display: grid;
          gap: clamp(2rem, 5vw, 4rem);
          padding-bottom: clamp(2rem, 5vw, 4rem);
        }

        .section-head p {
          max-width: 64ch;
        }

        .hero {
          border: 1px solid #e6e6e6;
          border-radius: 20px;
          padding: clamp(1.25rem, 3vw, 2.25rem);
          background:
            linear-gradient(180deg, #ffffff, #fbfbfb),
            radial-gradient(circle at 15% -20%, #f3f3f3, transparent 50%);
        }

        h1 {
          margin: 0;
          max-width: 11.5ch;
          font-size: clamp(2rem, 5.6vw, 3.9rem);
          letter-spacing: -0.045em;
          line-height: 0.96;
        }

        h2 {
          margin: 0 0 0.7rem;
        }

        .lead {
          max-width: 52ch;
          margin: 1rem 0 0;
          font-size: 0.95rem;
          color: #2f2f2f;
        }

        .hero-actions {
          margin-top: 1.4rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
        }

        .hero-proof {
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          border: 1px solid #e1e1e1;
          border-radius: 999px;
          padding: 0.45rem 0.75rem;
          background: rgba(255, 255, 255, 0.78);
          color: #4a4a4a;
          font-size: 0.82rem;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid #111111;
          padding: 0.57rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition:
            transform 180ms ease,
            background-color 180ms ease,
            color 180ms ease;
        }

        .button.primary {
          background: #111111;
          color: #ffffff;
        }

        .button.primary:hover {
          background: #000000;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .button.ghost {
          background: #ffffff;
          color: #111111;
          border-color: #d5d5d5;
        }

        .button.ghost:hover {
          background: #f7f7f7;
        }

        .feature-grid {
          display: grid;
          gap: 0.8rem;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .feature-card {
          border: 1px solid #e8e8e8;
          border-radius: 14px;
          padding: 1rem;
          background: #ffffff;
        }

        .feature-card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.04rem;
          letter-spacing: -0.02em;
        }

        .feature-card p {
          margin: 0;
          color: #434343;
          font-size: 0.95rem;
          line-height: 1.55;
        }

        .automation-placeholder {
          min-height: clamp(180px, 26vw, 260px);
          border: 1px dashed #cecece;
          border-radius: 16px;
          background:
            repeating-linear-gradient(
              -45deg,
              #ffffff,
              #ffffff 12px,
              #fafafa 12px,
              #fafafa 24px
            );
          display: grid;
          place-items: center;
          margin-top: 0.9rem;
        }

        .automation-placeholder span {
          font-size: 0.9rem;
          color: #696969;
          border: 1px solid #d7d7d7;
          border-radius: 999px;
          padding: 0.35rem 0.7rem;
          background: #ffffff;
        }

        .product-grid {
          display: grid;
          margin-top: 1.5rem;
          width: 100%;
          gap: 1.5rem;
          justify-items: center;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .product-grid a,
        .product-grid a:hover,
        .product-grid a:visited {
          text-decoration: none;
        }

        .featured-product-title {
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.3;
        }

        .featured-product-price {
          margin: 0.15rem 0 0;
          color: #15803d;
          font-weight: 700;
        }

        .product-actions {
          margin-top: 1.8rem;
          display: flex;
          justify-content: center;
        }

        .product-card {
          border: 1px solid #e8e8e8;
          border-radius: 14px;
          overflow: clip;
          background: #ffffff;
        }

        .product-image-link {
          display: block;
          aspect-ratio: 4 / 3;
          background: #fafafa;
        }

        .product-image-link img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-image-fallback {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          font-size: 0.85rem;
          color: #676767;
          background: repeating-linear-gradient(
            -45deg,
            #fbfbfb,
            #fbfbfb 10px,
            #f3f3f3 10px,
            #f3f3f3 20px
          );
        }

        .product-card-body {
          padding: 0.85rem;
          display: grid;
          gap: 0.45rem;
        }

        .product-card h3 {
          margin: 0;
          font-size: 1.05rem;
          letter-spacing: -0.02em;
        }

        .product-price {
          margin: 0;
          font-size: 0.95rem;
          color: #2f2f2f;
        }

        .product-link {
          width: fit-content;
          border-radius: 999px;
          border: 1px solid #d8d8d8;
          padding: 0.3rem 0.65rem;
          text-decoration: none;
          font-size: 0.82rem;
          line-height: 1.2;
        }

        .product-link:hover {
          background: #f5f5f5;
        }

        .contact-form {
          margin-top: 0.8rem;
          display: grid;
          gap: 0.55rem;
          max-width: 640px;
        }

        .contact-form label {
          font-size: 0.85rem;
          color: #4f4f4f;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          border: 1px solid #d7d7d7;
          border-radius: 12px;
          background: #ffffff;
          color: #111111;
          font: inherit;
          padding: 0.64rem 0.72rem;
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 128px;
        }

        .contact-form button {
          margin-top: 0.2rem;
          width: fit-content;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .feature-grid,
          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .feature-grid,
          .product-grid {
            grid-template-columns: 1fr;
          }

          .hero-actions {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
