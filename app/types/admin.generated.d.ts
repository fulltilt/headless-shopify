/* eslint-disable */
import * as AdminTypes from "./admin.types.d.ts";

export type GetProductListQueryVariables = AdminTypes.Exact<{
  sortKey: AdminTypes.ProductSortKeys;
}>;

export type GetProductListQuery = {
  products: {
    edges: Array<{
      node: Pick<
        AdminTypes.Product,
        "id" | "handle" | "description" | "title" | "totalInventory"
      > & {
        variants: {
          edges: Array<{
            node: Pick<AdminTypes.ProductVariant, "id" | "title" | "price">;
          }>;
        };
        priceRange: {
          maxVariantPrice: Pick<AdminTypes.MoneyV2, "amount" | "currencyCode">;
          minVariantPrice: Pick<AdminTypes.MoneyV2, "amount" | "currencyCode">;
        };
        images: { edges: Array<{ node: Pick<AdminTypes.Image, "url"> }> };
      };
    }>;
  };
};

interface GeneratedQueryTypes {
  "\n      #graphql\n      query getProductList($sortKey: ProductSortKeys!) {\n        products(sortKey: $sortKey, first: 100, reverse: true) {\n          edges {\n            node {\n              id\n              handle\n              description\n              title\n              totalInventory\n              variants(first: 5) {\n                edges {\n                  node {\n                    id\n                    title\n                    price\n                  }\n                }\n              }\n              priceRange {\n                maxVariantPrice {\n                  amount\n                  currencyCode\n                }\n                minVariantPrice {\n                  amount\n                  currencyCode\n                }\n              }\n              images(first: 1) {\n                edges {\n                  node {\n                    url\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    ": {
    return: GetProductListQuery;
    variables: GetProductListQueryVariables;
  };
}

interface GeneratedMutationTypes {}
declare module "@shopify/admin-api-client" {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
