import {
    DynamoDBClient,
    CreateTableCommand,
    DeleteTableCommand,
    DescribeTableCommand,
    DynamoDBClientConfig
} from "@aws-sdk/client-dynamodb";
const tableName =
    process.env.DYNAMODB_TABLE ||
    `TestGraphTable-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function createTestEnv(testName: string) {
    const tableName = `TestGraphTable_${testName}_${Date.now()}`;

    const client = new DynamoDBClient();

    async function createTable() {
        await client.send(
            new CreateTableCommand({
                TableName: tableName,
                KeySchema: [
                    { AttributeName: "PK", KeyType: "HASH" },
                    { AttributeName: "SK", KeyType: "RANGE" }
                ],
                AttributeDefinitions: [
                    { AttributeName: "PK", AttributeType: "S" },
                    { AttributeName: "SK", AttributeType: "S" },
                    { AttributeName: "entityType", AttributeType: "S" }
                ],
                GlobalSecondaryIndexes: [
                    {
                        IndexName: "GSI1-EntityType",
                        KeySchema: [
                            { AttributeName: "entityType", KeyType: "HASH" }
                        ],
                        Projection: { ProjectionType: "ALL" }
                    }
                ],
                BillingMode: "PAY_PER_REQUEST"
            })
        );

        await waitForActive();
    }

    async function waitForActive() {
        for (let i = 0; i < 30; i++) {
            const res = await client.send(
                new DescribeTableCommand({ TableName: tableName })
            );

            if (res.Table?.TableStatus === "ACTIVE") return;
            await new Promise(r => setTimeout(r, 300));
        }

        throw new Error("Table creation timeout");
    }

    async function destroy() {
        await client.send(
            new DeleteTableCommand({ TableName: tableName })
        );
    }

    return {
        tableName,
        createTable,
        destroy
    };
}