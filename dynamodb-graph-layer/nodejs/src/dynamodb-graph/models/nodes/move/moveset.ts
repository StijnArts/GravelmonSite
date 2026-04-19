import { DynamoEdge, DynamoNode, getNodePK } from '../../dynamo';
import { PokemonIdentifier } from '../pokemon';
import { MoveEntity } from './move';

const MovesetEntity = "Moveset";
const enum MovesetEdgeType {
    LevelUp = "LevelUp",
    Teach = "Teach",
    Egg = "Egg",
    Legacy = "Legacy"
}

export function createMovesetNode(pokemon: PokemonIdentifier): DynamoNode {
    return new DynamoNode(MovesetEntity, pokemon.toString());
}

export function createMovesetLevelUpEdge(movesetName: string, moveName: string, level: number): DynamoEdge {
    return new MovesetLevelUpEdge(movesetName, moveName, level);
}

export function createMovesetTeachEdge(movesetName: string, moveName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MovesetEntity, movesetName), MovesetEdgeType.Teach, MoveEntity, moveName);
}

export function createMovesetEggEdge(movesetName: string, moveName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MovesetEntity, movesetName), MovesetEdgeType.Egg, MoveEntity, moveName);
}

export function createMovesetLegacyEdge(movesetName: string, moveName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MovesetEntity, movesetName), MovesetEdgeType.Legacy, MoveEntity, moveName);
}

class MovesetLevelUpEdge extends DynamoEdge {
    level: number;
    constructor(movesetName: string, moveName: string, level: number) {
        super(getNodePK(MovesetEntity, movesetName), MovesetEdgeType.LevelUp, MoveEntity, moveName);
        this.level = level;
    }
}
