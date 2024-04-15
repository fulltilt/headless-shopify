import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./OrderInformation";
import { ShopifyCart } from "../api/shopify/types";

type PurchaseReceiptEmailProps = {
  cart: ShopifyCart;
  order: {
    id: string;
    createdAt: Date;
    pricePaidInCents: number;
  };
};

// PurchaseReceiptEmail.PreviewProps = {
//   product: {
//     title: "Product name",
//     description: "Some description",
//     imageSrc:
//       "/products/5aba7442-e4a5-4d2e-bfa7-5bd358cdad64-02 - What Is Next.js.jpg",
//     quantity: 1,
//   },
//   order: {
//     id: crypto.randomUUID(),
//     createdAt: new Date(),
//     pricePaidInCents: 10000,
//   },
// } satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  order,
  cart,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      {/* <Preview>Download {product.title} and view receipt</Preview> */}
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation order={order} cart={cart} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
