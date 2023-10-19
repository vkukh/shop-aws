const mockDynamoDB = {
  scan: () => ({
    promise: jest.fn().mockResolvedValue({ Items: [] }),
  }),
};

const AWS = {
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => mockDynamoDB),
  },
};

export default AWS;
