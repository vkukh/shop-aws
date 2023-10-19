import { dynamoDb } from "../handlers/dynamoDb.js";
import { handler as getProductsList } from "../handlers/getProductsList.mjs";

const products = [
  {
    "description": "Short Product Description1",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "price": 2.4,
    "title": "IPhone 15"
  }
];
const stocks = [
{
  "id": "107e6461-e426-48d6-b831-df2f33df48bc",
  "product_id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  "count": 12
}
];

describe("getProductsList", () => {
  it("should return a list of all products", async () => {
    dynamoDb.scan = jest
      .fn()
      .mockReturnValueOnce({ promise: () => Promise.resolve({ Items: products })})
      .mockReturnValueOnce({ promise: () => Promise.resolve({ Items: stocks })});

    const response = await getProductsList();

    const expectedProducts = [
      {
        "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        "title": "IPhone 15",
        "description": "Short Product Description1",
        "price": 2.4,
        "count": 12
      }
    ];

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expectedProducts);
  });
});
