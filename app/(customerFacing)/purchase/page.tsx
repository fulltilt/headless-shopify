import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { CheckoutForm } from "./CheckoutForm";

import { getCartAction } from "@/components/cart/actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage() {
  let cartId = cookies().get("cartId")?.value;
  if (!cartId) return null;
  let cart = await getCartAction(cartId);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseFloat(cart.cost.totalAmount.amount) * 100,
    currency: "USD",
    metadata: { cartId: cart.id },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <CheckoutForm cart={cart} clientSecret={paymentIntent.client_secret} />
  );
}
