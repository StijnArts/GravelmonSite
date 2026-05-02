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
import { ItemNode } from "../../../../dynamodb-graph/nodes/minecraft/itemNode";
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

describe("ItemNode", () => {
    test("should persist ItemNode optional fields correctly", async () => {
        const item = new ResourceLocation("minecraft", "diamond_sword");

        const node = new ItemNode(
            item,
            true,
            "s3://textures/diamond.png",
            "sharpness_boost"
        );

        await service.putItem(node);
        const read = await service.getNode(node.PK) as ItemNode;

        expect(read.resourceLocation).toBeInstanceOf(ResourceLocation);
        expect(read.resourceLocation.toString()).toBe(item.toString());

        expect(read.isPlaceable).toBe(true);
        expect(read.s3TextureLocation).toBe("s3://textures/diamond.png");
        expect(read.inBattleEffect).toBe("sharpness_boost");
    });

    test("should handle missing optional ItemNode fields", async () => {
        const item = new ResourceLocation("minecraft", "stick");

        const node = new ItemNode(item, false);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as ItemNode;

        expect(read.s3TextureLocation).toBeUndefined();
        expect(read.inBattleEffect).toBeUndefined();
    });
});

