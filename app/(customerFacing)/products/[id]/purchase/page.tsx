import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./CheckoutForm";
import { getProduct } from "@/app/api/route";
import { ProductCardProps } from "@/app/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product: ProductCardProps = await getProduct(id);

  if (product == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseFloat(product.price.amount),
    currency: "USD",
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
