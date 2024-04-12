import { postToShopify } from "../../util/shopify";
import { Product } from "../types/admin.types";
import cartFragment from "./shopify/fragments/cart";

export async function getProducts(sortKey: string, limit: number) {
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

export async function getProduct(id: string) {
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
    id: data.product.id,
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

export async function getCustomer(email: string) {
  const data = await postToShopify({
    query: `
        #graphql
        query GetCustomer($email: String!) {
            customers(first: 10, query: $email) {
                edges{
                    node {
                        firstName
                        lastName
                        email
                        defaultAddress {
                            id
                            address1
                        }
                    }
                }
            }
        }
      `,
    variables: {
      email: email,
    },
    customer: true,
  });
  console.log("data", data);
}

export async function createCart() {
  const data = await postToShopify({
    query: `
        #graphql
        mutation createCart($lineItems: [CartLineInput!]) {
            cartCreate(input: { lines: $lineItems }) {
                cart {
                    ...cart
                }
            }
        }
        ${cartFragment}
    `,
    variables: {
      lineItems: [],
    },
  });

  return data.cartCreate.cart;
}

export async function getCart(cartId: string) {
  const data = await postToShopify({
    query: `
        #graphql
        query getCart($cartId: ID!) {
            cart(id: $cartId) {
            ...cart
            }
        }
        ${cartFragment}
      `,
    variables: {
      cartId: cartId,
    },
  });

  return data;
}
