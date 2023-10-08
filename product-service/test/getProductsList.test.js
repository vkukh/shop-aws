import { handler as getProductsList } from "../handlers/getProductsList.js";
import products from "../data/products.json";

describe("getProductsList", () => {
  it("should return a list of all products", async () => {
    const response = await getProductsList();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(products);
  });
});
