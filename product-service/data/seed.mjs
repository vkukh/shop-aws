
import products from './products.mjs';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({ region: 'eu-west-1' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();


const productsData = products.map(({ id, description, price, title }) => ({
  id,
  description,
  price,
  title,
}));

const stocksData = products.map(({ id, count }) => ({
  id: uuidv4(),
  product_id: id,
  count,
}));

const putRecords = (tableName, records) => {
  const putPromises = records.map((record) => {
    const params = {
      TableName: tableName,
      Item: record,
    };
    return dynamoDB.put(params).promise();
  });

  return Promise.all(putPromises);
};

(async () => {
  try {
    await putRecords('products', productsData);
    console.log('Inserted products data');
  } catch (error) {
    console.error('Error inserting products data', error);
  }

  try {
    await putRecords('stocks', stocksData);
    console.log('Inserted stocks data');
  } catch (error) {
    console.error('Error inserting stocks data', error);
  }
})();
