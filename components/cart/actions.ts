"use server";

import { ProductCardProps } from "@/app/types";
import { Cart, CartItem, Connection, Money } from "@/app/api/shopify/types";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/app/api/route";
// import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

export const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: "USD",
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

export async function getCartAction(cartId: string) {
  let cart = await getCart(cartId);
  return reshapeCart(cart);
}

export async function addItem(product: ProductCardProps) {
  let cartId = cookies().get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = (await createCart()) as Cart;
    cartId = cart.id;
    cookies().set("cartId", cartId);
  }

  try {
    let cart = await addToCart(cartId, [
      { merchandiseId: product.id, quantity: 1 },
    ]);
    return reshapeCart(cart);
    // revalidateTag(TAGS.cart);
  } catch (e) {
    console.log(e);
    return new Error("Error adding item to cart");
  }
}

export async function removeItem(item: CartItem): Promise<Cart | string> {
  const cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    let cart = await removeFromCart(cartId, [item.id]);
    return reshapeCart(cart);
    // revalidateTag(TAGS.cart);
  } catch (e) {
    console.log(e);
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(payload: {
  lineId: string;
  variantId: string;
  quantity: number;
}) {
  const cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      let cart = await removeFromCart(cartId, [lineId]);
      return reshapeCart(cart);
      //   revalidateTag(TAGS.cart);
      return;
    }

    let cart = await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
      },
    ]);

    return reshapeCart(cart);
    // revalidateTag(TAGS.cart);
  } catch (e) {
    console.log("err", e);
    return "Error updating item quantity";
  }
}
