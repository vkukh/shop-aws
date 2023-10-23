import { dynamoDb } from './dynamoDb.js';

const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

const getProductsById = async (event) => {
  const { id } = event.pathParameters;

  try {
    const productRes = await dynamoDb
      .get({
        TableName: PRODUCTS_TABLE,
        Key: { id },
      })
      .promise();

    const product = productRes.Item;

    const stockRes = await dynamoDb
      .query({
        TableName: STOCKS_TABLE,
        IndexName: 'ProductIndex',
        KeyConditionExpression: 'product_id = :id',
        ExpressionAttributeValues: {
          ':id': id,
        },
      })
      .promise();

    const stock = stockRes.Items && stockRes.Items[0];

    if (!stock || !product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not found' }),
      };
    }

    const responseProduct = { ...product, count: stock.count };

    return {
      statusCode: 200,
      body: JSON.stringify(responseProduct),
    };
  } catch (error) {
    console.log("Error in getProductsById:", error);
    const errorMessage = error.message || 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { getProductsById as handler };
