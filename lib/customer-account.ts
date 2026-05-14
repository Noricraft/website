import "server-only";

import {
  customerAccountFetch as customerAccountApiFetch,
  getCustomerAccountGraphqlEndpoint,
} from "./shopify-customer-account";

type MoneyV2 = {
  amount?: string | null;
  currencyCode?: string | null;
};

export type CustomerProfile = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

export type CustomerOrder = {
  id: string;
  name?: string | null;
  number?: number | null;
  processedAt?: string | null;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  totalPrice?: MoneyV2 | null;
};

type CustomerProfileResponse = {
  customer?: {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: {
      emailAddress?: string | null;
    } | null;
  } | null;
};

type CustomerOrdersResponse = {
  customer?: {
    orders?: {
      nodes?: Array<{
        id?: string | null;
        name?: string | null;
        number?: number | null;
        processedAt?: string | null;
        financialStatus?: string | null;
        fulfillmentStatus?: string | null;
        totalPrice?: MoneyV2 | null;
      } | null> | null;
    } | null;
  } | null;
};

const GET_CUSTOMER_PROFILE_QUERY = `
  query GetCustomerProfile {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

const GET_CUSTOMER_ORDERS_QUERY = `
  query GetCustomerOrders($first: Int = 10) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          number
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function customerAccountFetch<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  token: string
): Promise<T> {
  const accessToken = token.trim();
  if (!accessToken) {
    throw new Error("Customer access token is required.");
  }

  return customerAccountApiFetch<T>({
    accessToken,
    query,
    variables,
  });
}

export async function getCustomerProfile(token: string): Promise<CustomerProfile | null> {
  if (process.env.NODE_ENV !== "production") {
    const accessTokenPreview = token.trim().slice(0, 10);
    let endpoint = "unresolved";

    try {
      endpoint = await getCustomerAccountGraphqlEndpoint();
    } catch (error) {
      endpoint = `unresolved: ${
        error instanceof Error ? error.message : typeof error === "string" ? error : "unknown_error"
      }`;
    }

    console.info("[customer-account] getCustomerProfile auth debug", {
      endpoint,
      authorizationPrefix: accessTokenPreview || null,
      startsWithShcat: token.trim().startsWith("shcat_"),
    });
  }

  const data = await customerAccountFetch<CustomerProfileResponse>(
    GET_CUSTOMER_PROFILE_QUERY,
    undefined,
    token
  );

  const customer = data.customer;
  if (!customer?.id) {
    return null;
  }

  return {
    id: customer.id,
    firstName: customer.firstName ?? null,
    lastName: customer.lastName ?? null,
    email: customer.emailAddress?.emailAddress ?? null,
  };
}

export async function getCustomerOrders(
  token: string,
  first = 10
): Promise<CustomerOrder[]> {
  const data = await customerAccountFetch<CustomerOrdersResponse>(
    GET_CUSTOMER_ORDERS_QUERY,
    { first },
    token
  );

  return (
    data.customer?.orders?.nodes
      ?.filter((order): order is NonNullable<typeof order> => Boolean(order?.id))
      .map((order) => ({
        id: order.id || "",
        name: order.name ?? null,
        number: order.number ?? null,
        processedAt: order.processedAt ?? null,
        financialStatus: order.financialStatus ?? null,
        fulfillmentStatus: order.fulfillmentStatus ?? null,
        totalPrice: order.totalPrice ?? null,
      })) ?? []
  );
}
