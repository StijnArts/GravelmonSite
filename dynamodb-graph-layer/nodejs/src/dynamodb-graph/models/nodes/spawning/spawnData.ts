import { DynamoNode, DynamoEdge, getNodePK, getPkName } from '../../dynamo';
import { FormEntity } from '../form';
import { ItemEntity } from '../minecraft/item';
import { ResourceLocation } from '../minecraft/resourceLocation';
import { PokemonIdentifier } from '../pokemon';
import { NumberRange } from '../properties/numberRange';
import { SpawnablePositionType, SpawnBucket } from './spawning';
import { SpawnPresetEntity } from './spawnPreset';
import { SpawnWeightMultiplier } from './weightMultiplier';

export const SpawnDataEntity = "SpawnData";

export const PartOfHerdEdgeType = "PartOfHerd";
export const SpawnsEdgeType = "Spawns"
export const PreferredBlockEdgeType = "PreferredBlock"
export const RequiredBlockEdgeType = "RequiredBlock"
export const UsesPresetEdgeType = "UsesPreset"

export enum SpawnType {
    Pokemon = "pokemon", Pokemon_Herd = "pokemon-herd"
}

export interface SpawnDataOptions {
    levelRange: NumberRange;
    spawnType: SpawnType;
    spawnWeight: number;
    spawnablePositionTypes: SpawnablePositionType;
    spawnBucket: SpawnBucket;
    moonPhaseMultiplier?: SpawnWeightMultiplier;
    weightMultiplier?: SpawnWeightMultiplier;
    maxHerdSize?: number;
    minDistanceBetweenSpawns?: number;
}

export function createSpawnDataNode(
    pokemon: PokemonIdentifier,
    options: SpawnDataOptions
): SpawnDataNode {
    return new SpawnDataNode(pokemon.toString(), options);
}

export function createPartOfHerdEdge(spawnDataName: PokemonIdentifier, pokemonFormName: PokemonIdentifier, 
                levelRange: NumberRange,
                weight: number,
                levelRangeOffset: NumberRange,
                maxTimes?: number,
                isLeader?: boolean) : PartOfHerdEdge {
    return new PartOfHerdEdge(spawnDataName.toString(), pokemonFormName.toString(), levelRange, weight, levelRangeOffset, maxTimes, isLeader);
}

export function createSpawnDataSpawnsEdge(spawnDataName: PokemonIdentifier) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(spawnDataName.toString(), SpawnDataEntity), 
        SpawnsEdgeType, FormEntity, spawnDataName.toString()
    );
}

export function createSpawnDataPreferredBlockEdge(spawnDataName: PokemonIdentifier, itemResourceLocation: ResourceLocation) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(spawnDataName.toString(), SpawnDataEntity), 
        PreferredBlockEdgeType, ItemEntity, itemResourceLocation.toString()
    );
}

export function createSpawnDataRequiredBlockEdge(spawnDataName: PokemonIdentifier, itemResourceLocation: ResourceLocation) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(spawnDataName.toString(), SpawnDataEntity), 
        RequiredBlockEdgeType, ItemEntity, itemResourceLocation.toString()
    );
}

export function createSpawnDataUsesPresetEdge(spawnDataName: PokemonIdentifier, spawnPresetName: string) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(spawnDataName.toString(), SpawnDataEntity), 
        UsesPresetEdgeType, SpawnPresetEntity, spawnPresetName
    );
}

class PartOfHerdEdge extends DynamoEdge {
    levelRange: NumberRange;
    weight: number;
    maxTimes?: number;
    isLeader?: boolean;
    levelRangeOffset: NumberRange;

    constructor(sourceName: string, targetName: string, levelRange: NumberRange,
                weight: number,
                levelRangeOffset: NumberRange,
                maxTimes?: number,
                isLeader?: boolean, 
                isReverseEdge: boolean = false) {
        super(getNodePK(isReverseEdge? FormEntity : SpawnDataEntity, sourceName), 
        PartOfHerdEdgeType, 
        isReverseEdge? SpawnDataEntity : FormEntity, targetName, isReverseEdge);
        this.levelRange = levelRange;
        this.weight = weight;
        this.levelRangeOffset = levelRangeOffset;
        this.maxTimes = maxTimes;
        this.isLeader = isLeader;
    }
    
    reverseEdge(): DynamoEdge {
        return new PartOfHerdEdge(getPkName(this.Target), getPkName(this.PK), this.levelRange, 
        this.weight, this.levelRangeOffset, this.maxTimes, this.isLeader, !this.isReverseEdge());
    }
}


class SpawnDataNode extends DynamoNode {
    spawnType: SpawnType;
    levelRange: NumberRange;
    spawnWeight: number;
    moonPhaseMultiplier?: SpawnWeightMultiplier;
    spawnablePositionTypes: SpawnablePositionType;
    spawnBucket: SpawnBucket;

    maxHerdSize?: number;
    minDistanceBetweenSpawns?: number;

    weightMultiplier?: SpawnWeightMultiplier;
    constructor(
        name: string,
        options: SpawnDataOptions
    ) {
        super(SpawnDataEntity, name);
        this.spawnType = options.spawnType;
        this.levelRange = options.levelRange;
        this.spawnWeight = options.spawnWeight;
        this.spawnablePositionTypes = options.spawnablePositionTypes;
        this.spawnBucket = options.spawnBucket;

        this.moonPhaseMultiplier = options.moonPhaseMultiplier;
        this.weightMultiplier = options.weightMultiplier;
        this.maxHerdSize = options.maxHerdSize;
        this.minDistanceBetweenSpawns = options.minDistanceBetweenSpawns;
    }
}