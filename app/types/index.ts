export type ProductCardProps = {
  id: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  price: {
    amount: string;
    currencyCode: string;
  };
};
