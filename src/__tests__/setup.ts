process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';
process.env.AWS_REGION = 'us-east-1';
process.env.DYNAMODB_TABLE = 'TestGraphTable';
process.env.AWS_ACCESS_KEY_ID = 'dummy';
process.env.AWS_SECRET_ACCESS_KEY = 'dummy';
process.env.AWS_SDK_LOAD_CONFIG = '0';

const tableName =
    process.env.DYNAMODB_TABLE ||
    `TestGraphTable-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";