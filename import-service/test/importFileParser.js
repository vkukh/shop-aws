const AWSMock = require("aws-sdk-mock");
const { expect } = require("chai");
const sinon = require("sinon");
const { Readable } = require("stream");
const AWS = require("aws-sdk");

const { handler: importFileParserHandler } = require("./importFileParser");

describe("importFileParser", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore();
    sinon.restore();
  });

  it("should process the file and return a success message", async () => {
    const sampleCsvStream = Readable.from(
      "id,name,description\n1,product1,description1\n2,product2,description2"
    );

    AWSMock.mock("S3", "getObject", (params, callback) => {
      callback(null, {
        Body: sampleCsvStream,
        ContentType: "text/csv",
        ContentLength: sampleCsvStream.length,
        Bucket: params.Bucket,
        Key: params.Key,
      });
    });

    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: "test-bucket",
            },
            object: {
              key: "uploaded/sample.csv",
            },
          },
        },
      ],
    };

    const logSpy = sinon.spy();
    sinon.replace(console, "log", logSpy);

    const result = await importFileParserHandler(event);
    expect(result).to.deep.equal({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "File processed successfully",
        },
        null,
        2
      ),
    });

    const expectedRecords = [
      { id: "1", name: "product1", description: "description1" },
      { id: "2", name: "product2", description: "description2" },
    ];

    for (const [, record] of logSpy.getCalls()) {
      expect(record).to.deep.include(expectedRecords.shift());
    }
  });
});
