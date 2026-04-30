import { DynamoEdge, DynamoNode, getNodePK, getPkName } from '../../../dynamoNodes';
import { PokemonIdentifier } from '../../pokemon';
import { MoveEntity } from './move';

export const MoveSetEntity = "MoveSet";
export const MoveSetOfEdgeType = "MoveSetOf";
export const RebalancedMoveSetOfEdgeType = "RebalancedMoveSetOf";

const enum MoveSetEdgeType {
    LevelUp = "LevelUp",
    Teach = "Teach",
    Egg = "Egg",
    Legacy = "Legacy"
}

export function createMoveSetNode(pokemon: PokemonIdentifier, isPlaceholder: boolean = false): DynamoNode {
    return new MoveSetNode(pokemon.toString(), isPlaceholder);
}

export function createMoveSetLevelUpMoveEdge(moveSetName: string, moveName: string, level: number): DynamoEdge {
    return new MoveSetLevelUpEdge(moveSetName, moveName, level);
}

export function createMoveSetTeachMoveEdge(moveSetName: string, moveName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveSetEntity, moveSetName), MoveSetEdgeType.Teach, MoveEntity, moveName);
}

export function createMoveSetEggMoveEdge(moveSetName: string, moveName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveSetEntity, moveSetName), MoveSetEdgeType.Egg, MoveEntity, moveName);
}

export function createMoveSetLegacyMoveEdge(moveSetName: string, moveName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveSetEntity, moveSetName), MoveSetEdgeType.Legacy, MoveEntity, moveName);
}

class MoveSetNode extends DynamoNode {
    isPlaceholder: boolean;

    constructor(pokemonName: string, isPlaceholder: boolean = false) {
        super(MoveSetEntity, `${pokemonName}${isPlaceholder ? "#Placeholder" : ""}`);
        this.isPlaceholder = isPlaceholder;
    }
}

class MoveSetLevelUpEdge extends DynamoEdge {
    level: number;
    constructor(pokemonName: string, moveName: string, level: number, isReverseEdge: boolean = false) {
        super(getNodePK(isReverseEdge? MoveEntity : MoveSetEntity, pokemonName), 
        MoveSetEdgeType.LevelUp, 
        isReverseEdge? MoveSetEntity : MoveEntity, moveName, isReverseEdge);
        this.level = level;
    }

    reverseEdge(): DynamoEdge {
        return new MoveSetLevelUpEdge(getPkName(this.Target), getPkName(this.PK), this.level, !this.isReverseEdge());
    }
}
