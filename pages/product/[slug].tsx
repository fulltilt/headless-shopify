import Head from "next/head";
import Link from "next/link";
import { Product } from "@/app/types/admin.types";
import { ProductCardProps } from "@/app/types";
import ProductCard from "@/components/ProductCard";

export async function getStaticPaths() {
  const url = new URL(process.env.URL as string);
  url.pathname = "/api/products";

  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error(res);
    return { props: {} };
  }

  const data = await res.json();

  return {
    paths: data.products.edges.map(
      ({ node }: { node: Product }) => `/product/${node.handle}`
    ),
    fallback: true,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const url = new URL(process.env.URL || "http://localhost:3000");
  url.pathname = "/api/products";

  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error(res);
    return { props: {} };
  }

  const data = await res.json();
  const product = data.products.edges
    .map(({ node }: { node: Product }) => {
      if (node.totalInventory <= 0) {
        return false;
      }

      return {
        id: node.id,
        title: node.title,
        description: node.description,
        imageSrc: node.images.edges?.[0]?.node.url || "",
        imageAlt: node.title,
        price: node.variants.edges?.[0]?.node.price,
        slug: node.handle,
      };
    })
    .find(({ slug }: { slug: string }) => slug === params.slug);

  return {
    props: { product },
  };
}

export default function ProductPage({
  product,
}: {
  product: ProductCardProps;
}) {
  console.log("product", product);
  return (
    <div>
      <Head>
        <title>Dee Jays Collectibles</title>
        <meta
          name="description"
          content="Jason has so many ducks. Please help."
        />
      </Head>

      <main>
        <h1>Store</h1>

        <Link href="/">&larr; back home</Link>

        <div>
          <ProductCard {...product} />
        </div>
      </main>
    </div>
  );
}
