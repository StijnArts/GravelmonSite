import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBGraphService} from "../../../../dynamodb-graph/service/dynamoDBGraphService";
import {createTestEnv} from "../../../testEnv";
import {getNodePK} from "../../../../dynamodb-graph/service/dynamoNodes";

import {PokemonIdentifier} from "../../../../dynamodb-graph/nodes";
import {ResourceLocation} from "../../../../dynamodb-graph/models/minecraft/resourceLocation";
import {
    createEvolutionNode,
    EvolutionEntity,
    EvolutionIdentifier, EvolutionNode,
    EvolutionType
} from "../../../../dynamodb-graph/nodes";
import {
    LevelCondition,
    RatioCondition,
    HasMoveCondition,
    HeldItemCondition,
    GenderCondition,
    FriendshipCondition,
    PartyMemberPokemonCondition,
    PartyMemberTypeCondition,
    BiomeCondition,
    RainingCondition,
    ThunderCondition,
    BlocksTraveledCondition,
    StatRatio,
    Gender,
    EvolutionConditionType
} from "../../../../dynamodb-graph/models/properties/evolutionCondition";

import {NumberRange} from "../../../../dynamodb-graph/models/properties/numberRange";
import {MoveIdentifier} from "../../../../dynamodb-graph/nodes";
import {TimeRange} from "../../../../dynamodb-graph/models/properties/time";
import {TimeCondition} from "../../../../dynamodb-graph/models/properties/evolutionCondition";

let service: DynamoDBGraphService;
let env: ReturnType<typeof createTestEnv>;

beforeAll(async () => {
    env = createTestEnv("game-node");
    await env.createTable();
    service = env.service;
});

afterAll(async () => {
    env.destroy();
});

