import AWS from 'aws-sdk';

const importProductsFile = async (event) => {
  console.log("importProductsFile was called with event: ", event);
  const fileName = event.queryStringParameters.name;
  const filePath = `uploaded/${fileName}`;
  
  const s3 = new AWS.S3({ region: process.env.REGION });

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filePath,
    Expires: 60 * 5,
    ContentType: "text/csv",
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);

  return {
    statusCode: 200,
    body: JSON.stringify({ url: signedUrl }),
  };
};

export { importProductsFile as handler };