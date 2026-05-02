import {
    DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {DynamoDBGraphService} from "../../../../dynamodb-graph/service/dynamoDBGraphService";
import { createTestEnv } from "../../../testEnv";
import { AbilityIdentifier, AbilityNode, PokemonIdentifier } from "../../../../dynamodb-graph/nodes";
import {createMechanicNode, MechanicNode} from "../../../../dynamodb-graph/nodes/battle/mechanicNode";
import { ResourceLocation } from "../../../../dynamodb-graph/models/minecraft/resourceLocation";
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

describe("MechanicNode Integration Tests", () => {
    const form1 = new PokemonIdentifier("pokemon", "charizard");
    const form2 = new PokemonIdentifier("pokemon", "mewtwo");
    const item1 = new ResourceLocation("minecraft", "mega_stone");
    const item2 = new ResourceLocation("minecraft", "key_stone");
    test("should persist description correctly", async () => {
        const node = createMechanicNode("mega_evolution", "Transforms Pokémon during battle");

        await service.putItem(node);
        const read = await service.getNode(node.PK) as MechanicNode;

        expect(read.description).toBe("Transforms Pokémon during battle");
    });

    test("should persist usesItems correctly", async () => {

        const node = createMechanicNode("mega_evolution", "description", [item1, item2]);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as MechanicNode;

        expect(read.usesItems).toHaveLength(2);
        expect(read.usesItems?.[0].toString()).toBe(item1.toString());
        expect(read.usesItems?.[1].toString()).toBe(item2.toString());
    });

    test("should persist affectsForms correctly", async () => {

        const node = createMechanicNode("mega_evolution", "description", [item1, item2], [form1, form2]);

        await service.putItem(node);
        const read = await service.getNode(node.PK) as MechanicNode;

        expect(read.affectsForms).toHaveLength(2);
        expect(read.affectsForms?.[0].toString()).toBe(form1.toString());
        expect(read.affectsForms?.[1].toString()).toBe(form2.toString());
    });

    test("should handle undefined optional fields", async () => {
        const node = createMechanicNode("mega_evolution");

        await service.putItem(node);
        const read = await service.getNode(node.PK) as MechanicNode;

        expect(read.description).toBeUndefined();
        expect(read.usesItems).toBeUndefined();
        expect(read.affectsForms).toBeUndefined();
    });
});

