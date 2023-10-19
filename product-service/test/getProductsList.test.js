import { dynamoDb } from "../handlers/dynamoDb.js";
import { handler as getProductsList } from "../handlers/getProductsList.mjs";
import products from "../data/products.mjs";

describe("getProductsList", () => {
  it("should return a list of all products", async () => {
    dynamoDb.scan = jest
      .fn()
      .mockReturnValueOnce({ promise: () => Promise.resolve({ Items: products }) });

    const response = await getProductsList();

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(products);
  });
});
