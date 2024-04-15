"use client";

import { ProductCardProps } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { addItem } from "@/components/cart/actions";
import { Cart } from "@/app/api/shopify/types";
import CartSheet from "@/components/cart/CartSheet";

export function ProductPage({ product }: { product: ProductCardProps }) {
  const [pending, setPending] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [cart, setCart] = useState<Cart>();

  useEffect(() => {
    if (cart) {
      setShowSheet(true);
    }
  }, [cart]);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setPending(true);

    try {
      const data = await addItem(product);
      setCart(data as Cart);
    } catch (err) {
      console.log(err);
    }
    setPending(false);
  };

  return (
    <>
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
      {cart && (
        <CartSheet
          showSheet={showSheet}
          setShowSheet={setShowSheet}
          cart={cart}
          setCart={setCart}
        />
      )}
    </>
  );
}
