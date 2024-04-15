"use client";

import { Cart } from "@/app/api/shopify/types";
import { Button } from "@/components/ui/button";
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
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
  cart: Cart;
  clientSecret: string;
};

type MerchandiseSearchParams = {
  [key: string]: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ cart, clientSecret }: CheckoutFormProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let subTotal = parseFloat(cart.cost.totalAmount.amount);
  let total = subTotal;
  if (subTotal < 100) total += 10;

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4">
        <div style={{ flex: 1 }}>
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <Form price={formattedPrice.format(subTotal)} />
          </Elements>
        </div>
        <div
          className="flex h-full flex-col justify-between overflow-hidden p-1"
          style={{ flex: 1 }}
        >
          <ul className="flex-grow overflow-auto py-4">
            {cart &&
              cart.lines.map((item, i) => {
                const merchandiseSearchParams = {} as MerchandiseSearchParams;

                item.merchandise.selectedOptions.forEach(
                  ({ name, value }: { name: string; value: string }) => {
                    merchandiseSearchParams[name.toLowerCase()] = value;
                  }
                );

                return (
                  <li
                    key={i}
                    className="flex w-full flex-col border-neutral-300 dark:border-neutral-700"
                  >
                    <div className="relative flex w-full flex-row justify-between items-center px-1 py-4">
                      <div className="absolute z-40 -mt-14 ml-[55px]">
                        <button className="ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200">
                          <span className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black text-xs">
                            {item.quantity}
                          </span>
                        </button>
                      </div>

                      <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <Image
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                          alt={
                            item.merchandise.product.featuredImage.altText ||
                            item.merchandise.product.title
                          }
                          src={item.merchandise.product.featuredImage.url}
                        />
                      </div>

                      <div className="flex flex-2 flex-col text-base">
                        <span className="leading-tight text-sm ml-3 font-semibold">
                          {item.merchandise.product.title}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col text-base">
                        <span className="ml-1 flex justify-end space-y-2 text-right text-sm font-semibold">
                          {formattedPrice.format(
                            parseFloat(item.cost.totalAmount.amount)
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div className="mb-3 flex items-center justify-between border-neutral-200 pb-1 pt-1 dark:border-neutral-700 text-sm">
            <p>Subtotal</p>
            <span className="ml-1 inline text-right text-base text-black dark:text-white font-bold">
              {formattedPrice.format(subTotal)}
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between border-neutral-200 pb-1 pt-1 dark:border-neutral-700 text-sm">
            <p>Shipping</p>
            <p className="text-right">{subTotal < 100 ? "$10.00" : "FREE"}</p>
          </div>
          <div className="mb-3 flex items-center justify-between border-neutral-200 pb-1 pt-1 dark:border-neutral-700 text-sm">
            <p>Total</p>
            <span className="ml-1 inline text-right text-base text-black dark:text-white font-bold">
              {formattedPrice.format(total)}
            </span>
          </div>
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
          <h2 className="text-xl font-bold mt-8 mb-4">Delivery</h2>
          <AddressElement options={{ mode: "shipping" }} />
          <h2 className="text-xl font-bold mt-8 mb-4">Payment</h2>
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
