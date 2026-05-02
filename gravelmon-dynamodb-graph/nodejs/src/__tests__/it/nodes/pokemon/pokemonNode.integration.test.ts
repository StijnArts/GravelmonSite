import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBGraphService} from "../../../../dynamodb-graph/service/dynamoDBGraphService";
import {getNodePK} from "../../../../dynamodb-graph/service/dynamoNodes";
import {createTestEnv} from "../../../testEnv";
import {
    createPokemonNode,
    PokemonData,
    PokemonEntity,
    PokemonIdentifier,
    PokemonNode,
    MoveCategory,
    MoveIdentifier,
    FormPrimaryTypeEdge,
    FormTypeRelationship,
    FormEntity,
    FormSecondaryTypeEdge,
    AbilityIdentifier, FormHasAbilityEdge, FormHasAbilityEdgeType,
    PokemonPrimaryTypeEdge,
    PokemonTypeRelationship,
    PokemonSecondaryTypeEdge,
    PokemonHasAbilityEdge, HasAbilityEdgeType
} from "../../../../dynamodb-graph/nodes";
import {BehaviourOptions, SleepDepth} from "../../../../dynamodb-graph/models/behaviour/behaviour";
import {NumberRange} from "../../../../dynamodb-graph/models/properties/numberRange";
import {Time} from "../../../../dynamodb-graph/models/properties/time";
import {RidingKey} from "../../../../dynamodb-graph/models/behaviour/riding";
import {PoseType} from "../../../../dynamodb-graph/models/assets/posing/poseType";

import {Stats} from "../../../../dynamodb-graph/models/properties/stats";
import {MoveSet} from "../../../../dynamodb-graph/models/battle/moveset";

const tableName =
    process.env.DYNAMODB_TABLE ||
    `TestGraphTable-${Date.now()}-${Math.random().toString(36).slice(2)}`;

let dynamoClient: DynamoDBClient;
let service: DynamoDBGraphService;
let env: ReturnType<typeof createTestEnv>;

beforeAll(async () => {
    env = createTestEnv("game-node");
    await env.createTable();
    service = env.service;
    dynamoClient = env.client;
});

afterAll(async () => {
    env.destroy();
});