describe("EvolutionNode Integration Tests", () => {

    const testEvolutionConditions = [
        // LEVEL
        new LevelCondition(36),

        // TIME
        new TimeCondition({
            type: "range",
            value: new NumberRange(1000, 2000)
        } as TimeRange),

        // RATIO
        new RatioCondition(StatRatio.ATTACK_HIGHER),

        // HAS_MOVE
        new HasMoveCondition(
            new MoveIdentifier("pokemon_red", "tackle")
        ),

        // HELD_ITEM
        new HeldItemCondition(
            new ResourceLocation("minecraft", "water_stone")
        ),

        // GENDER
        new GenderCondition(Gender.MALE),

        // FRIENDSHIP
        new FriendshipCondition(220),

        // PARTY_MEMBER (pokemon)
        new PartyMemberPokemonCondition(
            new PokemonIdentifier("pokemon", "pikachu")
        ),

        // PARTY_MEMBER_OF_TYPE
        new PartyMemberTypeCondition("fire"),

        // BIOME
        new BiomeCondition(
            new ResourceLocation("minecraft", "plains")
        ),

        // WEATHER - rain
        new RainingCondition(true),

        // WEATHER - thunder
        new ThunderCondition(true),

        // BLOCKS_TRAVELED
        new BlocksTraveledCondition(5000)
    ];
    it("should serialize and deserialize an EvolutionNode correctly", async () => {

        // -------------------------
        // Arrange
        // -------------------------
        const source = new PokemonIdentifier("pokemon", "pikachu");
        const result = new PokemonIdentifier("pokemon", "raichu");

        const evolutionIdentifier = new EvolutionIdentifier(source, result);

        const evolutionNode = createEvolutionNode({
            identifier: evolutionIdentifier,
            evolutionType: EvolutionType.ItemInteract,
            consumesHeldItem: true,
            isOptional: false,

            evolutionConditions: testEvolutionConditions,

            needsToHoldItem: new ResourceLocation("minecraft", "thunder_stone"),
            requiresItemUsedOn: new ResourceLocation("minecraft", "player"),

            evolvesFromForm: source,
            evolvesIntoForm: result,

            learnsMoveUponEvolving: new MoveIdentifier("pokemon_red", "tackle"),
        });

        const pk = getNodePK(EvolutionEntity, evolutionIdentifier.toString());

        // -------------------------
        // Act
        // -------------------------
        await service.putItem(evolutionNode);
        const readNode = await service.getNode(pk) as EvolutionNode;

        // -------------------------
        // Assert (node-level)
        // -------------------------
        expect(readNode).not.toBeNull();
        expect(readNode.entityType).toBe(EvolutionEntity);

        // -------------------------
        // Assert identifier
        // -------------------------
        expect(readNode.evolutionOptions.identifier.toString())
            .toBe(evolutionIdentifier.toString());

        expect(readNode.evolutionOptions.evolutionType)
            .toBe(EvolutionType.ItemInteract);

        expect(readNode.evolutionOptions.consumesHeldItem)
            .toBe(true);

        expect(readNode.evolutionOptions.isOptional)
            .toBe(false);

        // -------------------------
        // Assert item interactions
        // -------------------------
        expect(readNode.evolutionOptions.needsToHoldItem?.toString())
            .toBe("minecraft:thunder_stone");

        expect(readNode.evolutionOptions.requiresItemUsedOn?.toString())
            .toBe("minecraft:player");

        // -------------------------
        // Assert form links
        // -------------------------
        expect(readNode.evolutionOptions.evolvesFromForm?.toString())
            .toBe(source.toString());

        expect(readNode.evolutionOptions.evolvesIntoForm?.toString())
            .toBe(result.toString());

        // -------------------------
        // Assert move learning
        // -------------------------
        expect(readNode.evolutionOptions.learnsMoveUponEvolving)
            .toEqual(new MoveIdentifier("pokemon_red", "tackle"));

        // --------------------
        // LEVEL
        // --------------------
        const level = testEvolutionConditions[0] as LevelCondition;

        expect(level).toBeInstanceOf(LevelCondition);
        expect(level.type).toBe(EvolutionConditionType.LEVEL);
        expect(level.name).toBe("level");
        expect(level.condition).toBe("minLevel");
        expect(level.value).toBe(36);

        // --------------------
        // TIME
        // --------------------
        const time = testEvolutionConditions[1] as TimeCondition;

        expect(time).toBeInstanceOf(TimeCondition);
        expect(time.type).toBe(EvolutionConditionType.TIME);

        // narrow the union properly
        expect((time.value as TimeRange).type).toBe("range");

        const range = (time.value as TimeRange).value as NumberRange;

        expect(range.min).toBe(1000);
        expect(range.max).toBe(2000);

        // --------------------
        // RATIO
        // --------------------
        const ratio = testEvolutionConditions[2] as RatioCondition;

        expect(ratio).toBeInstanceOf(RatioCondition);
        expect(ratio.type).toBe(EvolutionConditionType.RATIO);
        expect(ratio.value).toBe(StatRatio.ATTACK_HIGHER);

        // --------------------
        // HAS_MOVE
        // --------------------
        const move = testEvolutionConditions[3] as HasMoveCondition;

        expect(move).toBeInstanceOf(HasMoveCondition);
        expect(move.type).toBe(EvolutionConditionType.HAS_MOVE);
        expect(move.condition).toBe("move");
        expect(move.value).toBe("tackle");

        // --------------------
        // HELD_ITEM
        // --------------------
        const heldItem = testEvolutionConditions[4] as HeldItemCondition;

        expect(heldItem).toBeInstanceOf(HeldItemCondition);
        expect(heldItem.type).toBe(EvolutionConditionType.HELD_ITEM);
        expect(heldItem.value.toString()).toBe("minecraft:water_stone");

        // --------------------
        // GENDER
        // --------------------
        const gender = testEvolutionConditions[5] as GenderCondition;

        expect(gender).toBeInstanceOf(GenderCondition);
        expect(gender.type).toBe(EvolutionConditionType.GENDER);
        expect(gender.value).toBe(Gender.MALE);
        expect(gender.property).toBe("gender=");

        // --------------------
        // FRIENDSHIP
        // --------------------
        const friendship = testEvolutionConditions[6] as FriendshipCondition;

        expect(friendship).toBeInstanceOf(FriendshipCondition);
        expect(friendship.type).toBe(EvolutionConditionType.FRIENDSHIP);
        expect(friendship.value).toBe(220);
        expect(friendship.condition).toBe("amount");

        // --------------------
        // PARTY MEMBER POKEMON
        // --------------------
        const partyPokemon = testEvolutionConditions[7] as PartyMemberPokemonCondition;

        expect(partyPokemon).toBeInstanceOf(PartyMemberPokemonCondition);
        expect(partyPokemon.type).toBe(EvolutionConditionType.PARTY_MEMBER);
        expect(partyPokemon.value.toString()).toBe("pokemon#pikachu");

        // --------------------
        // PARTY MEMBER TYPE
        // --------------------
        const partyType = testEvolutionConditions[8] as PartyMemberTypeCondition;

        expect(partyType).toBeInstanceOf(PartyMemberTypeCondition);
        expect(partyType.type).toBe(EvolutionConditionType.PARTY_MEMBER_OF_TYPE);
        expect(partyType.value).toBe("fire");
        expect(partyType.property).toBe("type=");

        // --------------------
        // BIOME
        // --------------------
        const biome = testEvolutionConditions[9] as BiomeCondition;

        expect(biome).toBeInstanceOf(BiomeCondition);
        expect(biome.type).toBe(EvolutionConditionType.BIOME);
        expect(biome.value.toString()).toBe("minecraft:plains");

        // --------------------
        // RAIN
        // --------------------
        const rain = testEvolutionConditions[10] as RainingCondition;

        expect(rain).toBeInstanceOf(RainingCondition);
        expect(rain.type).toBe(EvolutionConditionType.WEATHER);
        expect(rain.value).toBe(true);
        expect(rain.condition).toBe("isRaining");

        // --------------------
        // THUNDER
        // --------------------
        const thunder = testEvolutionConditions[11] as ThunderCondition;

        expect(thunder).toBeInstanceOf(ThunderCondition);
        expect(thunder.type).toBe(EvolutionConditionType.WEATHER);
        expect(thunder.value).toBe(true);
        expect(thunder.condition).toBe("isThundering");

        // --------------------
        // BLOCKS TRAVELED
        // --------------------
        const blocks = testEvolutionConditions[12] as BlocksTraveledCondition;

        expect(blocks).toBeInstanceOf(BlocksTraveledCondition);
        expect(blocks.type).toBe(EvolutionConditionType.BLOCKS_TRAVELED);
        expect(blocks.value).toBe(5000);
        expect(blocks.condition).toBe("amount");
    });
});