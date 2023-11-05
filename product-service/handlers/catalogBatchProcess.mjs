import AWS from 'aws-sdk';

const { PRODUCTS_TABLE, STOCKS_TABLE, SNS_ARN } = process.env;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

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

    // Send SNS notification
    const snsParams = {
      Message: `Product "${data.title}" has been created.`,
      Subject: 'New product created',
      TopicArn: SNS_ARN,
    };
    await sns.publish(snsParams).promise();
  }
}

export { catalogBatchProcess as handler };
