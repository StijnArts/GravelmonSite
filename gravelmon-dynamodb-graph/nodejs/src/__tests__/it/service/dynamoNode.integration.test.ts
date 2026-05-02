import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { DynamoDBGraphService } from "../../../dynamodb-graph/service/dynamoDBGraphService";
import { createTestEnv } from "../../testEnv";
import {DynamoEdge, DynamoNode, getNodePK } from "../../../dynamodb-graph/service/dynamoNodes";

const tableName =
    process.env.DYNAMODB_TABLE ||
    `TestGraphTable-${Date.now()}-${Math.random().toString(36).slice(2)}`;

let dynamoClient: DynamoDBClient;
let service: DynamoDBGraphService;
let env: ReturnType<typeof createTestEnv>;

beforeAll(async () => {
    env = createTestEnv("game-node")
    await env.createTable();
    service = env.service;
    dynamoClient = env.client;
});

afterAll(async () => {
    env.destroy();
});

describe("DynamoNode", () => {
    it("should serialize and deserialize a DynamoNode correctly", async () => {
        // Arrange
        const node = new DynamoNode("TestEntity", "test-name", 2, 123456);
        const pk = node.PK;

        // Act
        await service.putItem(node);
        const readNode = await service.getNode(pk) as DynamoNode;

        // Assert
        expect(readNode).not.toBeNull();

        expect(readNode.PK).toBe(node.PK);
        expect(readNode.SK).toBe("METADATA");
        expect(readNode.TYPE).toBe("NODE");

        expect(readNode.entityType).toBe("TestEntity");
        expect(readNode.name).toBe("test-name");

        expect(readNode.version).toBe(2);
        expect(readNode.lastEdited).toBe(123456);
    });
});

describe("DynamoEdge", () => {
    it("should serialize and deserialize an edge correctly", async () => {
        // Arrange
        const sourcePk = getNodePK("User", "A");

        const edge = new DynamoEdge(
            sourcePk,
            "FRIEND",
            "User",
            "B",
            3,
            999999
        );

        // Act
        await service.putItem(edge);

        const results = await service.queryByPKAndSKPrefix(
            sourcePk,
            "EDGE#FRIEND"
        );

        const readEdge = results[0] as DynamoEdge;

        // Assert
        expect(readEdge).not.toBeNull();

        expect(readEdge.PK).toBe(sourcePk);
        expect(readEdge.SK).toBe("EDGE#FRIEND#User#B");
        expect(readEdge.TYPE).toBe("EDGE");

        expect(readEdge.entityType).toBe("FRIEND");

        expect(readEdge.target).toBe(getNodePK("User", "B"));
        expect(readEdge.sourceType).toBe("User");
        expect(readEdge.targetType).toBe("User");

        expect(readEdge.version).toBe(3);
        expect(readEdge.lastEdited).toBe(999999);
    });

    it("should correctly derive target and types from SK", async () => {
        // Arrange
        const sourcePk = getNodePK("Pokemon", "Pikachu");

        const edge = new DynamoEdge(
            sourcePk,
            "HAS_TYPE",
            "Type",
            "Electric"
        );

        // Act
        await service.putItem(edge);

        const results = await service.queryByPKAndSKPrefix(
            sourcePk,
            "EDGE#HAS_TYPE"
        );

        const readEdge = results[0] as DynamoEdge;

        // Assert
        expect(readEdge.target).toBe(getNodePK("Type", "Electric"));
        expect(readEdge.sourceType).toBe("Pokemon");
        expect(readEdge.targetType).toBe("Type");
    });
});