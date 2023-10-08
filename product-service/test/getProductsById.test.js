import { handler as getProductsById } from "../handlers/getProductsById.js";
import products from "../data/products.json";

describe("getProductsById", () => {
  it("should return a product by ID", async () => {
    const testProduct = products[0];
    const response = await
    getProductsById({ pathParameters: { id: testProduct.id } });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(testProduct);
  });

  it("should return a 404 error if the product is not found", async () => {
    const response = await
    getProductsById({ pathParameters: { id: "non-existent-id" } });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({ message: "Product not found" });
  });
});
