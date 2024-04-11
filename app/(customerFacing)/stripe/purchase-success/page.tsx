import { getProduct } from "@/app/api/route";
import { ProductCardProps } from "@/app/types";
import Image from "next/image";
import Link from "next/link";
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
  if (paymentIntent.metadata.productId == null) return notFound();

  let arr = paymentIntent.metadata.productId.split("/");
  let id = arr[arr.length - 1];
  const product: ProductCardProps = await getProduct(id);
  if (product == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imageSrc}
            fill
            alt={product.title}
            className="object-contain"
          />
        </div>
        <div>
          <div className="text-lg">
            {formattedPrice.format(parseFloat(product.price.amount))}
          </div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
