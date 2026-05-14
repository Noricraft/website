"use client";

import { useMemo, useState, useTransition } from "react";
import { addToCartAndRedirect } from "../../actions/cart";

type MoneyV2 = {
  amount?: string | null;
  currencyCode?: string | null;
};

type ProductSelectedOption = {
  name: string;
  value: string;
};

export type ProductVariantPickerOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariantPickerVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number | null;
  selectedOptions: ProductSelectedOption[];
  price?: MoneyV2 | null;
  compareAtPrice?: MoneyV2 | null;
};

export type ProductVariantPickerDetailRow = {
  id: string;
  label: string;
  value?: string;
  pills?: string[];
  tone?: "available" | "unavailable";
};

export type ProductVariantPickerMetafield = {
  id: string;
  label: string;
  value: string;
};

type ProductVariantPickerProps = {
  options: ProductVariantPickerOption[];
  variants: ProductVariantPickerVariant[];
  fallbackPrice: string;
  details?: {
    rows: ProductVariantPickerDetailRow[];
    metafields: ProductVariantPickerMetafield[];
  };
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

function getInitialSelection(
  options: ProductVariantPickerOption[],
  variant: ProductVariantPickerVariant | null
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const option of options) {
    const selectedFromVariant = variant?.selectedOptions.find((item) => item.name === option.name);
    if (selectedFromVariant?.value) {
      result[option.name] = selectedFromVariant.value;
      continue;
    }

    const firstValue = option.values[0];
    if (firstValue) {
      result[option.name] = firstValue;
    }
  }

  return result;
}

function findMatchingVariant(
  variants: ProductVariantPickerVariant[],
  options: ProductVariantPickerOption[],
  selectedOptions: Record<string, string>
): ProductVariantPickerVariant | null {
  if (variants.length === 0) {
    return null;
  }

  return (
    variants.find((variant) =>
      options.every((option) => {
        const selectedValue = selectedOptions[option.name];
        if (!selectedValue) {
          return false;
        }

        const variantValue = variant.selectedOptions.find((item) => item.name === option.name)?.value;
        return variantValue === selectedValue;
      })
    ) || null
  );
}

