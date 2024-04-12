"use client";

import { ProductCardProps } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, Suspense, useState } from "react";
import { addItem } from "@/components/cart/actions";

type CheckoutFormProps = {
  product: ProductCardProps;
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  const [pending, setPending] = useState(false);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setPending(true);

    const data = await addItem(product);
    // console.log(data);
    setPending(false);
  };

  return (
    //   <Elements options={{ clientSecret }} stripe={stripePromise}>
    //     <Form price={formattedPrice.format(parseFloat(product.price.amount))} />
    //   </Elements>
    // </div>
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
            }
          >
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
              <Image
                src={product.imageSrc}
                fill
                alt={product.title}
                className="h-full w-full object-contain"
              />
            </div>
          </Suspense>
        </div>

        <div className="basis-full lg:basis-2/6">
          <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
            <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
            <div className="mr-auto w-auto text-lg">
              {formattedPrice.format(parseFloat(product.price.amount))}
            </div>
          </div>
          <div className="prose mx-auto max-w-6xl text-base leading-7 text-black prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-a:text-black prose-a:underline hover:prose-a:text-neutral-300 prose-strong:text-black prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6 dark:text-white dark:prose-headings:text-white dark:prose-a:text-white dark:prose-strong:text-white">
            {product.description}
          </div>

          <Suspense fallback={null}>
            <form onSubmit={handleSubmit}>
              <Button className="rounded-3xl">
                {pending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus />
                )}
                Add To Cart
              </Button>
            </form>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function Form({ price }: { price: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading ? "Purchasing..." : `Purchase - ${price}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
