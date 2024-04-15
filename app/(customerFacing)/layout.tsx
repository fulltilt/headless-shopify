import { Nav } from "@/components/Nav";
import { getCartAction } from "@/components/cart/actions";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let cartId = cookies().get("cartId")?.value;
  if (!cartId) return null;
  let cart = await getCartAction(cartId);

  return (
    <>
      <Nav navCart={cart} />
      <div className="container my-6">{children}</div>
    </>
  );
}