export default function ProductVariantPicker({
  options,
  variants,
  fallbackPrice,
  details,
}: ProductVariantPickerProps) {
  const hasVariantChoices = options.length > 0 && variants.length > 1;
  const fallbackVariant = variants.find((variant) => variant.availableForSale) || variants[0] || null;
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    getInitialSelection(options, fallbackVariant)
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdding, startAddTransition] = useTransition();

  const selectedVariant = useMemo(() => {
    if (!hasVariantChoices) {
      return fallbackVariant;
    }

    return findMatchingVariant(variants, options, selectedOptions) || fallbackVariant;
  }, [fallbackVariant, hasVariantChoices, options, selectedOptions, variants]);

  const selectedPrice = selectedVariant?.price ? formatMoney(selectedVariant.price) : fallbackPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice
    ? formatMoney(selectedVariant.compareAtPrice)
    : null;
  const selectedPriceSymbol = selectedPrice.startsWith("$") ? "$" : "";
  const selectedPriceAmount = selectedPriceSymbol ? selectedPrice.slice(1) : selectedPrice;
  const showCompareAtPrice = Boolean(compareAtPrice && compareAtPrice !== selectedPrice);
  const isAvailable = selectedVariant ? selectedVariant.availableForSale : true;
  const statusText = isAvailable ? "In stock" : "Out of stock";
  const selectedVariantId = selectedVariant?.id?.trim() || "";
  const isButtonDisabled =
    (hasVariantChoices ? !selectedVariant?.availableForSale : false) ||
    !selectedVariantId ||
    isAdding;
  const detailRows = details?.rows ?? [];
  const detailMetafields = details?.metafields ?? [];
  const hasDetails = detailRows.length > 0 || detailMetafields.length > 0;

  return (
    <div className="variant-picker">
      {hasVariantChoices ? (
        <div className="option-groups">
          {options.map((option) => (
            <fieldset key={option.id} className="option-group">
              <legend className="option-label text-xs font-medium text-black/60">{option.name}</legend>
              <div className="option-values">
                {option.values.map((value) => {
                  const isActive = selectedOptions[option.name] === value;

                  return (
                    <button
                      key={`${option.id}-${value}`}
                      type="button"
                      className={`option-value rounded-full px-3 py-1.5 text-xs border border-black/10 hover:border-black/30 ${
                        isActive ? "is-active bg-black text-white border-black" : "bg-white text-black"
                      }`}
                      onClick={() =>
                        setSelectedOptions((current) => ({
                          ...current,
                          [option.name]: value,
                        }))
                      }
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      ) : null}

      <div className="variant-meta">
        <p className="variant-price text-lg md:text-xl font-medium text-black">
          {selectedPriceSymbol ? <span className="price-symbol">{selectedPriceSymbol}</span> : null}
          <span className="price-amount">{selectedPriceAmount}</span>
          {showCompareAtPrice ? (
            <span className="variant-compare line-through text-black/40 text-sm">{compareAtPrice}</span>
          ) : null}
        </p>
        <p className={`variant-status text-sm text-black/60 ${isAvailable ? "is-available" : "is-unavailable"}`}>
          {statusText}
        </p>
      </div>

      <button
        type="button"
        className={`add-to-cart w-full h-11 rounded-full bg-black text-white text-sm font-medium hover:bg-black/90 transition disabled:opacity-45 disabled:cursor-not-allowed ${
          isAdding ? "is-loading" : ""
        }`}
        disabled={isButtonDisabled}
        onClick={() => {
          if (!selectedVariantId) {
            return;
          }

          startAddTransition(async () => {
            await addToCartAndRedirect(selectedVariantId, 1);
          });
        }}
      >
        {isAdding ? "Adding..." : "Add to cart"}
      </button>

      <button
        type="button"
        className="secondary-action w-full h-11 rounded-full border border-black/15 text-sm hover:bg-black/5 transition"
        onClick={() => {
          if (!hasDetails) {
            return;
          }
          setIsDetailsOpen((current) => !current);
        }}
        disabled={!hasDetails}
      >
        {isDetailsOpen ? "Hide details" : "View details"}
      </button>

      {hasDetails ? (
        <div className={`details-collapse ${isDetailsOpen ? "is-open" : ""}`}>
          <div className="details-inner">
            <h3 className="details-title">Details</h3>
            <dl className="details-list">
              {detailRows.map((row) => (
                <div key={row.id} className="detail-item">
                  <dt className="detail-label">{row.label}</dt>
                  <dd className={`detail-value ${row.tone ? `is-${row.tone}` : ""}`}>
                    {row.pills && row.pills.length > 0 ? (
                      <div className="detail-pills">
                        {row.pills.map((pill, index) => (
                          <span key={`${row.id}-${pill}-${index}`} className="detail-pill">
                            {pill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      row.value || "-"
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {detailMetafields.length > 0 ? (
              <div className="metafields-wrap">
                <h4 className="metafields-title">Metafields</h4>
                <dl className="metafields-list">
                  {detailMetafields.map((field) => (
                    <div key={field.id} className="metafield-item">
                      <dt className="metafield-label">{field.label}</dt>
                      <dd className="metafield-value">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .variant-picker {
          display: grid;
          gap: 0.9rem;
        }

        .option-groups {
          display: grid;
          gap: 0.75rem;
        }

        .option-group {
          margin: 0;
          padding: 0;
          border: 0;
          display: grid;
          gap: 0;
        }

        .option-group legend {
          display: block;
          padding: 0;
          margin: 0;
        }

        .option-values {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.45rem;
        }

        .option-value {
          background: transparent;
          color: #111111;
          line-height: 1;
          cursor: pointer;
          transition:
            border-color 180ms ease,
            background-color 180ms ease,
            color 180ms ease;
        }

        .option-value:hover {
          color: #111111;
          background: #ffffff;
        }

        .option-value.is-active {
          color: #ffffff;
          background: #111111;
        }

        .option-value.is-active:hover {
          color: #ffffff;
          background: #111111;
        }

        .variant-meta {
          display: grid;
          gap: 0.2rem;
        }

        .variant-price {
          margin: 0;
          display: inline-flex;
          align-items: baseline;
          gap: 0.15rem;
          line-height: 1.2;
        }

        .price-symbol {
          color: #111111;
        }

        .price-amount {
          color: #15803d;
        }

        .variant-compare {
          margin-left: 0.35rem;
          font-weight: 400;
        }

        .variant-status {
          margin: 0;
        }

        .variant-status.is-available {
          color: rgb(17 17 17 / 60%);
        }

        .variant-status.is-unavailable {
          color: rgb(17 17 17 / 60%);
        }

        .add-to-cart.is-loading {
          animation: button-pulse 0.9s ease-in-out infinite alternate;
          transform: translateY(1px);
        }

        .secondary-action:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .details-collapse {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition:
            max-height 280ms ease,
            opacity 220ms ease;
        }

        .details-collapse.is-open {
          max-height: 1200px;
          opacity: 1;
        }

        .details-inner {
          margin-top: 0.2rem;
          border-top: 1px solid #efefef;
          padding-top: 0.8rem;
          display: grid;
          gap: 0.75rem;
        }

        .details-title,
        .metafields-title {
          margin: 0;
          font-size: 0.75rem;
          line-height: 1.3;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgb(17 17 17 / 70%);
        }

        .details-list,
        .metafields-list {
          margin: 0;
          display: grid;
          gap: 0.55rem;
        }

        .detail-item,
        .metafield-item {
          margin: 0;
          display: grid;
          gap: 0.2rem;
        }

        .detail-label,
        .metafield-label {
          margin: 0;
          font-size: 0.75rem;
          line-height: 1.3;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgb(17 17 17 / 60%);
        }

        .detail-value,
        .metafield-value {
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.45;
          color: #202020;
          word-break: break-word;
        }

        .detail-value.is-available {
          color: #15803d;
          font-weight: 500;
        }

        .detail-value.is-unavailable {
          color: #b91c1c;
          font-weight: 500;
        }

        .detail-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .detail-pill {
          display: inline-flex;
          align-items: center;
          border: 1px solid #dddddd;
          border-radius: 999px;
          background: #fbfbfb;
          color: #333333;
          font-size: 0.75rem;
          line-height: 1;
          padding: 0.2rem 0.5rem;
        }

        .metafields-wrap {
          display: grid;
          gap: 0.6rem;
          border-top: 1px solid #f1f1f1;
          padding-top: 0.75rem;
        }

        @keyframes button-pulse {
          from {
            opacity: 0.8;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
