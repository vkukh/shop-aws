import AWS from 'aws-sdk';

import  { handler as getProductsById } from '../handlers/getProductsById.mjs'; 

describe('getProductsById', () => {
  it('should return the product with stock count', async () => {
    const product = { id: '1', name: 'Product 1' };
    const stock = { product_id: '1', count: 10 };

    const mockDynamoDb = {
      get: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({ Item: product }) }),
      query: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({ Items: [stock] }) }),
    };

    AWS.DynamoDB.DocumentClient = jest.fn(() => mockDynamoDb);

    const event = { pathParameters: { id: '1' } };

    const result = await getProductsById(event);

    expect(result.statusCode).toBe(200);

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ ...product, count: stock.count }),
    };
    expect(result).toEqual(expectedResponse);

    expect(mockDynamoDb.get).toHaveBeenCalledWith({
      TableName: 'YourProductsTableName',
      Key: { id: '1' },
    });

    expect(mockDynamoDb.query).toHaveBeenCalledWith({
      TableName: 'YourStocksTableName',
      IndexName: 'ProductIndex',
      KeyConditionExpression: 'product_id = :id',
      ExpressionAttributeValues: {
        ':id': '1',
      },
    });
  });

  it('should return an error response when the product is not found', async () => {
    const mockDynamoDb = {
      get: jest.fn().mockReturnValue({ promise: jest.fn().mockRejectedValue(new Error('Product not found')) }),
    };

    AWS.DynamoDB.DocumentClient = jest.fn(() => mockDynamoDb);

    const event = { pathParameters: { id: '1' } };

    const result = await getProductsById(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Cannot get product with the given ID' });

    expect(mockDynamoDb.get).toHaveBeenCalledWith({
      TableName: 'YourProductsTableName',
      Key: { id: '1' },
    });
  });
});
