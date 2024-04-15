import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { removeItem, updateItemQuantity } from "./actions";
import { Cart, CartItem } from "@/app/api/shopify/types";
import { Dispatch, SetStateAction, useState } from "react";

type MerchandiseSearchParams = {
  [key: string]: string;
};

type CartSheetProps = {
  showSheet: boolean;
  setShowSheet: Dispatch<SetStateAction<boolean>>;
  cart: Cart;
  setCart: (cart: Cart) => void;
};

function EditItemQuantityButton({
  type,
  clickHandler,
}: {
  type: "plus" | "minus";
  clickHandler: () => void;
}) {
  return (
    <button
      onClick={clickHandler}
      className="'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80'"
    >
      {type === "plus" ? (
        <Plus className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <Minus className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export default function CartSheet({
  showSheet,
  setShowSheet,
  cart,
  setCart,
}: CartSheetProps) {
  const [pending, setPending] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const removeFromCart = async (item: CartItem) => {
    setPending(true);
    const data = await removeItem(item);
    setCart(data as Cart);
    setPending(false);
  };

  const updateQuantity = async (item: CartItem, type: string) => {
    const payload = {
      lineId: item.id,
      variantId: item.merchandise.id,
      quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
    };
    try {
      let data = await updateItemQuantity(payload);
      setCart(data as Cart);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>
          <div>
            {!cart || cart.lines.length === 0 ? (
              <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                <p className="mt-6 text-center text-2xl font-bold">
                  Your cart is empty.
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                <ul className="flex-grow overflow-auto py-4">
                  {cart &&
                    cart.lines.map((item, i) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }: { name: string; value: string }) => {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      );

                      const merchandiseUrl = `/product/${item.merchandise.product.handle}`;

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <button
                                className="ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200"
                                onClick={() => removeFromCart(item)}
                              >
                                {pending ? (
                                  <Loader2 className="mr-2 h-1 w-1 animate-spin" />
                                ) : (
                                  <X className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
                                )}
                              </button>
                            </div>
                            <Link
                              href={merchandiseUrl}
                              // onClick={closeCart}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      .altText || item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage.url
                                  }
                                />
                              </div>

                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item.merchandise.product.title}
                                </span>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                  {item.merchandise.title}
                                </p>
                              </div>
                            </Link>
                            <div className="flex h-16 flex-col justify-between">
                              <span className="ml-1 flex justify-end space-y-2 text-right text-sm">
                                ${item.cost.totalAmount.amount} USD
                              </span>

                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton
                                  type="minus"
                                  clickHandler={() =>
                                    updateQuantity(item, "minus")
                                  }
                                />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">
                                    {item.quantity}
                                  </span>
                                </p>
                                <EditItemQuantityButton
                                  type="plus"
                                  clickHandler={() =>
                                    updateQuantity(item, "plus")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {/* <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                    <p>Taxes</p>
                    <span className="ml-1 inline text-right text-base text-black dark:text-white">
                      {cart.cost.totalTaxAmount.amount}
                    </span>
                  </div> */}
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                    <p>Shipping</p>
                    <p className="text-right">Calculated at checkout</p>
                  </div>
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                    <p>Total</p>
                    <span className="ml-1 inline text-right text-base text-black dark:text-white">
                      {formattedPrice.format(
                        parseFloat(cart.cost.totalAmount.amount)
                      )}
                    </span>
                  </div>
                </div>
                <a
                  // href={cart.checkoutUrl}
                  href="/purchase"
                  className="block w-full rounded-full bg-black p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
                >
                  Proceed to Checkout
                </a>
              </div>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
