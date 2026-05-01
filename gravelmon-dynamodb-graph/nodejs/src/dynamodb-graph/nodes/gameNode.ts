import {DynamoNode} from '../service/dynamoNodes';
import {MoveIdentifier} from "./battle/moveNode";
import {PokemonIdentifier} from "./pokemon/pokemonNode";
import {ResourceLocation} from "../models/minecraft/resourceLocation";
import { deserializerRegistry } from '../service/deserializerRegistry';

export const GameEntity = "Game";

export const IntroducesEdgeType = "Introduces";

export function createGameNode(gameData: GameData): GameNode {
    return new GameNode(gameData);
}

export function deserializeGameNode(data: Record<string, any>): GameNode {
    return new GameNode(data.gameData);
}

export interface GameData {
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

    static deserialize(data: Record<string, any>): DynamoNode {
        const rawGameData = data.gameData;
        const gameData: GameData = {
            name: rawGameData.name,
            developer: rawGameData.developer,
            wikiPage: rawGameData.wikiPage,
            isPermitted: rawGameData.isPermitted,
            s3LogoLocation: rawGameData.s3LogoLocation,
            introducesPokemon: Object.entries(rawGameData.introducesPokemon).reduce(
                (acc, [key, pokemon]: [string, any]) => {
                    acc[parseInt(key)] = new PokemonIdentifier(pokemon.game, pokemon.pokemon, pokemon.formName);
                    return acc;
                },
                {} as Record<number, PokemonIdentifier>
            ),
            introducesItem: rawGameData.introducesItem.map((item: any) => new ResourceLocation(item.namespace, item.path)),
            introducesMoves: rawGameData.introducesMoves.map((move: any) => new MoveIdentifier(move.game, move.move)),
            introducesAbilities: rawGameData.introducesAbilities,
            introducesAspects: rawGameData.introducesAspects,
            introducesMechanics: rawGameData.introducesMechanics,
            introducesTypes: rawGameData.introducesTypes
        };
        return new GameNode(gameData);
    }

    static register() {
        deserializerRegistry.register(GameEntity, GameNode.deserialize);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            gameData: {
                name: this.gameData.name,
                developer: this.gameData.developer,
                wikiPage: this.gameData.wikiPage,
                isPermitted: this.gameData.isPermitted,
                s3LogoLocation: this.gameData.s3LogoLocation,
                introducesPokemon: Object.entries(this.gameData.introducesPokemon).reduce(
                    (acc, [key, identifier]) => {
                        acc[key] = {
                            game: identifier.game,
                            pokemon: identifier.pokemon,
                            ...(identifier.formName && { formName: identifier.formName })
                        };
                        return acc;
                    },
                    {} as Record<string, any>
                ),
                introducesItem: this.gameData.introducesItem.map(item => ({
                    namespace: item.namespace,
                    path: item.path
                })),
                introducesMoves: this.gameData.introducesMoves.map(move => ({
                    game: move.game,
                    move: move.move
                })),
                introducesAbilities: this.gameData.introducesAbilities,
                introducesAspects: this.gameData.introducesAspects,
                introducesMechanics: this.gameData.introducesMechanics,
                introducesTypes: this.gameData.introducesTypes
            }
        }
    }
}

GameNode.register();