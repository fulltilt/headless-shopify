import { postToShopify } from "../../util/shopify";
import cartFragment from "./shopify/fragments/cart";

export default async function updateCart(
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
