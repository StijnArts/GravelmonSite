import { DynamoNode, DynamoEdge, getNodePK, getPkName } from '../../dynamo';
import { FormEntity } from '../form';
import { ItemEntity } from '../minecraft/item';
import { ResourceLocation } from '../minecraft/resourceLocation';
import { PokemonIdentifier } from '../pokemon';
import { NumberRange } from '../properties/numberRange';
import { SpawnablePositionType, SpawnBucket } from './spawning';
import { SpawnPresetEntity } from './spawnPreset';
import { SpawnWeightMultiplier } from './weightMultiplier';
import {SpawnCondition} from "./spawnCondition";
import {BiomeEntity, BiomeTagEntity, DoesNotSpawnInBiomeEdgeType, SpawnsInBiomeEdgeType} from "../minecraft/biome";
import {
    DoesNotSpawnInStructureEdgeType,
    SpawnsInStructureEdgeType,
    StructureEntity,
    StructureTagEntity
} from "../minecraft/structure";

export const SpawnDataEntity = "SpawnData";

export const PartOfHerdEdgeType = "PartOfHerd";
export const SpawnsEdgeType = "Spawns"
export const PreferredBlockEdgeType = "PreferredBlock"
export const RequiredBlockEdgeType = "RequiredBlock"
export const UsesPresetEdgeType = "UsesPreset"

export enum SpawnType {
    Pokemon = "pokemon",
    Pokemon_Herd = "pokemon-herd"
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
    condition?: SpawnCondition;
    antiCondition?: SpawnCondition;
}

export function createSpawnDataNode(
    pokemon: PokemonIdentifier,
    options: SpawnDataOptions
): SpawnDataNode {
    return new SpawnDataNode(pokemon.toString(), options);
}

export function createSpawnDataPartOfHerdFormEdge(spawnDataName: PokemonIdentifier, pokemonFormName: PokemonIdentifier,
                levelRange: NumberRange,
                weight: number,
                levelRangeOffset: NumberRange,
                maxTimes?: number,
                isLeader?: boolean) : PartOfHerdEdge {
    return new PartOfHerdEdge(spawnDataName.toString(), pokemonFormName.toString(), levelRange, weight, levelRangeOffset, maxTimes, isLeader);
}

export function createSpawnDataSpawnsFormEdge(spawnDataName: PokemonIdentifier) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(spawnDataName.toString(), SpawnDataEntity), 
        SpawnsEdgeType, FormEntity, spawnDataName.toString()
    );
}

export function createSpawnDataPreferredBlockItemEdge(spawnDataName: PokemonIdentifier, itemResourceLocation: ResourceLocation) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(spawnDataName.toString(), SpawnDataEntity), 
        PreferredBlockEdgeType, ItemEntity, itemResourceLocation.toString()
    );
}

export function createSpawnDataRequiredBlockItemEdge(spawnDataName: PokemonIdentifier, itemResourceLocation: ResourceLocation) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(spawnDataName.toString(), SpawnDataEntity), 
        RequiredBlockEdgeType, ItemEntity, itemResourceLocation.toString()
    );
}

export function createSpawnDataUsesSpawnPresetEdge(spawnDataName: PokemonIdentifier, spawnPresetName: string) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(spawnDataName.toString(), SpawnDataEntity), 
        UsesPresetEdgeType, SpawnPresetEntity, spawnPresetName
    );
}

export function createSpawnDataDoesNotSpawnInBiomeEdge(spawnDataName: string, biomeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnDataEntity, spawnDataName), DoesNotSpawnInBiomeEdgeType, BiomeEntity, biomeName);
}

export function createSpawnDataDoesNotSpawnInBiomeTagEdge(spawnDataName: string, biomeTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnDataEntity, spawnDataName), DoesNotSpawnInBiomeEdgeType, BiomeTagEntity, biomeTagName);
}

export function createSpawnDataSpawnsInBiomeEdge(spawnDataName: string, biomeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnDataEntity, spawnDataName), SpawnsInBiomeEdgeType, BiomeEntity, biomeName);
}

export function createSpawnDataSpawnsInBiomeTagEdge(spawnDataName: string, biomeTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnDataEntity, spawnDataName), SpawnsInBiomeEdgeType, BiomeTagEntity, biomeTagName);
}

export function createSpawnDataSpawnsInStructureEdge(spawnDataName: string, StructureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnDataEntity, spawnDataName), SpawnsInStructureEdgeType, StructureEntity, StructureName);
}

export function createSpawnDataSpawnsInStructureTagEdge(spawnDataName: string, StructureTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnDataEntity, spawnDataName), SpawnsInStructureEdgeType, StructureTagEntity, StructureTagName);
}

export function createSpawnDataDoesNotSpawnInStructureEdge(spawnDataName: string, StructureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnDataEntity, spawnDataName), DoesNotSpawnInStructureEdgeType, StructureEntity, StructureName);
}

export function createSpawnDataDoesNotSpawnInStructureTagEdge(spawnDataName: string, StructureTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnDataEntity, spawnDataName), DoesNotSpawnInStructureEdgeType, StructureTagEntity, StructureTagName);
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
    spawnDataOptions: SpawnDataOptions;
    constructor(
        name: string,
        options: SpawnDataOptions
    ) {
        super(SpawnDataEntity, name);
        this.spawnDataOptions = options;
    }
}