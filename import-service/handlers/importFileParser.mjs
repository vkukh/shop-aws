import aws from 'aws-sdk';
import { S3, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';

const REGION = 'eu-west-1';
const s3 = new S3({ region: REGION });
const sqs = new aws.SQS({ region: REGION });

const importFileParser = async (event) => {
  const s3v2 = new aws.S3({ region: REGION });

  const record = event.Records[0];
  const s3ObjectKey = record.s3.object.key;

  console.log(`Processing file: ${s3ObjectKey}`);

  try {
    // Read the CSV file from S3 as a stream
    const s3Stream = s3v2.getObject({
      Bucket: record.s3.bucket.name,
      Key: s3ObjectKey,
    }).createReadStream();

    // Process CSV records using the `csv-parser` package and send each record to SQS
    const parserStream = s3Stream.pipe(csvParser());
    parserStream.on('data', async (record) => {
      // Convert price and count to numbers
      const data = {
        id: record.id,
        title: record.title,
        description: record.description,
        price: Number(record.price),
        count: Number(record.count),
      };

      console.log('Sending record to SQS:', data);

      await sqs.sendMessage({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: JSON.stringify(data),
      }).promise();
    });

    // Wait for the stream to end
    await new Promise((resolve, reject) => {
      parserStream.on('end', resolve);
      parserStream.on('error', reject);
    });

    // Move file to the "processed" folder
    const copyParams = {
      Bucket: record.s3.bucket.name,
      CopySource: `${record.s3.bucket.name}/${s3ObjectKey}`,
      Key: s3ObjectKey.replace('uploaded', 'parsed'),
    };
    await s3.send(new CopyObjectCommand(copyParams));

    // Delete the original file
    const deleteParams = {
      Bucket: record.s3.bucket.name,
      Key: s3ObjectKey,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error('Error while processing file:', error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'File processed successfully',
      },
      null,
      2
    ),
  };
};

export { importFileParser as handler };
