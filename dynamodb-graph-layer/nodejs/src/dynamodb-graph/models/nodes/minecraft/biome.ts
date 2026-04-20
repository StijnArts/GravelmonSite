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
    constructor(resourceLocation: ResourceLocation) {
        super(BiomeEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
    }   
}

class BiomeTagNode extends DynamoNode {
    resourceLocation: ResourceLocation
    constructor(resourceLocation: ResourceLocation) {
        super(BiomeTagEntity, ResourceLocation.toString());
        this.resourceLocation = resourceLocation;
    }   
}

export function createBiomeNode(resourceLocation: ResourceLocation): DynamoNode {
    return new BiomeNode(resourceLocation);
}

export function createBiomeTagNode(resourceLocation: ResourceLocation): BiomeTagNode {
    return new BiomeTagNode(resourceLocation);
}

export function createBiomeTagContainsBiomeEdge(biomeTagName: ResourceLocation, biomeName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName.toString()), BiomeTagContainsBiomeEdgeType, BiomeEntity, biomeName.toString());
}

export function createBiomeTagContainsBiomeTagEdge(containingBiomeTag: ResourceLocation, subjectBiomeTag: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, containingBiomeTag.toString()), BiomeTagContainsBiomeTagEdgeType, BiomeTagEntity, subjectBiomeTag.toString());
}