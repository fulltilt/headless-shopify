import { postToShopify } from "../../util/shopify";
import cartFragment from "./shopify/fragments/cart";
import { ShopifyCart } from "./shopify/types";

export default async function getCart(cartId: string): Promise<ShopifyCart> {
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
