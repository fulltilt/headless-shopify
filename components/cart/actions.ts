"use server";

import { ProductCardProps } from "@/app/types";
import { Cart, Connection } from "@/app/api/shopify/types";
// import { TAGS } from 'lib/constants';
// import {
//   addToCart,
//   createCart,
//   getCart,
//   removeFromCart,
//   updateCart,
// } from "../../app/api/shopify";
import { createCart, getCart } from "@/app/api/route";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

export async function addItem(product: ProductCardProps) {
  let cartId = cookies().get("cartId")?.value;
  let cart;
  console.log("cartId", cartId);
  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = (await createCart()) as Cart;
    console.log("cart", cart);
    cartId = cart.id;
    cookies().set("cartId", cartId);
  }
  console.log(cart, product);

  //   try {
  //     await addToCart(cartId, [
  //       { merchandiseId: selectedVariantId, quantity: 1 },
  //     ]);
  //     // revalidateTag(TAGS.cart);
  //   } catch (e) {
  //     return "Error adding item to cart";
  //   }
}

// export async function removeItem(prevState: any, lineId: string) {
//   const cartId = cookies().get("cartId")?.value;

//   if (!cartId) {
//     return "Missing cart ID";
//   }

//   try {
//     await removeFromCart(cartId, [lineId]);
//     // revalidateTag(TAGS.cart);
//   } catch (e) {
//     return "Error removing item from cart";
//   }
// }

// export async function updateItemQuantity(
//   prevState: any,
//   payload: {
//     lineId: string;
//     variantId: string;
//     quantity: number;
//   }
// ) {
//   const cartId = cookies().get("cartId")?.value;

//   if (!cartId) {
//     return "Missing cart ID";
//   }

//   const { lineId, variantId, quantity } = payload;

//   try {
//     if (quantity === 0) {
//       await removeFromCart(cartId, [lineId]);
//       //   revalidateTag(TAGS.cart);
//       return;
//     }

//     await updateCart(cartId, [
//       {
//         id: lineId,
//         merchandiseId: variantId,
//         quantity,
//       },
//     ]);
//     // revalidateTag(TAGS.cart);
//   } catch (e) {
//     return "Error updating item quantity";
//   }
// }
