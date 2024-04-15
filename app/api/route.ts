import { postToShopify } from "../../util/shopify";
import { Product } from "../types/admin.types";
import cartFragment from "./shopify/fragments/cart";
import { ShopifyCart } from "./shopify/types";

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

export async function getCart(cartId: string): Promise<ShopifyCart> {
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

  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
) {
  const data = await postToShopify({
    query: `
        mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart {
                    ...cart
                }
            }
        }
        ${cartFragment}
    `,
    variables: {
      cartId: cartId,
      lines: lines,
    },
  });

  return data.cartLinesAdd.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const data = await postToShopify({
    query: `
            mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
                cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                    cart {
                        ...cart
                    }
                }
            }
          ${cartFragment}
      `,
    variables: {
      cartId: cartId,
      lineIds: lineIds,
    },
  });

  return data.cartLinesRemove.cart;
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
) {
  const data = await postToShopify({
    query: `
            mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
                cartLinesUpdate(cartId: $cartId, lines: $lines) {
                    cart {
                        ...cart
                    }
                }
            }
            ${cartFragment}
        `,
    variables: {
      cartId: cartId,
      lines: lines,
    },
  });

  return data.cartLinesUpdate.cart;
}
