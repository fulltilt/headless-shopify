import { postToShopify } from "../../util/shopify";
import cartFragment from "./shopify/fragments/cart";

export default async function createCart() {
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
