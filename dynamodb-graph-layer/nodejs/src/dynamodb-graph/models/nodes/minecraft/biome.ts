import { DynamoEdge, DynamoNode, getNodePK } from '../../dynamo';
import { SpawnPresetEntity } from '../spawning/spawnPreset';
import { ResourceLocation } from './resourceLocation';

export const BiomeEntity = "Biome";
export const BiomeTagEntity = "BiomeTag";
export const BiomeTagContainsBiomeEdgeType = "ContainsBiome";
export const BiomeTagContainsBiomeTagEdgeType = "ContainsBiomeTag";

export const SpawnsInBiomeEdgeType = "SpawnsInBiome";
export const DoesNotSpawnInBiomeEdgeType = "DoesNotSpawnInBiome";


class BiomeNode extends DynamoNode {
    resourceLocation: ResourceLocation
    constructor(name: string, resourceLocation: ResourceLocation) {
        super(BiomeEntity, name);
        this.resourceLocation = resourceLocation;
    }   
}

class BiomeTagNode extends DynamoNode {
    resourceLocation: ResourceLocation
    constructor(name: string, resourceLocation: ResourceLocation) {
        super(BiomeTagEntity, name);
        this.resourceLocation = resourceLocation;
    }   
}

export function createBiomeNode(name: string, resourceLocation: ResourceLocation): DynamoNode {
    return new BiomeNode(name, resourceLocation);
}

export function createBiomeTagNode(name: string, resourceLocation: ResourceLocation): BiomeTagNode {
    return new BiomeTagNode(name, resourceLocation);
}

export function createBiomeTagContainsEdge(biomeTagName: string, biomeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName), BiomeTagContainsBiomeEdgeType, BiomeEntity, biomeName);
}

export function createBiomeTagContainsBiomeTagEdge(biomeTagName1: string, biomeTagName2: string): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName1), BiomeTagContainsBiomeTagEdgeType, BiomeTagEntity, biomeTagName2);
}

export function createSpawnEntitySpawnsInBiomeEdge(
    spawnEntityType: string, spawnPresetName: string, 
    biomeEntityType: string, biomeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(spawnEntityType, spawnPresetName), SpawnsInBiomeEdgeType, biomeEntityType, biomeName);
}

export function createSpawnEntityDoesNotSpawnInBiomeEdge(
    spawnEntityType: string, spawnPresetName: string, 
    biomeEntityType: string, biomeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(spawnEntityType, spawnPresetName), SpawnsInBiomeEdgeType, biomeEntityType, biomeName);
}