import { notFound } from "next/navigation";
import { ProductPage } from "./ProductPage";
import getProduct from "@/app/api/getProduct";
import { ProductCardProps } from "@/app/types";

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product: ProductCardProps = await getProduct(id);

  if (product == null) return notFound();

  return <ProductPage product={product} />;
}
