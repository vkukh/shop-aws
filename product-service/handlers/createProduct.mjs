import { v4 as uuidv4 } from "uuid";

import { dynamoDb } from './dynamoDb.js';

const { PRODUCTS_TABLE } = process.env;

const createProduct = async (event) => {
  const productData = JSON.parse(event.body);

  if (
    !productData.title ||
    typeof productData.title !== "string" ||
    !productData.description ||
    typeof productData.description !== "string" ||
    !(typeof productData.price === "number" && productData.price >= 0)
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid product data" }),
    };
  }

  const params = {
    TableName: PRODUCTS_TABLE,
    Item: {
      ...productData,
      id: uuidv4(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    const errorMessage = error.message || 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  };
};

export { createProduct as handler };
