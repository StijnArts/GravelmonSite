import {
    DynamoDBClient,
    CreateTableCommand,
    DeleteTableCommand,
    DescribeTableCommand
} from "@aws-sdk/client-dynamodb";
import { ResourceLocation } from "../../../../dynamodb-graph/models/minecraft/resourceLocation";
import {StructureNode, StructureTagNode} from "../../../../dynamodb-graph/nodes/minecraft/structureNode";
import {DynamoDBGraphService} from "../../../../dynamodb-graph/service/dynamoDBGraphService";
import { createTestEnv } from "../../../testEnv";
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

describe("StructureNode", () => {
    test("should persist resourceLocation and identifier correctly", async () => {
        const structure = new ResourceLocation("minecraft", "plains");

        const node = new StructureNode(structure);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as StructureNode;

        expect(read.resourceLocation.toString()).toBe(structure.toString());

        expect(read.resourceLocation).toBeInstanceOf(ResourceLocation);
    });
});

describe("StructureTagNode", () => {
    test("should persist containsStructures correctly", async () => {
        const tag = new ResourceLocation("minecraft", "is_forest");

        const structure1 = new ResourceLocation("minecraft", "dark_forest");
        const structure2 = new ResourceLocation("minecraft", "birch_forest");

        const node = new StructureTagNode(tag, [structure1, structure2]);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as StructureTagNode;

        expect(read.resourceLocation.toString()).toBe(tag.toString());

        expect(read.containsStructures.length).toBe(2);

        expect(read.containsStructures[0].toString()).toBe(structure1.toString());
        expect(read.containsStructures[1].toString()).toBe(structure2.toString());

        expect(read.containsStructures[0]).toBeInstanceOf(ResourceLocation);
    });

    test("should handle empty containsStructures", async () => {
        const tag = new ResourceLocation("minecraft", "empty");

        const node = new StructureTagNode(tag, []);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as StructureTagNode;

        expect(read.containsStructures).toEqual([]);
    });
});
