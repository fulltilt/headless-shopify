/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as AdminTypes from './admin.types.d.ts';

export type GetProductListQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetProductListQuery = { products: { edges: Array<{ node: (
        Pick<AdminTypes.Product, 'id' | 'handle' | 'description' | 'title' | 'totalInventory'>
        & { variants: { edges: Array<{ node: Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'inventoryQuantity' | 'price'> }> }, priceRange: { maxVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>, minVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, images: { edges: Array<{ node: Pick<AdminTypes.Image, 'src' | 'altText'> }> } }
      ) }> } };

interface GeneratedQueryTypes {
  "\n      #graphql\n      query getProductList {\n        products(sortKey: CREATED_AT, first: 100, reverse: true) {\n          edges {\n            node {\n              id\n              handle\n              description\n              title\n              totalInventory\n              variants(first: 5) {\n                edges {\n                  node {\n                    id\n                    title\n                    inventoryQuantity\n                    price\n                  }\n                }\n              }\n              priceRange {\n                maxVariantPrice {\n                  amount\n                  currencyCode\n                }\n                minVariantPrice {\n                  amount\n                  currencyCode\n                }\n              }\n              images(first: 1) {\n                edges {\n                  node {\n                    src\n                    altText\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    ": {return: GetProductListQuery, variables: GetProductListQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
