import AWSMock from "aws-sdk-mock";
import { expect } from "chai";

import { handler as importProductsFileHandler } from "../handlers/importProductsFile.mjs";

describe("importProductsFile", () => {
  it("should return a signed URL", async () => {
    const mockSignedUrl = "https://example.com/signed-url";
    const mockFileKey = "test.csv";
    AWSMock.mock(
      "S3",
      "getSignedUrl",
      (operation, params, callback) => {
        if (
          operation === "putObject" &&
          params.Bucket === process.env.BUCKET_NAME &&
          params.Key === `uploaded/${mockFileKey}` &&
          params.Expires === 60 * 5 &&
          params.ContentType === "text/csv"
        ) {
          callback(null, mockSignedUrl);
        } else {
          callback(new Error("Invalid S3 request parameters"));
        }
      }
    );

    const event = {
      queryStringParameters: {
        name: mockFileKey,
      },
    };

    const result = await importProductsFileHandler(event);
    expect(result).to.deep.equal({
      statusCode: 200,
      body: JSON.stringify({ url: mockSignedUrl }),
    });

    AWSMock.restore("S3");
  });
});