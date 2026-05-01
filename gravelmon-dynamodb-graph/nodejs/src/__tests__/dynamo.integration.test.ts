import {
    DynamoDBClient,
    CreateTableCommand,
    DeleteTableCommand,
    DescribeTableCommand
} from "@aws-sdk/client-dynamodb";
import { DynamoDBGraphService } from "../dynamodb-graph/service/dynamoDBGraphService";
import { createGameNode, GameEntity } from "../dynamodb-graph/nodes/gameNode";
import { getNodePK } from "../dynamodb-graph/service/dynamoNodes";
import { PokemonIdentifier } from "../dynamodb-graph/nodes";
import { MoveIdentifier } from "../dynamodb-graph/nodes";
import { ResourceLocation } from "../dynamodb-graph/models/minecraft/resourceLocation";
import { GameData } from "../dynamodb-graph/models/gameData";

const tableName = process.env.DYNAMODB_TABLE || "TestGraphTable";
const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";

let dynamoClient: DynamoDBClient;
let service: DynamoDBGraphService;

beforeAll(async () => {
    // Create DynamoDB client pointing to local instance
    dynamoClient = new DynamoDBClient({
        endpoint,
        region: "us-east-1",
        credentials: {
            accessKeyId: "dummy",
            secretAccessKey: "dummy"
        }
    });

    // Create test table
    await createTestTable();
    
    // Initialize service
    service = new DynamoDBGraphService(tableName, dynamoClient);
});

afterAll(async () => {
    // Clean up: delete test table
    if (dynamoClient) {
        try {
            await dynamoClient.send(
                new DeleteTableCommand({ TableName: tableName })
            );
        } catch (error) {
            console.error("Failed to delete test table:", error);
        }
        dynamoClient.destroy();
    }
});

async function createTestTable(): Promise<void> {
    try {
        // Check if table exists
        await dynamoClient.send(
            new DescribeTableCommand({ TableName: tableName })
        );
    } catch (error: any) {
        if (error.name === "ResourceNotFoundException") {
            // Table doesn't exist, create it
            await dynamoClient.send(
                new CreateTableCommand({
                    TableName: tableName,
                    KeySchema: [
                        { AttributeName: "PK", KeyType: "HASH" },
                        { AttributeName: "SK", KeyType: "RANGE" }
                    ],

                    AttributeDefinitions: [
                        { AttributeName: "PK", AttributeType: "S" },
                        { AttributeName: "SK", AttributeType: "S" },
                        { AttributeName: "entityType", AttributeType: "S" } // <-- REQUIRED for GSI
                    ],

                    GlobalSecondaryIndexes: [
                        {
                            IndexName: "GSI1-EntityType",
                            KeySchema: [
                                { AttributeName: "entityType", KeyType: "HASH" },
                                { AttributeName: "PK", KeyType: "RANGE" }
                            ],
                            Projection: {
                                ProjectionType: "ALL"
                            }
                        }
                    ],

                    BillingMode: "PAY_PER_REQUEST"
                })
            );

            // Wait for table to be created
            await waitForTable();
        } else {
            throw error;
        }
    }
}

async function waitForTable(): Promise<void> {
    let attempts = 0;

    while (attempts < 30) {
        const res = await dynamoClient.send(
            new DescribeTableCommand({ TableName: tableName })
        );

        const table = res.Table;

        const gsi = table?.GlobalSecondaryIndexes?.find(
            i => i.IndexName === "GSI1-EntityType"
        );

        if (table?.TableStatus === "ACTIVE" && gsi?.IndexStatus === "ACTIVE") {
            return;
        }

        await new Promise(r => setTimeout(r, 200));
        attempts++;
    }

    throw new Error("Timeout waiting for table + GSI");
}

test("should query nodes by entityType using GSI", async () => {
    const redGameData: GameData = {
        name: "Pokemon Red",
        developer: "Game Freak",
        wikiPage: "https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Red",
        isPermitted: true,
        s3LogoLocation: "pokemon-logos/red.png",
        introducesPokemon: {},
        introducesItem: [],
        introducesMoves: [],
        introducesAbilities: [],
        introducesAspects: [],
        introducesMechanics: [],
        introducesTypes: []
    };
    const blueGameData: GameData = {
        name: "Pokemon Blue",
        developer: "Game Freak",
        wikiPage: "https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Red",
        isPermitted: true,
        s3LogoLocation: "pokemon-logos/red.png",
        introducesPokemon: {},
        introducesItem: [],
        introducesMoves: [],
        introducesAbilities: [],
        introducesAspects: [],
        introducesMechanics: [],
        introducesTypes: []
    };

    const redGameNode = createGameNode(redGameData);
    const blueGameNode = createGameNode(blueGameData);

    await service.putItem(redGameNode);
    await service.putItem(blueGameNode);

    const results = await service.queryByEntityType("Game");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entityType).toBe("Game");
});

