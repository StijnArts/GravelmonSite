import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBGraphService } from "../../../dynamodb-graph/service/dynamoDBGraphService";
import { createGameNode } from "../../../dynamodb-graph/nodes/gameNode";
import { GameData } from "../../../dynamodb-graph/models/gameData";
import {createTestEnv} from "../../testEnv";
import {createEggGroupNode} from "../../../dynamodb-graph/nodes";

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
    const eggGroupNode = createEggGroupNode("test");

    await service.putItem(redGameNode);
    await service.putItem(blueGameNode);
    await service.putItem(eggGroupNode);

    const results = await service.queryByEntityType("Game");

    expect(results.length).toBe(2);
    expect(results[0].entityType).toBe("Game");
    expect(results[1].entityType).toBe("Game");
});

test("should return null when node does not exist", async () => {
    // Act
    const node = await service.getNode("NODE#Game#NonExistentGame");

    // Assert
    expect(node).toBeNull();
});
