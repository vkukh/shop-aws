import products from "../data/products.json" assert { type: "json" };

const getProductsById = async (event) => {
  const { id } = event.pathParameters;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Product not found" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(product),
  };
};

export { getProductsById as handler };
