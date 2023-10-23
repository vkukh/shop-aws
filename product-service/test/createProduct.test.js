import { dynamoDb } from '../handlers/dynamoDb.js';
import { handler as createProduct } from '../handlers/createProduct.mjs';

jest.mock('../handlers/dynamoDb.js', () => ({
  dynamoDb: {
    put: jest.fn(),
  },
}));

describe('createProduct', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create and return a new product', async () => {
    const productData = {
      title: 'Test Product',
      description: 'Test Description',
      price: 9.99,
    };

    const eventData = {
      body: JSON.stringify(productData),
    };

    const expectedProductData = {
      ...productData,
      id: expect.any(String),
    };

    dynamoDb.put.mockReturnValue({ promise: () => Promise.resolve() });

    const response = await createProduct(eventData);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual(expectedProductData);
    expect(dynamoDb.put).toHaveBeenCalledWith(
      expect.objectContaining({
        Item: expectedProductData,
      })
    );
  });

  it('should return an error for invalid product data', async () => {
    const eventData = {
      body: JSON.stringify({
        title: 'Missing required fields',
      }),
    };

    const response = await createProduct(eventData);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Invalid product data',
    });
  });

  it('should return a server error on DynamoDB failure', async () => {
    const productData = {
      title: 'Test Product',
      description: 'Test Description',
      price: 9.99,
    };

    const eventData = {
      body: JSON.stringify(productData),
    };

    dynamoDb.put.mockReturnValue({
      promise: () => Promise.reject(new Error('Database error')),
    });

    const response = await createProduct(eventData);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: 'Database error' });
  });
});
