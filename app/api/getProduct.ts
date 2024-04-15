import { postToShopify } from "../../util/shopify";

export default async function getProduct(id: string) {
  const data = await postToShopify({
    query: `
          #graphql
          query getProduct($id: ID!) {
            product(id: $id) {
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
        `,
    variables: {
      id: `gid://shopify/Product/${id}`,
    },
  });

  return {
    id: data.product.variants.edges?.[0]?.node.id,
    title: data.product.title,
    description: data.product.description,
    imageSrc: data.product.images.edges?.[0]?.node.url,
    imageAlt: data.product.title,
    price: {
      amount: data.product.priceRange.maxVariantPrice.amount,
      currencyCode: "USD",
    },
    slug: data.product.handle,
  };
}