describe("GameNode Integration Tests", () => {
    const introducedPokemon = {
        1: new PokemonIdentifier("Red", "Bulbasaur", "Normal"),
        2: new PokemonIdentifier("Red", "Ivysaur", "Normal"),
        3: new PokemonIdentifier("Red", "Venusaur", "Normal")
    };
    const introducedItems = [
        new ResourceLocation("pokemon", "item/pokedex"),
        new ResourceLocation("pokemon", "item/pokeball")
    ];
    const introducedMoves = [
        new MoveIdentifier("Red", "Tackle"),
        new MoveIdentifier("Red", "Ember")
    ];

    test("should write and read a GameNode from DynamoDB", async () => {
        // Arrange: Create sample game data
        const gameData : GameData = {
            name: "Pokemon Red",
            developer: "Game Freak",
            wikiPage: "https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Red",
            isPermitted: true,
            s3LogoLocation: "pokemon-logos/red.png",
            introducesPokemon: introducedPokemon,
            introducesItem: introducedItems,
            introducesMoves: introducedMoves,
            introducesAbilities: ["Overgrow", "Blaze"],
            introducesAspects: ["Pokemon"],
            introducesMechanics: ["Experience", "Leveling"],
            introducesTypes: ["Normal", "Fire", "Water", "Grass"]
        };

        const gameNode = createGameNode(gameData);
        const pk = getNodePK(GameEntity, gameData.name);

        // Act: Write the node to DynamoDB
        await service.putItem(gameNode);

        // Act: Read it back
        const readNode = await service.getNode(pk);

        // Assert
        expect(readNode).not.toBeNull();
        expect(readNode?.name).toBe(gameData.name);
        expect(readNode?.entityType).toBe(GameEntity);
        
        // Verify it's a GameNode with proper data
        if (readNode && 'gameData' in readNode) {
            expect((readNode as any).gameData.developer).toBe(gameData.developer);
            expect((readNode as any).gameData.wikiPage).toBe(gameData.wikiPage);
            expect((readNode as any).gameData.isPermitted).toBe(true);
            expect((readNode as any).gameData.introducesTypes).toEqual(["Normal", "Fire", "Water", "Grass"]);
            expect((readNode as any).gameData.introducesPokemon).toEqual(introducedPokemon);
            expect((readNode as any).gameData.introducesItem).toEqual(introducedItems);
            expect((readNode as any).gameData.introducesMoves).toEqual(introducedMoves);
        }
    });

    test("should return null when node does not exist", async () => {
        // Act
        const node = await service.getNode("NODE#Game#NonExistentGame");

        // Assert
        expect(node).toBeNull();
    });

    test("should write multiple GameNodes and retrieve them", async () => {
        // Arrange
        const games: GameData[] = [
            {
                name: "Pokemon Blue",
                developer: "Game Freak",
                wikiPage: "https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Blue",
                isPermitted: true,
                introducesPokemon: {},
                introducesItem: [],
                introducesMoves: [],
                introducesAbilities: [],
                introducesAspects: [],
                introducesMechanics: [],
                introducesTypes: []
            },
            {
                name: "Pokemon Yellow",
                developer: "Game Freak",
                wikiPage: "https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Yellow",
                isPermitted: true,
                introducesPokemon: {},
                introducesItem: [],
                introducesMoves: [],
                introducesAbilities: [],
                introducesAspects: [],
                introducesMechanics: [],
                introducesTypes: []
            }
        ];

        // Act: Write both nodes
        for (const gameData of games) {
            const gameNode = createGameNode(gameData);
            await service.putItem(gameNode);
        }

        // Act: Read them back individually
        const blueNode = await service.getNode(getNodePK(GameEntity, "Pokemon Blue"));
        const yellowNode = await service.getNode(getNodePK(GameEntity, "Pokemon Yellow"));

        // Assert
        expect(blueNode?.name).toBe("Pokemon Blue");
        expect(yellowNode?.name).toBe("Pokemon Yellow");
    });
});
