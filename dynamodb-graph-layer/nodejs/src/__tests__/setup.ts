// jest.setup.ts
import { jest } from '@jest/globals';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Mock DynamoDB client
jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  PutItemCommand: jest.fn(),
  TransactWriteItemsCommand: jest.fn(),
  GetItemCommand: jest.fn(),
  QueryCommand: jest.fn(),
  ScanCommand: jest.fn(),
  CreateTableCommand: jest.fn(),
}));

// Set test environment variables
process.env.DYNAMODB_TABLE = 'test-table';
process.env.AWS_REGION = 'us-east-1';
process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';