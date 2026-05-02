import {
    DynamoDBClient,
    CreateTableCommand,
    DeleteTableCommand,
    DescribeTableCommand
} from "@aws-sdk/client-dynamodb";
import { ResourceLocation } from "../../../../dynamodb-graph/models/minecraft/resourceLocation";
import {BiomeNode, BiomeTagNode} from "../../../../dynamodb-graph/nodes/minecraft/biomeNode";
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

describe("BiomeNode", () => {
    test("should persist resourceLocation and identifier correctly", async () => {
        const biome = new ResourceLocation("minecraft", "plains");

        const node = new BiomeNode(biome);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as BiomeNode;

        expect(read.resourceLocation.toString()).toBe(biome.toString());

        expect(read.resourceLocation).toBeInstanceOf(ResourceLocation);
    });
});

describe("BiomeTagNode", () => {
    test("should persist containsBiomes correctly", async () => {
        const tag = new ResourceLocation("minecraft", "is_forest");

        const biome1 = new ResourceLocation("minecraft", "dark_forest");
        const biome2 = new ResourceLocation("minecraft", "birch_forest");

        const node = new BiomeTagNode(tag, [biome1, biome2]);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as BiomeTagNode;

        expect(read.resourceLocation.toString()).toBe(tag.toString());

        expect(read.containsBiomes.length).toBe(2);

        expect(read.containsBiomes[0].toString()).toBe(biome1.toString());
        expect(read.containsBiomes[1].toString()).toBe(biome2.toString());

        expect(read.containsBiomes[0]).toBeInstanceOf(ResourceLocation);
    });

    test("should handle empty containsBiomes", async () => {
        const tag = new ResourceLocation("minecraft", "empty");

        const node = new BiomeTagNode(tag, []);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as BiomeTagNode;

        expect(read.containsBiomes).toEqual([]);
    });
});
