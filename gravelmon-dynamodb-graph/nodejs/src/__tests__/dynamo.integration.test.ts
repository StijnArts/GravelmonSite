import { DynamoDBClient, CreateTableCommand, DeleteTableCommand, DescribeTableCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoNode, DynamoEdge,} from "../dynamodb-graph/service/dynamoNodes";
import { DynamoGraphService } from "../dynamodb-graph/service/dynamoGraphService";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    }
});

const tableName = process.env.DYNAMODB_TABLE || "TestGraphTable";

const service = new DynamoGraphService(client, tableName);

async function waitForDynamoDB(maxRetries: number = 10): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await client.send(new ScanCommand({ TableName: "nonexistent", Limit: 1 }));
            return; // If we get here, DynamoDB is responding
        } catch (error: any) {
            if (error.name === 'ResourceNotFoundException') {
                return; // DynamoDB is responding (table doesn't exist, but that's expected)
            }
            console.log(`Waiting for DynamoDB... attempt ${i + 1}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    throw new Error('DynamoDB did not become ready within the timeout period');
}

describe("DynamoDB Graph Integration Tests", () => {
    beforeAll(async () => {
        // Wait for DynamoDB to be ready
        await waitForDynamoDB();

        // Create table if it doesn't exist
        try {
            await client.send(new DescribeTableCommand({ TableName: tableName }));
        } catch (error: any) {
            if (error.name === 'ResourceNotFoundException') {
                await client.send(new CreateTableCommand({
                    TableName: tableName,
                    KeySchema: [
                        { AttributeName: "PK", KeyType: "HASH" },
                        { AttributeName: "SK", KeyType: "RANGE" }
                    ],
                    AttributeDefinitions: [
                        { AttributeName: "PK", AttributeType: "S" },
                        { AttributeName: "SK", AttributeType: "S" }
                    ],
                    BillingMode: "PAY_PER_REQUEST"
                }));
                // Wait for table to be active
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }, 30000);

    afterAll(async () => {
        // Clean up table
        try {
            await client.send(new DeleteTableCommand({ TableName: tableName }));
        } catch (error) {
            console.warn("Failed to delete table:", error);
        }
    });

    test("should create edge in database and query", async () => {
        // Clear all items by recreating table
        try {
            await client.send(new DeleteTableCommand({ TableName: tableName }));
            await client.send(new CreateTableCommand({
                TableName: tableName,
                KeySchema: [
                    { AttributeName: "PK", KeyType: "HASH" },
                    { AttributeName: "SK", KeyType: "RANGE" }
                ],
                AttributeDefinitions: [
                    { AttributeName: "PK", AttributeType: "S" },
                    { AttributeName: "SK", AttributeType: "S" }
                ],
                BillingMode: "PAY_PER_REQUEST"
            }));
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            // Ignore if table doesn't exist
        }

        // Create nodes
        const pikachu = new DynamoNode("Pokemon", "Pikachu");
        const raichu = new DynamoNode("Pokemon", "Raichu");
        await service.createNode(pikachu, tableName);
        await service.createNode(raichu, tableName);

        // Create edge
        const edge = new DynamoEdge("NODE#Pokemon#Pikachu", "evolves_to", "Pokemon", "Raichu");
        await service.createEdge(edge, tableName);

        // Test getNode
        const retrievedPikachu = await service.getNode("NODE#Pokemon#Pikachu", tableName);
        expect(retrievedPikachu).not.toBeNull();
        expect(retrievedPikachu!.name).toBe("Pikachu");
        expect(retrievedPikachu!.entityType).toBe("Pokemon");

        // Test getOutgoingEdges
        const outgoing = await service.getOutgoingEdges("NODE#Pokemon#Pikachu", tableName);
        expect(outgoing).toHaveLength(1);
        expect(outgoing[0].entityType).toBe("evolves_to");
        expect(outgoing[0].Target).toBe("NODE#Pokemon#Raichu");

        // Test outgoing edge type filter
        const outgoingEdges = await service.getOutgoingEdges("NODE#Pokemon#Pikachu", tableName, "evolves_to");
        expect(outgoingEdges).toHaveLength(1);
        expect(outgoingEdges[0].entityType).toBe("evolves_to");

        // Test exact SK query and nodeType query
        const exactEdges = await service.queryEdges("NODE#Pokemon#Pikachu", tableName, { eq: "EDGE#evolves_to#Pokemon#Raichu" });
        expect(exactEdges).toHaveLength(1);

        const pokemonNodes = await service.queryNodes("Pokemon", tableName);
        expect(pokemonNodes).toHaveLength(2);
        expect(pokemonNodes.map(node => node.name).sort()).toEqual(["Pikachu", "Raichu"]);

        // Verify the edge is in the database
        const scanResult = await client.send(new ScanCommand({ TableName: tableName }));
        expect(scanResult.Items).toHaveLength(4); // 2 nodes + 2 edges
    });

    test("should support SK filtering and custom edge types", async () => {
        // Query exact SK
        const exactEdges = await service.queryEdges("NODE#Pokemon#Pikachu", tableName, { eq: "EDGE#evolves_to#Pokemon#Raichu" });
        expect(exactEdges).toHaveLength(1);
        expect(exactEdges[0].SK).toBe("EDGE#evolves_to#Pokemon#Raichu");

        // Query by prefix SK for outgoing edges
        const prefixEdges = await service.queryEdges("NODE#Pokemon#Pikachu", tableName, { beginsWith: "EDGE#evolves_to" });
        expect(prefixEdges).toHaveLength(1);

        class CustomEdge extends DynamoEdge {
            label = "custom";
        }

        const customFactory = (item: Record<string, any>) => {
            const skParts = item.SK.split('#');
            const edgeType = item.entityType;
            const targetType = skParts[2];
            const targetName = skParts[3];
            return new CustomEdge(item.PK, edgeType, targetType, targetName);
        };

        const customEdges = await service.queryEdges("NODE#Pokemon#Pikachu", tableName, { beginsWith: "EDGE#" }, undefined, customFactory);
        expect(customEdges).toHaveLength(1);
        expect(customEdges[0]).toBeInstanceOf(CustomEdge);
        expect(customEdges[0].label).toBe("custom");
    });

    test("should delete nodes", async () => {
        // Clear table
        try {
            await client.send(new DeleteTableCommand({ TableName: tableName }));
            await client.send(new CreateTableCommand({
                TableName: tableName,
                KeySchema: [
                    { AttributeName: "PK", KeyType: "HASH" },
                    { AttributeName: "SK", KeyType: "RANGE" }
                ],
                AttributeDefinitions: [
                    { AttributeName: "PK", AttributeType: "S" },
                    { AttributeName: "SK", AttributeType: "S" }
                ],
                BillingMode: "PAY_PER_REQUEST"
            }));
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            // Ignore
        }

        // Create and verify node exists
        const node = new DynamoNode("Pokemon", "Charizard");
        await service.createNode(node, tableName);
        let retrieved = await service.getNode("NODE#Pokemon#Charizard", tableName);
        expect(retrieved).not.toBeNull();

        // Delete node - test convenience syntax by passing the node object directly
        await service.deleteNode(node, tableName);

        // Verify node is deleted
        retrieved = await service.getNode("NODE#Pokemon#Charizard", tableName);
        expect(retrieved).toBeNull();
    });

    test("should delete edges", async () => {
        // Create nodes
        const node1 = new DynamoNode("Pokemon", "Squirtle");
        const node2 = new DynamoNode("Pokemon", "Wartortle");
        await service.createNode(node1, tableName);
        await service.createNode(node2, tableName);

        // Create edge
        const edge = new DynamoEdge("NODE#Pokemon#Squirtle", "evolves_to", "Pokemon", "Wartortle");
        await service.createEdge(edge, tableName);

        // Verify edge exists
        let outgoing = await service.getOutgoingEdges("NODE#Pokemon#Squirtle", tableName);
        expect(outgoing).toHaveLength(1);

        // Delete edge (both forward and reverse)
        await service.deleteEdge(edge, tableName);

        // Verify both edges are deleted
        outgoing = await service.getOutgoingEdges("NODE#Pokemon#Squirtle", tableName);
        expect(outgoing).toHaveLength(0);
    });

    test("should update nodes", async () => {
        // Create node
        const node = new DynamoNode("Pokemon", "Bulbasaur");
        await service.createNode(node, tableName);

        // Verify initial state
        let retrieved = await service.getNode("NODE#Pokemon#Bulbasaur", tableName);
        expect(retrieved).not.toBeNull();
        expect(retrieved!.name).toBe("Bulbasaur");

        // Update node - test convenience syntax by passing the node object directly
        const updated = await service.updateNode(node, { name: "Bulbasaur-Updated" }, tableName);
        expect(updated).not.toBeNull();
        expect(updated!.name).toBe("Bulbasaur-Updated");

        // Verify update persisted
        retrieved = await service.getNode("NODE#Pokemon#Bulbasaur", tableName);
        expect(retrieved).not.toBeNull();
        expect(retrieved!.name).toBe("Bulbasaur-Updated");
    });

    test("should update edges", async () => {
        // Create nodes
        const node1 = new DynamoNode("Pokemon", "Oddish");
        const node2 = new DynamoNode("Pokemon", "Gloom");
        await service.createNode(node1, tableName);
        await service.createNode(node2, tableName);

        // Create edge with additional property
        const edge = new DynamoEdge("NODE#Pokemon#Oddish", "evolves_to", "Pokemon", "Gloom");
        (edge as any).level = 21;
        await service.createEdge(edge, tableName);

        // Verify edge property
        let outgoing = await service.getOutgoingEdges("NODE#Pokemon#Oddish", tableName);
        expect(outgoing).toHaveLength(1);

        // Update edge
        const updated = await service.updateEdge(edge, { entityType: "evolves_to_rare" }, tableName);
        expect(updated).not.toBeNull();
        expect(updated!.entityType).toBe("evolves_to_rare");

        // Verify update persisted in forward edge
        outgoing = await service.getOutgoingEdges("NODE#Pokemon#Oddish", tableName);
        expect(outgoing).toHaveLength(1);
        expect(outgoing[0].entityType).toBe("evolves_to_rare");
    });
});