import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { ResourceLocation } from '../../models/minecraft/resourceLocation';

export const BiomeEntity = "Biome";
export const BiomeTagEntity = "BiomeTag";
export const BiomeTagContainsBiomeEdgeType = "ContainedInBiomeTag";

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
    containsBiomes: ResourceLocation[]
    constructor(resourceLocation: ResourceLocation, containsBiomes: ResourceLocation[] = []) {
        super(BiomeTagEntity, ResourceLocation.toString());
        this.resourceLocation = resourceLocation;
        this.containsBiomes = containsBiomes;
    }   
}

export function createBiomeNode(resourceLocation: ResourceLocation): DynamoNode {
    return new BiomeNode(resourceLocation);
}

export function createBiomeTagNode(resourceLocation: ResourceLocation, containsBiomes: ResourceLocation[] = []): BiomeTagNode {
    return new BiomeTagNode(resourceLocation, containsBiomes);
}

// Note: The edges between biomes and biome tags are stored in the opposite direction of the edges between structures and structure tags,
// since the "contains" relationship is more intuitive to traverse from biome tags to biomes than the other way around.
export function createBiomeTagContainsBiomeEdge(biomeTagName: ResourceLocation, biomeName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeEntity, biomeName.toString()), BiomeTagContainsBiomeEdgeType, BiomeTagEntity, biomeTagName.toString());
}

export function createBiomeTagContainsBiomeTagEdge(containingBiomeTag: ResourceLocation, subjectBiomeTag: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, subjectBiomeTag.toString()), BiomeTagContainsBiomeEdgeType, BiomeTagEntity, containingBiomeTag.toString());
}