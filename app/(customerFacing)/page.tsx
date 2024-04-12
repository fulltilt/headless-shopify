import Head from "next/head";
import Link from "next/link";
import { getCustomer, getProducts } from "../api/route";
import { ProductCardProps } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";
import { cache } from "@/util/cache";

function ProductGridSection({ title }: { title: String }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense title={title} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({ title }: { title: String }) {
  const test = await getCustomer("dave.doria@gmail.com");

  return (
    await getProducts(
      title === "Most Popular" ? "BEST_SELLING" : "CREATED_AT",
      3
    )
  ).map((product: ProductCardProps) => {
    const arr = product.id.split("/");
    let id = arr[arr.length - 1];
    return <ProductCard key={id} {...product} id={id} />;
  });
}

// const ProductSuspense = cache(
//     async ({ title }: { title: String }) => {
//       return (
//         await getProducts(
//           title === "Most Popular" ? "BEST_SELLING" : "CREATED_AT",
//           3
//         )
//       ).map((product: ProductCardProps) => (
//         <ProductCard key={product.id} {...product} />
//       ));
//     },
//     ["/", "ProductSuspense"],
//     { revalidate: 60 * 60 * 24 }
//   );

export default async function Home() {
  return (
    <div>
      <Head>
        <title>Dee Jays Collectibles</title>
        <meta name="description" content="" />
      </Head>

      <main className="space-y-12">
        <ProductGridSection title="Most Popular" />
        <ProductGridSection title="Newest" />
      </main>
    </div>
  );
}
