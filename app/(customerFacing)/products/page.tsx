import { getProducts } from "@/app/api/route";
import { ProductCardProps } from "@/app/types";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductSuspense />
      </Suspense>
    </div>
  );
}

async function ProductSuspense() {
  return (await getProducts("CREATED_AT", 100)).map(
    (product: ProductCardProps) => (
      <ProductCard key={product.slug} {...product} />
    )
  );
}

// const ProductSuspense = cache(
//     async () => {
//       return (await getProducts("CREATED_AT", 100)).map(
//         (product: ProductCardProps) => (
//           <ProductCard key={product.id} {...product} />
//         )
//       );
//     },
//     ["/products", "ProductSuspense"],
//     { revalidate: 60 * 60 * 24 }
//   );
