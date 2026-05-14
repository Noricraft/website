import Link from "next/link";

type MoneyV2 = {
  amount?: string | null;
  currencyCode?: string | null;
};

type ProductCardImage = {
  url?: string | null;
  altText?: string | null;
};

export type ProductCardItem = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: ProductCardImage | null;
  priceRange?: {
    minVariantPrice?: MoneyV2 | null;
  } | null;
};

type ProductCardProps = {
  product: ProductCardItem;
  hrefBase?: string;
  titleTag?: "h2" | "h3";
  formatMoney: (money?: MoneyV2 | null) => string;
  maxWidthClassName?: string;
  linkClassName?: string;
  titleClassName?: string;
};

export default function ProductCard({
  product,
  hrefBase = "/shop",
  titleTag = "h2",
  formatMoney,
  maxWidthClassName = "max-w-[220px]",
  linkClassName = "",
  titleClassName = "",
}: ProductCardProps) {
  const TitleTag = titleTag;
  const price = formatMoney(product.priceRange?.minVariantPrice);

  return (
    <Link
      href={`${hrefBase}/${product.handle}`}
      className={`group w-full ${maxWidthClassName} mx-auto overflow-hidden bg-white border border-black/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 no-underline ${linkClassName}`}
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
            <div className="h-full w-full grid place-items-center text-sm text-black/60" aria-hidden="true">
              No image
            </div>
          )}
        </div>

        <div className="pt-3 text-center">
          <TitleTag className={`m-0 text-[1.2rem] font-semibold leading-snug text-black line-clamp-2 ${titleClassName}`}>
            {product.title}
          </TitleTag>
          <p className="m-0 mt-[0.15rem] text-sm font-bold text-[#15803d]">{price}</p>
        </div>
      </div>
    </Link>
  );
}
