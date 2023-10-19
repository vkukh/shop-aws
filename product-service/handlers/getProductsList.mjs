import AWS from 'aws-sdk';

const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getProductsList = async (event) => {
  const productsResponse = await dynamoDB
    .scan({ TableName: PRODUCTS_TABLE })
    .promise();
  const stocksResponse = await dynamoDB
    .scan({ TableName: STOCKS_TABLE })
    .promise();

  const products = productsResponse.Items;
  const stocks = stocksResponse.Items;

  const productList = products.map((product) => {
    const productStock = stocks.find(
      (stock) => stock.product_id === product.id
    );

    return {
      ...product,
      count: productStock ? productStock.count : 0,
    };
  });

  return {
    statusCode: 200,
    body: JSON.stringify(productList),
  };
};

export { getProductsList as handler };
