import Link from "next/link";
import { shopifyFetch } from "../../lib/shopify";
import { SHOP_PRODUCTS_QUERY } from "../../lib/shopify-queries";

type MoneyV2 = {
  amount?: string | null;
  currencyCode?: string | null;
};

type ProductCard = {
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

type ShopProductsResponse = {
  products?: {
    edges?: Array<{
      node?: ProductCard | null;
    } | null> | null;
  } | null;
};

function formatMoney(money?: MoneyV2 | null): string {
  const amountValue = Number(money?.amount ?? "0");
  const currencyCode = money?.currencyCode ?? "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amountValue) ? amountValue : 0);
}

export default async function ShopPage() {
  const data = await shopifyFetch<ShopProductsResponse>({
    query: SHOP_PRODUCTS_QUERY,
    variables: { first: 12 },
  });

  const products =
    data.products?.edges
      ?.map((edge) => edge?.node)
      .filter((node): node is ProductCard => Boolean(node && node.handle)) ?? [];

  return (
    <main>
      <section aria-labelledby="shop-title">
        <h1 id="shop-title">Template Library</h1>
        <p>
          Explore our latest Notion products. Each template is built for clear
          workflows and fast implementation.
        </p>
      </section>

      <section aria-label="Products">
        {products.length === 0 ? (
          <p>No products available right now. Please check back soon.</p>
        ) : (
          <div className="shop-grid">
            {products.map((product) => (
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
                    <h2 className="shop-product-title font-semibold text-black leading-snug line-clamp-2">
                      {product.title}
                    </h2>
                    <p className="shop-product-price text-sm text-black/70">
                      {formatMoney(product.priceRange?.minVariantPrice)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          width: 100%;
          gap: 1.5rem;
          justify-items: center;
        }

        .shop-grid a,
        .shop-grid a:hover,
        .shop-grid a:visited {
          text-decoration: none;
        }

        .shop-product-title {
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.3;
        }

        .shop-product-price {
          margin: 0.15rem 0 0;
          color: #15803d;
          font-weight: 700;
        }

        .shop-card {
          border: 1px solid #e6e6e6;
          border-radius: 14px;
          overflow: clip;
          background: #ffffff;
        }

        .shop-image-link {
          display: block;
          aspect-ratio: 4 / 3;
          background: #fafafa;
        }

        .shop-image-link img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .shop-image-fallback {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          font-size: 0.85rem;
          color: #666666;
          background: repeating-linear-gradient(
            -45deg,
            #fbfbfb,
            #fbfbfb 10px,
            #f3f3f3 10px,
            #f3f3f3 20px
          );
        }

        .shop-card-body {
          padding: 0.8rem;
          display: grid;
          gap: 0.35rem;
        }

        .shop-card-body h2 {
          margin: 0;
          font-size: 1.02rem;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }

        .price {
          margin: 0;
          color: #4f4f4f;
          font-size: 0.9rem;
        }

        .details-link {
          width: fit-content;
          border: 1px solid #d8d8d8;
          border-radius: 999px;
          padding: 0.3rem 0.62rem;
          text-decoration: none;
          font-size: 0.82rem;
        }

        @media (max-width: 1024px) {
          .shop-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .shop-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
