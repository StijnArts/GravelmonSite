import { DynamoEdge, DynamoNode, getNodePK, getPkName } from '../../../dynamo';
import { PokemonIdentifier } from '../../pokemon';
import { MoveEntity } from './move';

export const MovesetEntity = "Moveset";
export const MovesetOfEdgeType = "MovesetOf";

const enum MovesetEdgeType {
    LevelUp = "LevelUp",
    Teach = "Teach",
    Egg = "Egg",
    Legacy = "Legacy"
}

export function createMovesetNode(pokemon: PokemonIdentifier, isPlaceholder: boolean = false): DynamoNode {
    return new MovesetNode(pokemon.toString(), isPlaceholder);
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

class MovesetNode extends DynamoNode {
    isPlaceholder: boolean;

    constructor(pokemonName: string, isPlaceholder: boolean = false) {
        super(MovesetEntity, `${pokemonName}${isPlaceholder ? "#Placeholder" : ""}`);
        this.isPlaceholder = isPlaceholder;
    }
}

class MovesetLevelUpEdge extends DynamoEdge {
    level: number;
    constructor(pokemonName: string, moveName: string, level: number, isReverseEdge: boolean = false) {
        super(getNodePK(isReverseEdge? MoveEntity : MovesetEntity, pokemonName), 
        MovesetEdgeType.LevelUp, 
        isReverseEdge? MovesetEntity : MoveEntity, moveName, isReverseEdge);
        this.level = level;
    }

    reverseEdge(): DynamoEdge {
        return new MovesetLevelUpEdge(getPkName(this.Target), getPkName(this.PK), this.level, !this.isReverseEdge());
    }
}
