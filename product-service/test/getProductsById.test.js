import dotenv from 'dotenv';
dotenv.config();

import AWS from 'aws-sdk';
import { handler as getProductsById } from '../handlers/getProductsById.mjs';

jest.mock('aws-sdk');

const { DynamoDB: { DocumentClient } } = AWS;
const documentClient = new DocumentClient();

const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
console.log("Debug in getProductsById.test.js: ", { PRODUCTS_TABLE, STOCKS_TABLE });

describe('getProductsById', () => {
  it('should return the product with stock count', async () => {
    const product = { id: '1', name: 'Product 1' };
    const stock = { product_id: '1', count: 10 };

    documentClient.get = jest.fn().mockReturnValue({ promise: () => Promise.resolve({ Item: product }) });
    documentClient.query = jest.fn().mockReturnValue({ promise: () => Promise.resolve({ Items: [stock] }) });

    const event = { pathParameters: { id: '1' } };

    const result = await getProductsById(event);

    expect(result.statusCode).toBe(200);

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ ...product, count: stock.count }),
    };
    expect(result).toEqual(expectedResponse);

    expect(documentClient.get).toHaveBeenCalledWith({
      TableName: PRODUCTS_TABLE,
      Key: { id: '1' },
    });

    expect(documentClient.query).toHaveBeenCalledWith({
      TableName: STOCKS_TABLE,
      IndexName: 'ProductIndex',
      KeyConditionExpression: 'product_id = :id',
      ExpressionAttributeValues: {
        ':id': '1',
      },
    });
  });

  it('should return an error response when the product is not found', async () => {
    documentClient.get = jest.fn().mockReturnValue({ promise: () => Promise.reject(new Error('Product not found')) });

    const event = { pathParameters: { id: '1' } };

    const result = await getProductsById(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBeTruthy();

    expect(documentClient.get).toHaveBeenCalledWith({
      TableName: PRODUCTS_TABLE,
      Key: { id: '1' },
    });
  });
});
