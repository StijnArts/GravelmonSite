import {DynamoNode} from '../service/dynamoNodes';
import {MoveIdentifier} from "./battle/moveNode";
import {PokemonIdentifier} from "./pokemon/pokemonNode";
import {ResourceLocation} from "../models/minecraft/resourceLocation";
import { deserializerRegistry } from '../service/deserializerRegistry';
import { GameData } from '../models/gameData';

export const GameEntity = "Game";

export const IntroducesEdgeType = "Introduces";

export function createGameNode(gameData: GameData): GameNode {
    return new GameNode(gameData);
}

export function deserializeGameNode(data: Record<string, any>): GameNode {
    return new GameNode(data.gameData);
}

class GameNode extends DynamoNode {
    gameData: GameData;
    static version = 1;

    constructor(gameData: GameData, lastEdited: number = Date.now()) {
        super(GameEntity, gameData.name, GameNode.version, lastEdited);
        this.gameData = gameData;
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        const rawGameData = data.gameData;
        const gameData: GameData = {
            name: rawGameData.name,
            namespace: rawGameData.namespace,
            developer: rawGameData.developer,
            wikiPage: rawGameData.wikiPage,
            isPermitted: rawGameData.isPermitted,
            s3LogoLocation: rawGameData.s3LogoLocation,
                introducesPokemon: Object.fromEntries(
                    Object.entries(rawGameData.introducesPokemon).map(
                        ([key, pokemon]) => [
                            key,
                            PokemonIdentifier.deserialize(pokemon)
                        ]
                    )
                ),
            introducesItem: rawGameData.introducesItem.map((item: any) => new ResourceLocation(item.namespace, item.path)),
            introducesMoves: rawGameData.introducesMoves.map((move: any) => new MoveIdentifier(move.game, move.move)),
            introducesAbilities: rawGameData.introducesAbilities,
            introducesAspects: rawGameData.introducesAspects,
            introducesMechanics: rawGameData.introducesMechanics,
            introducesTypes: rawGameData.introducesTypes
        };
        return new GameNode(gameData, data.lastEdited);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            gameData: {
                name: this.gameData.name,
                namespace: this.gameData.namespace,
                developer: this.gameData.developer,
                wikiPage: this.gameData.wikiPage,
                isPermitted: this.gameData.isPermitted,
                s3LogoLocation: this.gameData.s3LogoLocation,
                introducesPokemon: Object.fromEntries(
                    Object.entries(this.gameData.introducesPokemon).map(([key, value]) => [
                        key,
                        value.serialize()
                    ])
                ),
                introducesItem: this.gameData.introducesItem.map(item => item.serialize()),
                introducesMoves: this.gameData.introducesMoves.map(move => move.serialize()),
                introducesAbilities: this.gameData.introducesAbilities,
                introducesAspects: this.gameData.introducesAspects,
                introducesMechanics: this.gameData.introducesMechanics,
                introducesTypes: this.gameData.introducesTypes
            }
        }
    }
}

deserializerRegistry.register(GameEntity, GameNode.deserialize);