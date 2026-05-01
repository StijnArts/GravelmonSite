import { DynamoEdge, getNodePK } from '../../service/dynamoNodes';
import { PokemonEntity, PokemonIdentifier } from '../../nodes/pokemon/pokemonNode';
import { MoveEntity, MoveIdentifier, MoveCategory } from '../../nodes/battle/moveNode';
import { deserializerRegistry } from '../../service/deserializerRegistry';

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

function serializeMoveSetEntry(entry: MoveSetEntry): any {
    return {
        moveName: entry.moveName.serialize(),
        category: entry.category,
        basePower: entry.basePower,
        accuracy: entry.accuracy,
        type: entry.type
    }
}

function deserializeMoveSetEntry(data: any): MoveSetEntry {
    return {
        moveName: MoveIdentifier.deserialize(data.moveName),
        category: data.category,
        basePower: data.basePower,
        accuracy: data.accuracy,
        type: data.type
    }
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

export function serializeMoveSet(moveSet: MoveSet): any {
    return {
        levelUpMoves: moveSet.levelUpMoves.map(m => ({ moveName: serializeMoveSetEntry(m.moveName), level: m.level })),
        teachMoves: moveSet.teachMoves.map(serializeMoveSetEntry),
        eggMoves: moveSet.eggMoves.map(serializeMoveSetEntry),
        legacyMoves: moveSet.legacyMoves.map(serializeMoveSetEntry)
    }
}

export function deserializeMoveSet(data: any): MoveSet {
    return {
        levelUpMoves: data.levelUpMoves.map((m: any) => ({ moveName: deserializeMoveSetEntry(m.moveName), level: m.level })),
        teachMoves: data.teachMoves.map(deserializeMoveSetEntry),
        eggMoves: data.eggMoves.map(deserializeMoveSetEntry),
        legacyMoves: data.legacyMoves.map(deserializeMoveSetEntry)
    }
}

class MoveSetEdge extends DynamoEdge {
    isRebalanced: boolean;

    constructor(moveName: MoveIdentifier, pokemonName: PokemonIdentifier, relationship: MoveSetEdgeType, isRebalanced: boolean = false) {
        super(getNodePK(MoveEntity, moveName.toString()), relationship, PokemonEntity, pokemonName.toString());
        this.isRebalanced = isRebalanced;
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            isRebalanced: this.isRebalanced
        }
    }

    public static deserialize(data: Record<string, any>): MoveSetEdge {
        return new MoveSetEdge(
            MoveIdentifier.deserialize(data.PK.split("#").slice(1).join("#")),
            PokemonIdentifier.deserialize(data.SK),
            data.relationship as MoveSetEdgeType,
            data.isRebalanced || false
        );
    }
}

class MoveSetLevelUpEdge extends MoveSetEdge {
    level: number;

    constructor(moveName: MoveIdentifier, pokemonName: PokemonIdentifier, level: number) {
        super(moveName, pokemonName, MoveSetEdgeType.LevelUp);
        this.level = level;
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            level: this.level
        }
    }

    public static deserialize(data: Record<string, any>): MoveSetLevelUpEdge {
        return new MoveSetLevelUpEdge(
            MoveIdentifier.deserialize(data.PK.split("#").slice(1).join("#")),
            PokemonIdentifier.deserialize(data.SK),
            data.level
        );
    }
}

deserializerRegistry.register(MoveSetEdgeType.LevelUp, MoveSetLevelUpEdge.deserialize);
deserializerRegistry.register(MoveSetEdgeType.Teach, MoveSetEdge.deserialize);
deserializerRegistry.register(MoveSetEdgeType.Egg, MoveSetEdge.deserialize);
deserializerRegistry.register(MoveSetEdgeType.Legacy, MoveSetEdge.deserialize);
