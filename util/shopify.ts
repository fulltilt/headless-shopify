type Params = {
  query: string;
  variables: object;
};

export const postToShopify = async ({ query, variables = {} }: Params) => {
  try {
    const result = await fetch(process.env.SHOPIFY_API_ENDPOINT as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env
          .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json());

    if (result.errors) {
      console.log({ errors: result.errors });
    } else if (!result || !result.data) {
      console.log({ result });
      return "No results found.";
    }

    return result.data;
  } catch (error) {
    console.log(error);
  }
};
