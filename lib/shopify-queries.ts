const SHOP_PRODUCT_CARD_FIELDS = `
  id
  handle
  title
  featuredImage {
    url
    altText
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
`;

const SHOP_RELATED_PRODUCT_CARD_FIELDS = `
  id
  handle
  title
  featuredImage {
    url
    altText
    width
    height
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
`;

export const SHOP_PRODUCTS_QUERY = `
  query ShopProducts($first: Int = 12) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          ${SHOP_PRODUCT_CARD_FIELDS}
        }
      }
    }
  }
`;

export const SHOP_FEATURED_COLLECTION_PRODUCTS_QUERY = `
  query ShopFeaturedCollectionProducts($handle: String! = "featured", $first: Int = 6) {
    collection(handle: $handle) {
      products(first: $first, sortKey: COLLECTION_DEFAULT, reverse: false) {
        edges {
          node {
            ${SHOP_PRODUCT_CARD_FIELDS}
          }
        }
      }
    }
  }
`;

export const SHOP_RELATED_PRODUCTS_BY_COLLECTION_QUERY = `
  query ShopRelatedProductsByCollection($handle: String!, $first: Int = 8) {
    collection(handle: $handle) {
      products(first: $first, sortKey: COLLECTION_DEFAULT, reverse: false) {
        edges {
          node {
            ${SHOP_RELATED_PRODUCT_CARD_FIELDS}
          }
        }
      }
    }
  }
`;

export const SHOP_RELATED_PRODUCTS_BY_SEARCH_QUERY = `
  query ShopRelatedProductsBySearch($query: String!, $first: Int = 8) {
    products(first: $first, query: $query, sortKey: RELEVANCE, reverse: false) {
      edges {
        node {
          ${SHOP_RELATED_PRODUCT_CARD_FIELDS}
        }
      }
    }
  }
`;

export const SHOP_PRODUCT_BY_HANDLE_QUERY = `
  query ShopProductByHandle(
    $handle: String!
    $metafieldIdentifiers: [HasMetafieldsIdentifier!]!
  ) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      vendor
      productType
      tags
      collections(first: 1) {
        nodes {
          handle
          title
        }
      }
      availableForSale
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 50) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      descriptionHtml
      options {
        id
        name
        values
      }
      metafields(identifiers: $metafieldIdentifiers) {
        namespace
        key
        type
        value
        description
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;
