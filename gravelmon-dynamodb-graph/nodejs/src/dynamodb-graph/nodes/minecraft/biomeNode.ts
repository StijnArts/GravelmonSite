import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { ResourceLocation } from '../../models/minecraft/resourceLocation';
import { deserializerRegistry } from '../../service/deserializerRegistry';

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
    
    static deserialize(data: Record<string, any>): DynamoNode {
        if(!data.resourceLocation) {
            throw new Error("Invalid data for deserializing BiomeNode: missing resourceLocation");
        }

        return new BiomeNode(ResourceLocation.deserialize(data.resourceLocation));
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            resourceLocation: this.resourceLocation.serialize()
        }
    }
}

class BiomeTagNode extends BiomeNode {
    containsBiomes: ResourceLocation[]
    constructor(resourceLocation: ResourceLocation, containsBiomes: ResourceLocation[] = []) {
        super(resourceLocation);
        this.containsBiomes = containsBiomes;
    }   

    static deserialize(data: Record<string, any>): BiomeTagNode {
        if(!data.resourceLocation) {
            throw new Error("Invalid data for deserializing BiomeTagNode: missing resourceLocation");
        }
        const containsBiomes: ResourceLocation[] = Array.isArray(data.containsBiomes) ? data.containsBiomes.map((biomeData: any) => ResourceLocation.deserialize(biomeData)) : [];

        return new BiomeTagNode(ResourceLocation.deserialize(data.resourceLocation), containsBiomes);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            containsBiomes: this.containsBiomes.map(biome => biome.serialize())
        }
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

deserializerRegistry.register(BiomeEntity, BiomeNode.deserialize);
deserializerRegistry.register(BiomeTagEntity, BiomeTagNode.deserialize);