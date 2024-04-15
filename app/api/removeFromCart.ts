import { postToShopify } from "../../util/shopify";
import cartFragment from "./shopify/fragments/cart";

export default async function removeFromCart(
  cartId: string,
  lineIds: string[]
) {
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
