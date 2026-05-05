import { LambdaEvent } from "dynamodb-graph";
import { handler } from "../../../migration/animation/handler";
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoMock = mockClient(DynamoDBDocumentClient);

describe("Animation Handler Integration Test", () => {
    const DYNAMODB_TABLE = "TestTable";
    beforeAll(() => {
        // Set up environment variables required by the Lambda
        process.env.DYNAMODB_TABLE = DYNAMODB_TABLE;

        // Mock DynamoDB behavior
        dynamoMock.on(BatchWriteItemCommand).resolves({});

        dynamoMock.on(DescribeTableCommand).resolves({
            Table: { TableStatus: "ACTIVE" }
        });
    });

    afterEach(() => {
        dynamoMock.reset(); // Reset mocks after every test
    });

    it("should process animation nodes and batch insert them into DynamoDB", async () => {
        // Arrange
        const testEvent: LambdaEvent = {
            body: JSON.stringify([
                { name: "TestAnimation1", primaryPoseType: "POSE_1" },
                { name: "TestAnimation2", primaryPoseType: "POSE_2" },
            ]),
        };
        const mockService = {
            tableExists: jest.fn().mockResolvedValue(true),
            batchPutItems: jest.fn(),
        } as any;

        dynamoMock.on(BatchWriteItemCommand).resolves({});

        // Act
        const result = await handler(testEvent, mockService);

        // Assert
        expect(result?.statusCode).toBe(200);
        expect(mockService.batchPutItems).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the table does not exist", async () => {
        // Arrange
        dynamoMock.on(DescribeTableCommand).rejects(new Error("Table not found"));

        const mockService = {
            tableExists: jest.fn().mockResolvedValue(false),
            batchPutItems: jest.fn(),
        } as any;

        const testEvent: LambdaEvent = {
            body: JSON.stringify([]),
        };

        // Act
        const result = await handler(testEvent, mockService);

        // Assert
        expect(result?.statusCode).toBe(500);
        expect(result?.body).toContain("Table does not exist");
    });

    it("should return an error when the DynamoDB_TABLE environment variable is missing", async () => {
        // Remove the environment variable
        let value = process.env.DYNAMODB_TABLE;
        delete process.env.DYNAMODB_TABLE;

        const result = await handler({} as LambdaEvent);

        expect(result?.statusCode).toBe(500);
        expect(result?.body).toContain("DYNAMODB_TABLE environment variable is required.");

        process.env.DYNAMODB_TABLE = value;
    });
});