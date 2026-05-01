import { DynamoNode, DynamoEdge, getNodePK, getPkName } from '../../service/dynamoNodes';
import { FormEntity } from '../../nodes/pokemon/formNode';
import { ItemEntity } from '../../nodes/minecraft/itemNode';
import { ResourceLocation } from '../minecraft/resourceLocation';
import { PokemonIdentifier } from '../../nodes/pokemon/pokemonNode';
import { NumberRange } from '../properties/numberRange';
import { SpawnablePositionType, SpawnBucket } from './spawning';
import { SpawnPresetEntity } from '../../nodes/spawning/spawnPresetNode';
import { SpawnWeightMultiplier } from './weightMultiplier';
import {SpawnCondition} from "./spawnCondition";
import {BiomeEntity, BiomeTagEntity, DoesNotSpawnInBiomeEdgeType, SpawnsInBiomeEdgeType} from "../../nodes/minecraft/biomeNode";
import {
    DoesNotSpawnInStructureEdgeType,
    SpawnsInStructureEdgeType,
    StructureEntity,
    StructureTagEntity
} from "../../nodes/minecraft/structureNode";

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

interface HerdSpawnEntry {
    pokemonIdentifier: PokemonIdentifier;
    levelRange: NumberRange;
    weight: number;
    maxTimes?: number;
    isLeader?: boolean;
    levelRangeOffset: NumberRange;
}


export interface SpawnDataNode  {
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
    herdSpawnEntries?: HerdSpawnEntry[];
    preferredBlocks?: ResourceLocation[];
    requiredBlocks?: ResourceLocation[];

}

// Note: The edges between spawn data and biomes/structures are stored in the same direction as the edges between spawn presets and biomes/structures,
// since it is more intuitive to traverse from biomes/structures to spawn data than the other way around.
export function createSpawnDataUsesSpawnPresetEdge(spawnDataName: PokemonIdentifier, spawnPresetName: string) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(SpawnPresetEntity, spawnPresetName), 
        UsesPresetEdgeType, spawnDataName.toPK(), SpawnDataEntity
    );
}

export function createSpawnDataPrefersBlockEdge(spawnDataName: PokemonIdentifier, blockName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ItemEntity, blockName.toString()), PreferredBlockEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataRequiresBlockEdge(spawnDataName: PokemonIdentifier, blockName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ItemEntity, blockName.toString()), RequiredBlockEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataDoesNotSpawnInBiomeEdge(spawnDataName: PokemonIdentifier, biomeName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeEntity, biomeName.toString()), DoesNotSpawnInBiomeEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataDoesNotSpawnInBiomeTagEdge(spawnDataName: PokemonIdentifier, biomeTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName.toString()), DoesNotSpawnInBiomeEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataSpawnsInBiomeEdge(spawnDataName: PokemonIdentifier, biomeName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeEntity, biomeName.toString()), SpawnsInBiomeEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataSpawnsInBiomeTagEdge(spawnDataName: PokemonIdentifier, biomeTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName.toString()), SpawnsInBiomeEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataSpawnsInStructureEdge(spawnDataName: PokemonIdentifier, StructureName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureEntity, StructureName.toString()), SpawnsInStructureEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataSpawnsInStructureTagEdge(spawnDataName: PokemonIdentifier, StructureTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName.toString()), SpawnsInStructureEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataDoesNotSpawnInStructureEdge(spawnDataName: PokemonIdentifier, StructureName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureEntity, StructureName.toString()), DoesNotSpawnInStructureEdgeType, SpawnDataEntity, spawnDataName.toPK());
}

export function createSpawnDataDoesNotSpawnInStructureTagEdge(spawnDataName: PokemonIdentifier, StructureTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName.toString()), DoesNotSpawnInStructureEdgeType, SpawnDataEntity, spawnDataName.toPK());
}