import { createTestEnv } from "../../../testEnv";
import { DynamoDBGraphService } from "../../../../dynamodb-graph/service/dynamoDBGraphService";
import {
    FieldEffectNode,
    FieldEffectIdentifier,
    FieldEffectEntity,
    FieldEffectData
} from "../../../../dynamodb-graph/nodes/battle/fieldEffectNode";
import { MoveRange } from "../../../../dynamodb-graph/models/battle/moveRange";

let service: DynamoDBGraphService;
let env: ReturnType<typeof createTestEnv>;

beforeAll(async () => {
    env = createTestEnv(`field-effect-${Date.now()}-${Math.random()}`);
    await env.createTable();
    service = env.service;
});

afterAll(async () => {
    await env.destroy();
});

describe("FieldEffectNode Integration Tests", () => {

    test("should serialize and deserialize FieldEffectNode correctly", async () => {
        const identifier = new FieldEffectIdentifier("pokemon", "trick_room");

        const node = new FieldEffectNode(
            {
                identifier,
                durationInTurns: 5,
                fieldEffectRange: MoveRange.AllPokemon,
                description: "Reverses turn order"
            },
            undefined,
            ["speed", "priority"]
        );

        const pk = node.PK;

        await service.putItem(node);
        const read = await service.getNode(pk) as FieldEffectNode;

        expect(read).not.toBeNull();
        expect(read.entityType).toBe(FieldEffectEntity);

        // identifier
        expect(read.fieldEffectData.identifier.toString()).toBe(identifier.toString());

        // core fields
        expect(read.fieldEffectData.durationInTurns).toBe(5);
        expect(read.fieldEffectData.fieldEffectRange).toBe(MoveRange.AllPokemon);
        expect(read.fieldEffectData.description).toBe("Reverses turn order");

        // labels
        expect(read.fieldEffectLabels).toEqual(["speed", "priority"]);
    });

    test("should handle rebalancedFieldEffectData correctly", async () => {
        const identifier = new FieldEffectIdentifier("pokemon", "gravity");

        const baseData : FieldEffectData = {
            identifier,
            durationInTurns: 5,
            fieldEffectRange: MoveRange.AllPokemon,
            description: "Grounds all Pokémon"
        };

        const rebalancedData : FieldEffectData = {
            identifier,
            durationInTurns: 3,
            fieldEffectRange: MoveRange.AllPokemon,
            description: "Shortened duration"
        };

        const node = new FieldEffectNode(baseData, rebalancedData, ["field"]);

        const pk = node.PK;

        await service.putItem(node);
        const read = await service.getNode(pk) as FieldEffectNode;

        expect(read.rebalancedFieldEffectData).toBeDefined();

        expect(read.rebalancedFieldEffectData!.durationInTurns).toBe(3);
        expect(read.rebalancedFieldEffectData!.description).toBe("Shortened duration");
    });

    test("should default fieldEffectLabels to empty array", async () => {
        const identifier = new FieldEffectIdentifier("pokemon", "rain");

        const node = new FieldEffectNode({
            identifier,
            durationInTurns: 5,
            fieldEffectRange: MoveRange.AllAllies
        });

        const pk = node.PK;

        await service.putItem(node);
        const read = await service.getNode(pk) as FieldEffectNode;

        expect(read.fieldEffectLabels).toEqual([]);
    });

    test("should correctly persist nested identifier structure", async () => {
        const identifier = new FieldEffectIdentifier("pokemon_scarlet", "sun");

        const node = new FieldEffectNode({
            identifier,
            durationInTurns: 5,
            fieldEffectRange: MoveRange.AllOpponents
        });

        const pk = node.PK;

        await service.putItem(node);
        const read = await service.getNode(pk) as FieldEffectNode;

        expect(read.fieldEffectData.identifier.game).toBe("pokemon_scarlet");
        expect(read.fieldEffectData.identifier.getFieldEffect()).toBe("sun");
    });
});