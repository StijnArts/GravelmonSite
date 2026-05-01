import { DynamoEdge, getNodePK } from '../../service/dynamoNodes';
import { PokemonEntity, PokemonIdentifier } from '../../nodes/pokemon/pokemonNode';
import { MoveEntity, MoveIdentifier, MoveCategory } from '../../nodes/battle/moveNode';

const enum MoveSetEdgeType {
    LevelUp = "LevelUp",
    Teach = "Teach",
    Egg = "Egg",
    Legacy = "Legacy"
}

//edges pointing towards pokemon from other nodes, used to easily query all related nodes of a moveset
export function createMoveSetLevelUpMoveEdge(pokemonName: PokemonIdentifier, moveName: MoveIdentifier, level: number): DynamoEdge {
    return new MoveSetLevelUpEdge(moveName, pokemonName, level);
}

export function createMoveSetTeachMoveEdge(pokemonName: PokemonIdentifier, moveName: MoveIdentifier): DynamoEdge {
    return new MoveSetEdge(moveName, pokemonName, MoveSetEdgeType.Teach);
}

export function createMoveSetEggMoveEdge(pokemonName: PokemonIdentifier, moveName: MoveIdentifier): DynamoEdge {
    return new MoveSetEdge(moveName, pokemonName, MoveSetEdgeType.Egg);
}

export function createMoveSetLegacyMoveEdge(pokemonName: PokemonIdentifier, moveName: MoveIdentifier): DynamoEdge {
    return new MoveSetEdge(moveName, pokemonName, MoveSetEdgeType.Legacy);
}

export interface MoveSetEntry {
    moveName: MoveIdentifier;
    category: MoveCategory;
    basePower: number;
    accuracy: number;
    type: string;
}

export interface MoveSet {
    levelUpMoves: {
        moveName: MoveSetEntry;
        level: number;
    }[];
    teachMoves: MoveSetEntry[];
    eggMoves: MoveSetEntry[];
    legacyMoves: MoveSetEntry[];
}

class MoveSetEdge extends DynamoEdge {
    isRebalanced: boolean;

    constructor(moveName: MoveIdentifier, pokemonName: PokemonIdentifier, relationship: MoveSetEdgeType, isRebalanced: boolean = false) {
        super(getNodePK(MoveEntity, moveName.toString()), relationship, PokemonEntity, pokemonName.toPK());
        this.isRebalanced = isRebalanced;
    }
}

class MoveSetLevelUpEdge extends MoveSetEdge {
    level: number;

    constructor(moveName: MoveIdentifier, pokemonName: PokemonIdentifier, level: number) {
        super(moveName, pokemonName, MoveSetEdgeType.LevelUp);
        this.level = level;
    }
}
