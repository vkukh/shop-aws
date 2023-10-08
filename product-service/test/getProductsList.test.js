import { handler as getProductsList } from "../handlers/getProductsList.mjs";
import products from "../data/products.js";

describe("getProductsList", () => {
  it("should return a list of all products", async () => {
    const response = await getProductsList();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(products);
  });
});
