import dotenv from 'dotenv';
import { Readable } from "stream";
import { S3 } from '@aws-sdk/client-s3';
import sinon from "sinon";
import { expect } from "chai";
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import { handler as importFileParserHandler } from "../handlers/importFileParser.mjs";
dotenv.config();

const { BUCKET_NAME_ENV } = process.env;

describe("importFileParser", () => {
  let sendStub;
  let consoleLogSpy;

  beforeEach(() => {
    process.env.AWS_REGION = "eu-west-1";

    sendStub = sinon.stub(S3.prototype, 'send').callsFake(async function (command) {
      if (command instanceof GetObjectCommand) {
        const sampleCsvStream = Readable.from(
          "id,name,description\n1,product1,description1\n2,product2,description2"
        );
        return { Body: sampleCsvStream };
      } else if (command instanceof CopyObjectCommand || command instanceof DeleteObjectCommand) {
        return {};
      }
    });

    consoleLogSpy = sinon.spy();
    sinon.replace(console, "log", consoleLogSpy);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should process the file and return a success message", async () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: BUCKET_NAME_ENV,
            },
            object: {
              key: 'parsed/example.csv',
            },
          },
        },
      ],
    };

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

    for (const call of consoleLogSpy.getCalls()) {
      if (call.args[0].startsWith("Parsed record:")) {
        const record = call.args[1];
        expect(record).to.deep.include(expectedRecords.shift());
      }
    }
  });
});
