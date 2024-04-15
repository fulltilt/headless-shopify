import { Column, Img, Row, Section, Text } from "@react-email/components";
import { ShopifyCart } from "../api/shopify/types";

type OrderInformationProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  cart: ShopifyCart;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export function OrderInformation({ order, cart }: OrderInformationProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Order ID
            </Text>
            <Text className="mt-0 mr-4">{order.id}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Purchased On
            </Text>
            <Text className="mt-0 mr-4">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Price Paid
            </Text>
            <Text className="mt-0 mr-4">
              {formattedPrice.format(parseFloat(cart.cost.totalAmount.amount))}
            </Text>
          </Column>
        </Row>
      </Section>
      {cart.lines.edges.map((product) => (
        <Section key={product.node.id} className="p-4 md:p-6 my-4">
          <div className="flex items-center justify-center">
            <Img
              width="50%"
              alt={product.node.merchandise.product.title}
              src={product.node.merchandise.product.featuredImage.url}
            />
          </div>
          <Row className="mt-8">
            <Column className="align-bottom">
              <Text className="text-lg font-bold m-0 mr-4">
                {product.node.merchandise.product.title}
              </Text>
            </Column>
            <Column align="right">
              <Text className="text-lg font-bold m-0 mr-4">
                {product.node.quantity} @
                {formattedPrice.format(
                  parseFloat(
                    product.node.merchandise.product.priceRange.maxVariantPrice
                      .amount
                  )
                )}
              </Text>
            </Column>
          </Row>
        </Section>
      ))}
    </>
  );
}
