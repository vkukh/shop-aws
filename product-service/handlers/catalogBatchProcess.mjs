import AWS from 'aws-sdk';

const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function catalogBatchProcess(event) {
  for (const record of event.Records) {
    const data = JSON.parse(record.body);

    const params = {
      TableName: PRODUCTS_TABLE,
      Item: {
        ...data,
      },
    };

    await dynamoDb.put(params).promise();

    const stockParams = {
      TableName: STOCKS_TABLE,
      Item: {
        product_id: data.id,
        count: data.count,
      },
    };

    await dynamoDb.put(stockParams).promise();
  }
}

export { catalogBatchProcess as handler };