describe("PokemonNode Integration Tests", () => {
    const thunderShock = new MoveIdentifier("pokemon", "thundershock");
    const quickAttack = new MoveIdentifier("pokemon", "quick_attack");
    const ironTail = new MoveIdentifier("pokemon", "iron_tail");
    const voltTackle = new MoveIdentifier("pokemon", "volt_tackle");

    const testMoveSet: MoveSet = {
        levelUpMoves: [
            {
                moveName: {
                    moveName: thunderShock,
                    category: MoveCategory.Special,
                    basePower: 40,
                    accuracy: 100,
                    type: "Electric"
                },
                level: 5
            },
            {
                moveName: {
                    moveName: quickAttack,
                    category: MoveCategory.Physical,
                    basePower: 40,
                    accuracy: 100,
                    type: "Normal"
                },
                level: 10
            }
        ],
        teachMoves: [
            {
                moveName: ironTail,
                category: MoveCategory.Physical,
                basePower: 100,
                accuracy: 75,
                type: "Steel"
            }
        ],
        eggMoves: [
            {
                moveName: voltTackle,
                category: MoveCategory.Physical,
                basePower: 120,
                accuracy: 100,
                type: "Electric"
            }
        ],
        legacyMoves: []
    };

    const behaviourOptions: BehaviourOptions = {
        movement: {
            canLookAround: true,
            looksAtEntities: true,
            canWalk: true,
            walkSpeed: 1.2,
            wanderChance: 0.5,
            wanderSpeed: 1.0
        },

        aquatic: {
            canSwimInWater: true,
            avoidsLand: false,
            swimSpeed: 0.8,
            canBreatheUnderwater: false
        },

        sleep: {
            canSleep: true,
            willSleepOnBed: false,
            sleepLightLevel: new NumberRange(0, 7),
            drowsyChance: 0.2,
            depth: SleepDepth.Normal,
            times: [
                {
                    type: "time",
                    value: Time.Night
                }
            ],
            biomes: ["minecraft:plains", "minecraft:forest"]
        },

        herd: {
            maxHerdSize: 5,
            herdData: [
                {
                    tier: 1,
                    leaderEntityType: new PokemonIdentifier("pokemon", "pikachu")
                }
            ]
        },

        riding: {
            landRidingBehaviour: {
                key: RidingKey.Standard,
                stats: {
                    ACCELERATION: new NumberRange(0.1, 0.3),
                    JUMP: new NumberRange(0.5, 1.0),
                    SKILL: new NumberRange(0.2, 0.6),
                    SPEED: new NumberRange(1.0, 2.0),
                    STAMINA: new NumberRange(10, 20)
                },
                rideSounds: {
                    pitchExpression: "1.0",
                    volumeExpression: "0.8",
                    SoundPK: "SOUND#pokemon#ride",
                    playForPassengers: true,
                    playForNonPassengers: false
                }
            },

            seats: [
                {
                    offset: { x: 0, y: 1, z: 0 },
                    poseOffsets: [
                        {
                            offset: { x: 0, y: 0, z: 0 },
                            poseTypes: [PoseType.FLY, PoseType.FLOAT]
                        }
                    ]
                }
            ]
        }
    };

    const testStats = new Stats(50, 60, 70, 80, 90, 100);

    test("should write and read a PokemonNode from DynamoDB", async () => {
        // Arrange
        const identifier = new PokemonIdentifier("pokemon", "pikachu");

        const pokemonData: PokemonData = {
            pokemonIdentifier: identifier,

            baseStats: testStats,
            rebalancedStats: undefined,
            evYield: testStats,

            heightInMeters: 0.4,
            weightInKg: 6,
            catchRate: 190,

            maleRatio: 0.5,
            baseExperience: 112,
            baseFriendship: 70,
            eggCycles: 10,

            pokedexEntry: "Electric mouse Pokemon",

            hitbox: { width: 1, height: 1, fixed: false },

            baseScale: 1,
            cannotDynamax: false,
            dropAmount: 1,

            behaviourOptions: behaviourOptions, // keep minimal unless strict type required

            typing: {
                primaryType: "Electric"
            },

            rebalancedTyping: {
                primaryType: "Electric"
            },

            aspects: ["shiny"],
            labels: ["starter"],
            eggGroups: ["field"],

            experienceGroup: "medium_fast",
            gameIntroducedIn: "pokemon_red",

            abilities: [
                {
                    name: "static",
                    isHidden: false,
                    isRebalance: false,
                    isPlaceholder: false
                }
            ],

            forms: [],

            moveSet: testMoveSet,
            placeholderMoveSet: undefined,
            rebalancedMoveSet: undefined
        };

        const pokemonNode = createPokemonNode(pokemonData, 123456);
        const pk = getNodePK(PokemonEntity, identifier.toString());

        // Act
        await service.putItem(pokemonNode);
        const readNode = await service.getNode(pk) as PokemonNode;

        // Assert
        expect(readNode).not.toBeNull();
        expect(readNode?.entityType).toBe(PokemonEntity);

        if (readNode && 'pokemonData' in readNode) {
            const data = readNode.pokemonData;

            expect(data.pokemonIdentifier.toString()).toBe(identifier.toString());

            expect(data.baseStats).toEqual(testStats);
            expect(data.evYield).toEqual(testStats);

            expect(data.heightInMeters).toBe(0.4);
            expect(data.weightInKg).toBe(6);

            expect(data.typing.primaryType).toBe("Electric");

            expect(data.labels).toEqual(["starter"]);
            expect(data.aspects).toEqual(["shiny"]);

            expect(data.abilities[0].name).toBe("static");

            expect(data.moveSet).toEqual(testMoveSet);

            expect(data.behaviourOptions?.movement?.canWalk).toBe(true);
            expect(data.behaviourOptions?.sleep?.sleepLightLevel?.min).toBe(0);
            expect(data.behaviourOptions?.sleep?.depth).toBe(SleepDepth.Normal);

            expect(data.behaviourOptions?.herd?.herdData[0].leaderEntityType.toString())
                .toBe("pokemon#pikachu");

            expect(data.behaviourOptions?.riding?.landRidingBehaviour?.stats.SPEED.min)
                .toBe(1.0);

            expect(data.behaviourOptions?.riding?.seats.length).toBe(1);
            expect(data.behaviourOptions?.riding?.seats[0].poseOffsets[0].poseTypes)
                .toContain(PoseType.FLY);
            expect(data.behaviourOptions?.riding?.seats[0].poseOffsets[0].poseTypes)
                .toContain(PoseType.FLOAT);

            const moveSet = data.moveSet;

            // LEVEL UP MOVES
            expect(moveSet.levelUpMoves).toHaveLength(2);

            expect(moveSet.levelUpMoves[0].level).toBe(5);
            expect(moveSet.levelUpMoves[0].moveName.moveName.toString()).toBe("pokemon#thundershock");
            expect(moveSet.levelUpMoves[0].moveName.type).toBe("Electric");

            expect(moveSet.levelUpMoves[1].level).toBe(10);
            expect(moveSet.levelUpMoves[1].moveName.moveName.toString()).toBe("pokemon#quick_attack");

            // TEACH MOVES
            expect(moveSet.teachMoves).toHaveLength(1);
            expect(moveSet.teachMoves[0].moveName.toString()).toBe("pokemon#iron_tail");
            expect(moveSet.teachMoves[0].type).toBe("Steel");

            // EGG MOVES
            expect(moveSet.eggMoves).toHaveLength(1);
            expect(moveSet.eggMoves[0].moveName.toString()).toBe("pokemon#volt_tackle");

            // LEGACY MOVES
            expect(moveSet.legacyMoves).toHaveLength(0);
        }
    });
});

