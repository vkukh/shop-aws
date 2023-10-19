import AWS from 'aws-sdk';

export const dynamoDb = new AWS.DynamoDB.DocumentClient();
