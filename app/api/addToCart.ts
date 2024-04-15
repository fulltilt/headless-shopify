import { postToShopify } from "../../util/shopify";
import cartFragment from "./shopify/fragments/cart";

export default async function addToCart(
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
