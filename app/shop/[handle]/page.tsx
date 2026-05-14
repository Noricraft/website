import { notFound } from "next/navigation";
import { shopifyFetch } from "../../../lib/shopify";
import {
  SHOP_PRODUCT_BY_HANDLE_QUERY,
  SHOP_RELATED_PRODUCTS_BY_COLLECTION_QUERY,
  SHOP_RELATED_PRODUCTS_BY_SEARCH_QUERY,
} from "../../../lib/shopify-queries";
import ProductCard, { type ProductCardItem } from "../../../components/ProductCard";
import ProductGallery, { type ProductGalleryImage } from "./ProductGallery";
import ProductVariantPicker, {
  type ProductVariantPickerDetailRow,
  type ProductVariantPickerMetafield,
  type ProductVariantPickerOption,
  type ProductVariantPickerVariant,
} from "./ProductVariantPicker";

type MoneyV2 = {
  amount?: string | null;
  currencyCode?: string | null;
};

type ProductImage = {
  id?: string | null;
  url?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductSelectedOption = {
  name?: string | null;
  value?: string | null;
};

type ProductVariant = {
  id?: string | null;
  title?: string | null;
  availableForSale?: boolean | null;
  quantityAvailable?: number | null;
  selectedOptions?: Array<ProductSelectedOption | null> | null;
  price?: MoneyV2 | null;
  compareAtPrice?: MoneyV2 | null;
  image?: ProductImage | null;
};

type ProductOption = {
  id?: string | null;
  name?: string | null;
  values?: Array<string | null> | null;
};

type ProductMetafield = {
  namespace?: string | null;
  key?: string | null;
  type?: string | null;
  value?: string | null;
  description?: string | null;
};

type ProductCollection = {
  handle?: string | null;
  title?: string | null;
};

type RelatedProductCard = {
  id?: string | null;
  handle?: string | null;
  title?: string | null;
  featuredImage?: ProductImage | null;
  priceRange?: {
    minVariantPrice?: MoneyV2 | null;
  } | null;
};

type RelatedProduct = ProductCardItem;

type MetafieldIdentifier = {
  namespace: string;
  key: string;
};

const PRODUCT_METAFIELD_IDENTIFIERS: MetafieldIdentifier[] = [
  { namespace: "custom", key: "subtitle" },
  { namespace: "custom", key: "material" },
  { namespace: "custom", key: "care" },
  { namespace: "custom", key: "dimensions" },
  { namespace: "custom", key: "size_guide" },
  { namespace: "custom", key: "ingredients" },
  { namespace: "custom", key: "usage" },
  { namespace: "custom", key: "specification" },
  { namespace: "custom", key: "warranty" },
  { namespace: "custom", key: "shipping_info" },
  { namespace: "custom", key: "returns_info" },
  { namespace: "custom", key: "faq" },
  { namespace: "details", key: "material" },
  { namespace: "details", key: "composition" },
  { namespace: "details", key: "fit" },
  { namespace: "details", key: "weight" },
  { namespace: "details", key: "country_of_origin" },
  { namespace: "specs", key: "dimensions" },
  { namespace: "specs", key: "capacity" },
  { namespace: "seo", key: "subtitle" },
];

type ProductDetails = {
  id: string;
  handle: string;
  title: string;
  vendor?: string | null;
  productType?: string | null;
  tags?: string[] | null;
  collections?: {
    nodes?: Array<ProductCollection | null> | null;
  } | null;
  availableForSale?: boolean | null;
  featuredImage?: ProductImage | null;
  descriptionHtml?: string | null;
  options?: Array<ProductOption | null> | null;
  metafields?: Array<ProductMetafield | null> | null;
  variants?: {
    nodes?: Array<ProductVariant | null> | null;
  } | null;
  images?: {
    nodes?: Array<ProductImage | null> | null;
  } | null;
  priceRange?: {
    minVariantPrice?: MoneyV2 | null;
    maxVariantPrice?: MoneyV2 | null;
  } | null;
};

type ProductByHandleResponse = {
  productByHandle?: ProductDetails | null;
};

type RelatedProductsCollectionResponse = {
  collection?: {
    products?: {
      edges?: Array<{
        node?: RelatedProductCard | null;
      } | null> | null;
    } | null;
  } | null;
};

type RelatedProductsSearchResponse = {
  products?: {
    edges?: Array<{
      node?: RelatedProductCard | null;
    } | null> | null;
  } | null;
};

type ProductPageProps = {
  params: Promise<{
    handle: string;
  }>;
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

function hasMoneyValue(money?: MoneyV2 | null): boolean {
  return Boolean(money?.amount && money.currencyCode);
}

function escapeShopifySearchTerm(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function mapRelatedProducts(
  edges?: Array<{
    node?: RelatedProductCard | null;
  } | null> | null
): RelatedProduct[] {
  return (
    edges
      ?.map((edge) => edge?.node)
      .filter(
        (node): node is RelatedProductCard =>
          Boolean(node?.id && node?.handle && node?.title)
      )
      .map((node) => ({
        id: node.id || "",
        handle: node.handle || "",
        title: node.title || "",
        featuredImage: node.featuredImage ?? null,
        priceRange: node.priceRange ?? null,
      })) ?? []
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  const data = await shopifyFetch<ProductByHandleResponse>({
    query: SHOP_PRODUCT_BY_HANDLE_QUERY,
    variables: {
      handle,
      metafieldIdentifiers: PRODUCT_METAFIELD_IDENTIFIERS,
    },
  });

  const product = data.productByHandle;
  if (!product) {
    notFound();
  }

  const galleryImages: ProductGalleryImage[] =
    product.images?.nodes
      ?.filter((node): node is ProductImage => Boolean(node?.url))
      .map((image, index) => ({
        id: image.id || `${product.id}-image-${index}`,
        url: image.url || "",
        altText: image.altText || null,
        width: image.width ?? null,
        height: image.height ?? null,
      })) ?? [];

  const variants =
    product.variants?.nodes?.filter((node): node is ProductVariant => Boolean(node?.id)) ?? [];
  const descriptionHtml = product.descriptionHtml?.trim() || "";
  const hasDescriptionHtml = Boolean(descriptionHtml);
  const vendor = product.vendor?.trim() || "";
  const productType = product.productType?.trim() || "";
  const tags = product.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [];
  const availability =
    product.availableForSale === null || product.availableForSale === undefined
      ? ""
      : product.availableForSale
        ? "In stock"
        : "Out of stock";
  const minPrice = product.priceRange?.minVariantPrice;
  const maxPrice = product.priceRange?.maxVariantPrice;
  const priceRangeValue =
    hasMoneyValue(minPrice) && hasMoneyValue(maxPrice)
      ? formatMoney(minPrice) === formatMoney(maxPrice)
        ? formatMoney(minPrice)
        : `${formatMoney(minPrice)} - ${formatMoney(maxPrice)}`
      : hasMoneyValue(minPrice)
        ? formatMoney(minPrice)
        : hasMoneyValue(maxPrice)
          ? formatMoney(maxPrice)
          : "";
  const primaryCollectionHandle =
    product.collections?.nodes
      ?.find((collection) => Boolean(collection?.handle?.trim()))
      ?.handle?.trim() || "";
  const fallbackQuery = vendor
    ? `vendor:"${escapeShopifySearchTerm(vendor)}"`
    : productType
      ? `product_type:"${escapeShopifySearchTerm(productType)}"`
      : "";

  let relatedProducts: RelatedProduct[] = [];

  if (primaryCollectionHandle) {
    const relatedCollectionData = await shopifyFetch<RelatedProductsCollectionResponse>({
      query: SHOP_RELATED_PRODUCTS_BY_COLLECTION_QUERY,
      variables: {
        handle: primaryCollectionHandle,
        first: 8,
      },
    });

    relatedProducts = mapRelatedProducts(relatedCollectionData.collection?.products?.edges);
  } else if (fallbackQuery) {
    const relatedSearchData = await shopifyFetch<RelatedProductsSearchResponse>({
      query: SHOP_RELATED_PRODUCTS_BY_SEARCH_QUERY,
      variables: {
        query: fallbackQuery,
        first: 8,
      },
    });

    relatedProducts = mapRelatedProducts(relatedSearchData.products?.edges);
  }

  relatedProducts = relatedProducts
    .filter((related) => related.id !== product.id && related.handle !== product.handle)
    .slice(0, 4);

  const metafields =
    product.metafields
      ?.filter((node): node is ProductMetafield => Boolean(node?.value?.trim()))
      .map((field, index) => {
        const namespace = field.namespace?.trim() || "";
        const key = field.key?.trim() || `field-${index + 1}`;
        const label = field.description?.trim() || (namespace ? `${namespace}.${key}` : key);
        return {
          id: `${namespace}-${key}-${index}`,
          label,
          value: field.value?.trim() || "",
        };
      })
      .filter((field) => Boolean(field.value)) ?? [];
  const detailRows: ProductVariantPickerDetailRow[] = [];
  if (vendor) {
    detailRows.push({ id: "vendor", label: "Vendor", value: vendor });
  }
  if (productType) {
    detailRows.push({ id: "product-type", label: "Product type", value: productType });
  }
  if (tags.length > 0) {
    detailRows.push({ id: "tags", label: "Tags", pills: tags });
  }
  if (availability) {
    detailRows.push({
      id: "availability",
      label: "Availability",
      value: availability,
      tone: product.availableForSale ? "available" : "unavailable",
    });
  }
  if (priceRangeValue) {
    detailRows.push({ id: "price-range", label: "Price range", value: priceRangeValue });
  }
  const detailMetafields: ProductVariantPickerMetafield[] = metafields.map((field) => ({
    id: field.id,
    label: field.label,
    value: field.value,
  }));
  const hasDetailsSection = detailRows.length > 0 || detailMetafields.length > 0;
  const price = formatMoney(product.priceRange?.minVariantPrice);
  const variantPickerOptions: ProductVariantPickerOption[] =
    product.options
      ?.map((option, index) => {
        const name = option?.name?.trim() || `Option ${index + 1}`;
        const values = option?.values?.map((value) => value?.trim() || "").filter(Boolean) ?? [];
        return {
          id: option?.id || `${product.id}-option-${index}`,
          name,
          values: Array.from(new Set(values)),
        };
      })
      .filter((option) => option.values.length > 0) ?? [];
  const variantPickerVariants: ProductVariantPickerVariant[] = variants.map((variant, index) => ({
    id: variant.id || `${product.id}-variant-${index}`,
    title: variant.title?.trim() || "",
    availableForSale: Boolean(variant.availableForSale),
    quantityAvailable: variant.quantityAvailable ?? null,
    selectedOptions:
      variant.selectedOptions
        ?.filter((option): option is ProductSelectedOption => Boolean(option?.name && option?.value))
        .map((option) => ({
          name: option.name?.trim() || "",
          value: option.value?.trim() || "",
        }))
        .filter((option) => Boolean(option.name && option.value)) ?? [],
    price: variant.price ?? null,
    compareAtPrice: variant.compareAtPrice ?? null,
  }));

  return (
    <main className="w-full max-w-none py-10 md:py-14">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 xl:max-w-[1320px]">
        <div className="grid items-start gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <section aria-label="Product gallery">
            {galleryImages.length > 0 ? (
              <ProductGallery images={galleryImages} productTitle={product.title} />
            ) : (
              <div className="gallery-empty">No images available.</div>
            )}
          </section>

          <aside className="md:sticky md:top-24">
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm space-y-5">
              <section className="product-head" aria-labelledby="product-title">
                <h1
                  id="product-title"
                  className="text-xl font-semibold tracking-tight md:text-2xl"
                >
                  {product.title}
                </h1>
              </section>

              <section aria-label="Purchase actions">
                <ProductVariantPicker
                  options={variantPickerOptions}
                  variants={variantPickerVariants}
                  fallbackPrice={price}
                  details={
                    hasDetailsSection
                      ? {
                          rows: detailRows,
                          metafields: detailMetafields,
                        }
                      : undefined
                  }
                />
              </section>
            </div>
          </aside>
        </div>
      </div>

      <section className="mt-12 md:mt-16" aria-labelledby="description-title">
        <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6 xl:max-w-[1320px]">
          <h2
            id="description-title"
            className="text-sm font-semibold text-black/70 uppercase tracking-wider"
          >
            Description
          </h2>
          <div className="mt-3 border-t border-black/10" aria-hidden="true" />
          {hasDescriptionHtml ? (
            <div
              className="mt-4 product-description prose prose-sm md:prose-base prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <p className="mt-4 text-sm md:text-base">No description is available for this product yet.</p>
          )}
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mt-12 md:mt-16" aria-labelledby="related-products-title">
          <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6 xl:max-w-[1320px]">
            <h2
              id="related-products-title"
              className="text-sm font-semibold text-black/70 uppercase tracking-wider"
            >
              You may also like
            </h2>
            <div className="mt-3 border-t border-black/10" aria-hidden="true" />
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  formatMoney={formatMoney}
                  titleTag="h3"
                  maxWidthClassName="max-w-[190px]"
                  linkClassName="!no-underline hover:!no-underline"
                  titleClassName="text-[1.08rem]"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <style>{`
        .product-head {
          margin: 0;
        }

        .product-head h1 {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .gallery-empty {
          border: 1px dashed #cfcfcf;
          border-radius: 12px;
          padding: 1.2rem;
          color: #666666;
          font-size: 0.95rem;
        }

        @media (min-width: 768px) {
          .product-head h1 {
            font-size: 1.5rem;
          }
        }

      `}</style>
    </main>
  );
}
