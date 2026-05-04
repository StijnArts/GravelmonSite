import { DynamoNode, DynamoEdge, getNodePK } from '../../service/dynamoNodes';
import { FormEntity } from '../../nodes/pokemon/formNode';
import { ItemEntity } from '../../nodes/minecraft/itemNode';
import { ResourceLocation } from '../minecraft/resourceLocation';
import { PokemonIdentifier } from '../../nodes/pokemon/pokemonNode';
import { NumberRange } from '../properties/numberRange';
import { SpawnablePositionType, SpawnBucket } from './spawning';
import { SpawnPresetEntity } from '../../nodes/spawning/spawnPresetNode';
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

function serializeHerdSpawnEntry(herdSpawnEntry: HerdSpawnEntry): any {
    return {
        pokemonIdentifier: herdSpawnEntry.pokemonIdentifier.serialize(),
        levelRange: herdSpawnEntry.levelRange.serialize(),
        weight: herdSpawnEntry.weight,
        maxTimes: herdSpawnEntry.maxTimes,
        isLeader: herdSpawnEntry.isLeader,
        levelRangeOffset: herdSpawnEntry.levelRangeOffset.serialize()
    }
}

function deserializeHerdSpawnEntry(data: any): HerdSpawnEntry {
    return {
        pokemonIdentifier: PokemonIdentifier.deserialize(data.pokemonIdentifier),
        levelRange: NumberRange.deserialize(data.levelRange),
        weight: data.weight,
        maxTimes: data.maxTimes,
        isLeader: data.isLeader,
        levelRangeOffset: NumberRange.deserialize(data.levelRangeOffset)
    }
}

export interface SpawnData {
    levelRange: NumberRange;
    spawnType: SpawnType;
    spawnWeight: number;
    spawnablePositionTypes: SpawnablePositionType;
    spawnBucket: SpawnBucket;

    moonPhaseMultiplier?: number;
    weightMultiplier?: number;

    maxHerdSize?: number;
    minDistanceBetweenSpawns?: number;
    
    condition?: SpawnCondition;
    antiCondition?: SpawnCondition;
    herdSpawnEntries?: HerdSpawnEntry[];
    preferredBlocks?: ResourceLocation[];
    requiredBlocks?: ResourceLocation[];
}

export function serializeSpawnData(spawnDataNode: SpawnData): any {
    return {
        levelRange: spawnDataNode.levelRange.serialize(),
        spawnType: spawnDataNode.spawnType,
        spawnWeight: spawnDataNode.spawnWeight,
        spawnablePositionTypes: spawnDataNode.spawnablePositionTypes,
        spawnBucket: spawnDataNode.spawnBucket,
        moonPhaseMultiplier: spawnDataNode.moonPhaseMultiplier,
        weightMultiplier: spawnDataNode.weightMultiplier,
        maxHerdSize: spawnDataNode.maxHerdSize,
        minDistanceBetweenSpawns: spawnDataNode.minDistanceBetweenSpawns,
        condition: spawnDataNode.condition?.serialize(),
        antiCondition: spawnDataNode.antiCondition?.serialize(),
        herdSpawnEntries: spawnDataNode.herdSpawnEntries?.map(serializeHerdSpawnEntry),
        preferredBlocks: spawnDataNode.preferredBlocks?.map(block => block.serialize()),
        requiredBlocks: spawnDataNode.requiredBlocks?.map(block => block.serialize())
    }
}

export function deserializeSpawnData(data: any): SpawnData {
    return {
        levelRange: NumberRange.deserialize(data.levelRange),
        spawnType: data.spawnType,
        spawnWeight: data.spawnWeight,
        spawnablePositionTypes: data.spawnablePositionTypes,
        spawnBucket: data.spawnBucket,
        moonPhaseMultiplier: data.moonPhaseMultiplier,
        weightMultiplier: data.weightMultiplier,
        maxHerdSize: data.maxHerdSize,
        minDistanceBetweenSpawns: data.minDistanceBetweenSpawns,
        condition: data.condition ? SpawnCondition.deserialize(data.condition) : undefined,
        antiCondition: data.antiCondition ? SpawnCondition.deserialize(data.antiCondition) : undefined,
        herdSpawnEntries: data.herdSpawnEntries?.map(deserializeHerdSpawnEntry),
        preferredBlocks: data.preferredBlocks?.map((block: any) => ResourceLocation.deserialize(block)),
        requiredBlocks: data.requiredBlocks?.map((block: any) => ResourceLocation.deserialize(block))
    }
}

// Note: The edges between spawn data and biomes/structures are stored in the same direction as the edges between spawn presets and biomes/structures,
// since it is more intuitive to traverse from biomes/structures to spawn data than the other way around.
export function createSpawnDataUsesSpawnPresetEdge(spawnDataName: PokemonIdentifier, spawnPresetName: string) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(SpawnPresetEntity, spawnPresetName), 
        UsesPresetEdgeType, spawnDataName.toString(), SpawnDataEntity
    );
}

export function createSpawnDataPrefersBlockEdge(spawnDataName: PokemonIdentifier, blockName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ItemEntity, blockName.toString()), PreferredBlockEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataRequiresBlockEdge(spawnDataName: PokemonIdentifier, blockName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ItemEntity, blockName.toString()), RequiredBlockEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataDoesNotSpawnInBiomeEdge(spawnDataName: PokemonIdentifier, biomeName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeEntity, biomeName.toString()), DoesNotSpawnInBiomeEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataDoesNotSpawnInBiomeTagEdge(spawnDataName: PokemonIdentifier, biomeTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName.toString()), DoesNotSpawnInBiomeEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataSpawnsInBiomeEdge(spawnDataName: PokemonIdentifier, biomeName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeEntity, biomeName.toString()), SpawnsInBiomeEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataSpawnsInBiomeTagEdge(spawnDataName: PokemonIdentifier, biomeTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName.toString()), SpawnsInBiomeEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataSpawnsInStructureEdge(spawnDataName: PokemonIdentifier, StructureName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureEntity, StructureName.toString()), SpawnsInStructureEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataSpawnsInStructureTagEdge(spawnDataName: PokemonIdentifier, StructureTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName.toString()), SpawnsInStructureEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataDoesNotSpawnInStructureEdge(spawnDataName: PokemonIdentifier, StructureName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureEntity, StructureName.toString()), DoesNotSpawnInStructureEdgeType, SpawnDataEntity, spawnDataName.toString());
}

export function createSpawnDataDoesNotSpawnInStructureTagEdge(spawnDataName: PokemonIdentifier, StructureTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName.toString()), DoesNotSpawnInStructureEdgeType, SpawnDataEntity, spawnDataName.toString());
}