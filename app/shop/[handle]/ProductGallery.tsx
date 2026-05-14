"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ProductGalleryImage = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductGalleryProps = {
  images: ProductGalleryImage[];
  productTitle: string;
};

const passthroughImageLoader = ({ src }: ImageLoaderProps): string => src;

function getImageAlt(image: ProductGalleryImage, productTitle: string, index: number): string {
  return image.altText?.trim() || `${productTitle} image ${index + 1}`;
}

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const normalizedActiveIndex = activeIndex >= images.length ? 0 : activeIndex;

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (images.length === 0) {
        return 0;
      }
      return (current + 1) % images.length;
    });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (images.length === 0) {
        return 0;
      }
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrev, isLightboxOpen]);

  const activeImage = images[normalizedActiveIndex] || images[0];
  const activeAlt = useMemo(
    () => getImageAlt(activeImage, productTitle, normalizedActiveIndex),
    [activeImage, normalizedActiveIndex, productTitle]
  );

  if (!activeImage) {
    return null;
  }

  return (
    <div className="gallery-root">
      <button
        type="button"
        className="main-image-button"
        onClick={() => setIsLightboxOpen(true)}
        aria-label="Open image preview"
      >
        <Image
          src={activeImage.url}
          alt={activeAlt}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          loader={passthroughImageLoader}
          unoptimized
          className="gallery-image"
        />
      </button>

      <div className="thumbnail-row" aria-label="Product image thumbnails">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`thumbnail-button ${index === normalizedActiveIndex ? "is-active" : ""}`}
            aria-label={`Preview image ${index + 1}`}
            aria-current={index === normalizedActiveIndex}
          >
            <Image
              src={image.url}
              alt={getImageAlt(image, productTitle, index)}
              fill
              sizes="96px"
              loader={passthroughImageLoader}
              unoptimized
              className="gallery-image"
            />
          </button>
        ))}
      </div>

      {isLightboxOpen ? (
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsLightboxOpen(false);
            }
          }}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close preview"
          >
            Close
          </button>

          <button type="button" className="lightbox-nav lightbox-prev" onClick={goPrev}>
            Prev
          </button>

          <figure className="lightbox-figure">
            <Image
              src={activeImage.url}
              alt={activeAlt}
              fill
              sizes="100vw"
              loader={passthroughImageLoader}
              unoptimized
              className="lightbox-image"
            />
          </figure>

          <button type="button" className="lightbox-nav lightbox-next" onClick={goNext}>
            Next
          </button>

          <p className="lightbox-counter">
            {normalizedActiveIndex + 1} / {images.length}
          </p>
        </div>
      ) : null}

      <style jsx>{`
        .gallery-root {
          display: grid;
          gap: 0.8rem;
        }

        .main-image-button {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border: 1px solid #e6e6e6;
          border-radius: 1rem;
          overflow: hidden;
          background: #fafafa;
          box-shadow: 0 8px 20px rgb(0 0 0 / 4%);
          padding: 0;
          cursor: zoom-in;
        }

        .gallery-image {
          object-fit: cover;
        }

        .thumbnail-row {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .thumbnail-button {
          position: relative;
          width: 78px;
          height: 78px;
          border: 1px solid #e3e3e3;
          border-radius: 1rem;
          overflow: hidden;
          padding: 0;
          background: #ffffff;
          cursor: pointer;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
        }

        .thumbnail-button:hover {
          transform: translateY(-1px);
          border-color: #c9c9c9;
        }

        .thumbnail-button.is-active {
          border-color: #111111;
          box-shadow: 0 0 0 1px #111111 inset;
        }

        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgb(0 0 0 / 78%);
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.8rem;
          padding: clamp(0.8rem, 3vw, 1.5rem);
        }

        .lightbox-figure {
          position: relative;
          margin: 0;
          width: 100%;
          max-width: min(1100px, 92vw);
          justify-self: center;
          aspect-ratio: 4 / 3;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgb(255 255 255 / 22%);
          background: #0f0f0f;
        }

        .lightbox-image {
          object-fit: contain;
        }

        .lightbox-nav,
        .lightbox-close {
          border: 1px solid rgb(255 255 255 / 35%);
          background: rgb(17 17 17 / 70%);
          color: #ffffff;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.84rem;
          line-height: 1;
          padding: 0.55rem 0.85rem;
        }

        .lightbox-prev {
          justify-self: end;
        }

        .lightbox-next {
          justify-self: start;
        }

        .lightbox-close {
          position: fixed;
          top: 1rem;
          right: 1rem;
        }

        .lightbox-counter {
          position: fixed;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          margin: 0;
          font-size: 0.82rem;
          color: #f3f3f3;
          background: rgb(17 17 17 / 70%);
          border: 1px solid rgb(255 255 255 / 20%);
          border-radius: 999px;
          padding: 0.35rem 0.65rem;
        }

        @media (max-width: 900px) {
          .thumbnail-button {
            width: 66px;
            height: 66px;
          }

          .lightbox-backdrop {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 0.6rem;
          }

          .lightbox-prev,
          .lightbox-next {
            justify-self: center;
          }
        }
      `}</style>
    </div>
  );
}
