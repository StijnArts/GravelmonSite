import {
    DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {DynamoDBGraphService} from "../../../../dynamodb-graph/service/dynamoDBGraphService";
import { createTestEnv } from "../../../testEnv";
import { AbilityIdentifier, AbilityNode } from "../../../../dynamodb-graph/nodes";
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

describe("AbilityNode", () => {
    test("AbilityNode should serialize and deserialize identifier and description", async () => {
        const identifier = new AbilityIdentifier("pokemon_sword", "pressure");

        const node = new AbilityNode(identifier, "Reduces opponent PP usage");

        await service.putItem(node);
        const read = await service.getNode(node.PK) as AbilityNode;

        expect(read).not.toBeNull();

        expect(read.identifier).toBeInstanceOf(AbilityIdentifier);
        expect(read.identifier.game).toBe("pokemon_sword");
        expect(read.identifier.ability).toBe("pressure");
        expect(read.identifier.toString()).toBe("pokemon_sword#pressure");

        expect(read.description).toBe("Reduces opponent PP usage");
    });

    test("AbilityNode should handle missing description", async () => {
        const identifier = new AbilityIdentifier("pokemon_scarlet", "overgrow");

        const node = new AbilityNode(identifier);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as AbilityNode;

        expect(read.identifier).toBeInstanceOf(AbilityIdentifier);
        expect(read.description).toBeUndefined();
    });

    test("AbilityIdentifier.fromString should round-trip correctly", () => {
        const id = AbilityIdentifier.fromString("pokemon_sword#intimidate");

        expect(id.game).toBe("pokemon_sword");
        expect(id.ability).toBe("intimidate");
        expect(id.toString()).toBe("pokemon_sword#intimidate");
    });
});

