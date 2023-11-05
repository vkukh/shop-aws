import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const { PRODUCTS_TABLE, STOCKS_TABLE, SNS_ARN } = process.env;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

export async function catalogBatchProcess(event) {
  console.log("catalogBatchProcess triggered with event:", event);

  if (!event.Records || event.Records.length === 0) {
    console.warn("No records to process");
    return;
  }

  for (const record of event.Records) {
    const data = JSON.parse(record.body);

    console.log("Processing record data from SQS:", data);

    const params = {
      TableName: PRODUCTS_TABLE,
      Item: {
        id: data.id,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        count: Number(data.count),
      },
    };

    await dynamoDb.put(params).promise();

    const stockParams = {
      TableName: STOCKS_TABLE,
      Item: {
        id: uuidv4(),
        product_id: data.id,
        count: Number(data.count),
      },
    };

    await dynamoDb.put(stockParams).promise();

    const snsParams = {
      Message: `Product "${data.title}" has been created.`,
      Subject: 'New product created',
      TopicArn: SNS_ARN,
      MessageAttributes: {
        price: {
          DataType: 'Number',
          StringValue: data.price.toString(),
        },
      },
    };
    await sns.publish(snsParams).promise();
  }
}

export { catalogBatchProcess as handler };
