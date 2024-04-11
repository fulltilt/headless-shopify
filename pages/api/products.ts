import type { NextApiRequest, NextApiResponse } from "next";
import { postToShopify } from "../../util/shopify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await postToShopify({
    query: `
      #graphql
      query getProductList($sortKey: ProductSortKeys!) {
        products(sortKey: $sortKey, first: 100, reverse: true) {
          edges {
            node {
              id
              handle
              description
              title
              totalInventory
              availableForSale
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              priceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      sortKey: "BEST_SELLING",
    },
  });

  res.status(200).json(data);
}
