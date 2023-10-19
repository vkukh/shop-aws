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
    console.log(stockRes)
    const stock = stockRes.Items && stockRes.Items[0];

    if (!stock) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Product not found' }),
      };
    }

    const responseProduct = { ...product, count: stock.count };

    return {
      statusCode: 200,
      body: JSON.stringify(responseProduct),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

export { getProductsById as handler };
