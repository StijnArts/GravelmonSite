import {DynamoNode} from '../service/dynamoNodes';
import {MoveIdentifier} from "./battle/moveNode";
import {PokemonIdentifier} from "./pokemon/pokemonNode";
import {ResourceLocation} from "../models/minecraft/resourceLocation";

export const GameEntity = "Game";

export const IntroducesEdgeType = "Introduces";

export function createGameNode(gameData: GameData): GameNode {
    return new GameNode(gameData);
}

interface GameData {
    name: string;
    developer: string;
    wikiPage: string;
    isPermitted: boolean;
    s3LogoLocation?: string;
    introducesPokemon: Record<number, PokemonIdentifier>; //dex number to pokemon identifier
    introducesItem: ResourceLocation[];
    introducesMoves: MoveIdentifier[];
    introducesAbilities: string[];
    introducesAspects: string[];
    introducesMechanics: string[];
    introducesTypes: string[];
}

class GameNode extends DynamoNode {
    gameData: GameData;

    constructor(gameData: GameData) {
        super(GameEntity, gameData.name);
        this.gameData = gameData;
    }
}