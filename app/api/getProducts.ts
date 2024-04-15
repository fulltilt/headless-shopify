import { postToShopify } from "../../util/shopify";
import { Product } from "../types/admin.types";

export default async function getProducts(sortKey: string, limit: number) {
  const data = await postToShopify({
    query: `
        #graphql
        query getProductList($sortKey: ProductSortKeys!, $limit: Int!) {
          products(sortKey: $sortKey, first: $limit, reverse: true) {
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
      sortKey: sortKey,
      limit: limit,
    },
  });

  return await data.products.edges
    .map(({ node }: { node: Product }) => {
      if (node.totalInventory <= 0) {
        return false;
      }
      return {
        id: node.id,
        title: node.title,
        description: node.description,
        imageSrc: node.images.edges?.[0]?.node.url,
        imageAlt: node.title,
        price: node.variants.edges?.[0]?.node.price,
        slug: node.handle,
      };
    })
    .filter(Boolean);
}
