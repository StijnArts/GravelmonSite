import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBGraphService} from "../../../../dynamodb-graph/service/dynamoDBGraphService";
import {getNodePK} from "../../../../dynamodb-graph/service/dynamoNodes";
import {createTestEnv} from "../../../testEnv";
import {
    createSpawnPresetNode,
    SpawnPresetEntity,
    SpawnPresetOptions
} from "../../../../dynamodb-graph/nodes/spawning/spawnPresetNode";
import {ResourceLocation} from "../../../../dynamodb-graph/models/minecraft/resourceLocation";
import {LabelMode, SpawnCondition} from "../../../../dynamodb-graph/models/spawning/spawnCondition";
import {NumberRange} from "../../../../dynamodb-graph/models/properties/numberRange";
import {Time} from "../../../../dynamodb-graph/models/properties/time";

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

describe("SpawnPresetNode Integration Tests", () => {
    const testSpawnCondition = new SpawnCondition({
        dimensions: ["minecraft:overworld", "minecraft:nether"],

        moonPhase: new NumberRange(0, 4),
        canSeeSky: true,

        minY: 60,
        maxY: 120,
        minX: -1000,
        maxX: 1000,
        minZ: -1000,
        maxZ: 1000,

        minLight: 0,
        maxLight: 7,
        minSkyLight: 0,
        maxSkyLight: 10,

        timeRange: {
            type: "time", // night
            value: Time.Day
        },

        isRaining: false,
        isThundering: false,
        isSlimeChunk: false,

        labels: ["rare", "surface_spawn"],
        labelMode: LabelMode.ALL,

        minWidth: 1,
        maxWidth: 3,
        minLength: 1,
        maxLength: 3,

        neededNearbyBlocks: [
            new ResourceLocation("minecraft", "grass_block"),
            new ResourceLocation("minecraft", "stone")
        ],

        neededBaseBlocks: [
            new ResourceLocation("minecraft", "dirt")
        ],

        doesNotSpawnInBiomes: [
            new ResourceLocation("minecraft", "desert"),
            new ResourceLocation("minecraft", "ocean")
        ],

        spawnsInBiomes: [
            new ResourceLocation("minecraft", "plains"),
            new ResourceLocation("minecraft", "forest")
        ],

        doesNotSpawnInStructures: [
            new ResourceLocation("minecraft", "village")
        ],

        spawnsInStructures: [
            new ResourceLocation("minecraft", "ruined_portal")
        ],

        minDepth: 10,
        maxDepth: 64,

        fluidIsSource: false,
        fluid: new ResourceLocation("minecraft", "water"),

        minLureLevel: 1,
        maxLureLevel: 3,
        bobber: new ResourceLocation("minecraft", "fishing_bobber"),
        bait: new ResourceLocation("minecraft", "worm")
    });

    test("should write and read a SpawnPresetNode from DynamoDB", async () => {
        // Arrange: Create sample game data
        const condition : SpawnCondition = testSpawnCondition;
        const antiCondition : SpawnCondition = testSpawnCondition;

        const spawnPresetData : SpawnPresetOptions = {
            name: new ResourceLocation("pokemon", "item/pokedex"),
            condition: condition,
            antiCondition: antiCondition
        };

        const spawnPresetNode = createSpawnPresetNode(spawnPresetData);
        const pk = getNodePK(SpawnPresetEntity, spawnPresetData.name.toString());

        // Act: Write the node to DynamoDB
        await service.putItem(spawnPresetNode);
        const readNode = await service.getNode(pk);

        // Assert
        expect(readNode).not.toBeNull();
        expect(readNode?.entityType).toBe(SpawnPresetEntity);
        // Verify it's a SpawnPresetNode with proper data
        if (readNode && 'spawnPresetOptions' in readNode) {
            expect((readNode as any).spawnPresetOptions.name).toEqual(spawnPresetData.name);
            expect((readNode as any).spawnPresetOptions.condition).toEqual(spawnPresetData.condition);
            expect((readNode as any).spawnPresetOptions.antiCondition).toEqual(spawnPresetData.antiCondition);
        }
    });
});
