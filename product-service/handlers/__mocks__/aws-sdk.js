const getMock = jest.fn();
const queryMock = jest.fn();
const scanMock = jest.fn();

const mockDynamoDB = {
  get: () => ({ promise: getMock }),
  query: () => ({ promise: queryMock }),
  scan: () => ({ promise: scanMock }),
};

const AWS = {
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => mockDynamoDB),
  },
};

export default AWS;
