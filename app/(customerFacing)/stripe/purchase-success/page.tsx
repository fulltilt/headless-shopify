import getCart from "@/app/api/getCart";
import Image from "next/image";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (paymentIntent.metadata.cartId === null) return notFound();

  const cart = await getCart(paymentIntent.metadata.cartId);
  if (cart == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      <div className="flex gap-4 items-center">
        {cart.lines.edges.map((product) => (
          <div key={product.node.id}>
            <div className="aspect-video flex-shrink-0 w-1/3 relative">
              <Image
                src={product.node.merchandise.product.featuredImage.url}
                fill
                alt={product.node.merchandise.title}
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-lg">
                {formattedPrice.format(
                  parseFloat(product.node.cost.totalAmount.amount)
                )}
              </div>
              <h1 className="text-2xl font-bold">
                {product.node.merchandise.title}
              </h1>
              <div className="line-clamp-3 text-muted-foreground">
                {product.node.merchandise.product.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