describe("PokemonTypeEdge Integration Test", () => {
    test("should serialize and deserialize a PrimaryTypeEdge correctly", async () => {
        // Arrange
        const pokemon = new PokemonIdentifier("pokemon", "pikachu");
        const typeName = "electric";

        const edge = new PokemonPrimaryTypeEdge(
            pokemon,
            typeName,
            true,
            123456
        );

        const pk = edge.PK;

        // Act
        await service.putItem(edge);
        const read = await service.getEdges(pk);

        // Assert
        expect(read.length).toBe(1);

        const readEdge = read[0] as PokemonPrimaryTypeEdge;

        expect(readEdge).toBeInstanceOf(PokemonPrimaryTypeEdge);
        expect(readEdge.entityType).toBe(PokemonTypeRelationship.PrimaryType);

        expect(readEdge.isRebalanced).toBe(true);
        expect(readEdge.lastEdited).toBe(123456);

        // structural validation (important for your bug class)
        expect(readEdge.sourceType).toBe("Type");
        expect(readEdge.targetType).toBe(PokemonEntity);
    });

    test("should serialize and deserialize a PrimaryTypeEdge correctly", async () => {
        // Arrange
        const pokemon = new PokemonIdentifier("pokemon", "pikachu");
        const typeName = "electric";

        const edge = new PokemonSecondaryTypeEdge(
            pokemon,
            typeName,
            true,
            123456
        );

        const pk = edge.PK;

        // Act
        await service.putItem(edge);
        const read = await service.getEdges(pk);

        // Assert
        expect(read.length).toBe(2);

        const readEdge = read[0] as PokemonPrimaryTypeEdge;

        expect(readEdge).toBeInstanceOf(PokemonPrimaryTypeEdge);
        expect(readEdge.entityType).toBe(PokemonTypeRelationship.PrimaryType);

        expect(readEdge.isRebalanced).toBe(true);
        expect(readEdge.lastEdited).toBe(123456);

        // structural validation (important for your bug class)
        expect(readEdge.sourceType).toBe("Type");
        expect(readEdge.targetType).toBe(PokemonEntity);
    });
})

describe("PokemonHasAbilityEdge Integration Test", () => {
    test("should serialize and deserialize a PokemonHasAbilityEdge correctly", async () => {
        // Arrange
        const pokemon = new PokemonIdentifier("pokemon", "pikachu");
        const ability = new AbilityIdentifier("ability", "static");

        const edge = new PokemonHasAbilityEdge(
            pokemon,
            ability,
            true,   // isHidden
            false,  // isPlaceholder
            true,   // isRebalanced
            123456
        );

        const pk = edge.PK;

        // Act
        await service.putItem(edge);
        const read = await service.getEdges(pk);

        // Assert
        expect(read.length).toBe(1);

        const readEdge = read[0] as PokemonHasAbilityEdge;

        expect(readEdge).toBeInstanceOf(PokemonHasAbilityEdge);
        expect(readEdge.entityType).toBe(HasAbilityEdgeType);

        // flags
        expect(readEdge.isHidden).toBe(true);
        expect(readEdge.isPlaceholder).toBe(false);
        expect(readEdge.isRebalanced).toBe(true);
        expect(readEdge.lastEdited).toBe(123456);

        // structural integrity (Dynamo layer)
        expect(readEdge.PK).toBe(edge.PK);
        expect(readEdge.SK).toBe(edge.SK);
        expect(readEdge.sourceType).toBe("Ability");
        expect(readEdge.targetType).toBe(PokemonEntity);

        // new domain fields
        expect(readEdge.recipient).toBeInstanceOf(PokemonIdentifier);
        expect(readEdge.recipient.toString()).toBe(pokemon.toString());

        expect(readEdge.abilityIdentifier).toBeInstanceOf(AbilityIdentifier);
        expect(readEdge.abilityIdentifier.toString()).toBe(ability.toString());

        // optional safety: ensure serialization round-trip consistency
        expect(readEdge.serialize().recipient).toEqual(pokemon.serialize());
        expect(readEdge.serialize().abilityIdentifier).toEqual(ability.serialize());
    });
});