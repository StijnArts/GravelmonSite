import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { ResourceLocation } from '../../models/minecraft/resourceLocation';

export const StructureEntity = "Structure";
export const StructureTagEntity = "StructureTag";

export const ContainedInStructureTagEdgeType = "ContainedInStructureTag";

export const SpawnsInStructureEdgeType = "SpawnsInStructure";
export const DoesNotSpawnInStructureEdgeType = "DoesNotSpawnInStructure";

class StructureNode extends DynamoNode {
    resourceLocation: ResourceLocation
    constructor(resourceLocation: ResourceLocation) {
        super(StructureTagEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
    }
}

class StructureTagNode extends DynamoNode {
    resourceLocation: ResourceLocation
    containsStructures: ResourceLocation[]
    constructor(resourceLocation: ResourceLocation, containsStructures: ResourceLocation[] = []) {
        super(StructureTagEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
        this.containsStructures = containsStructures;
    }
}

export function createStructureNode(resourceLocation: ResourceLocation): DynamoNode {
    return new StructureNode(resourceLocation);
}

export function createStructureTagNode(resourceLocation: ResourceLocation, containsStructures: ResourceLocation[] = []): StructureTagNode {
    return new StructureTagNode(resourceLocation, containsStructures);
}

// Note: The edges between structures and structure tags are stored in the opposite direction of the edges between biomes and biome tags,
// since the "contains" relationship is more intuitive to traverse from structure tags to structures than the other way around.
export function createStructureTagContainsStructureEdge(StructureTagName: ResourceLocation, StructureName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureEntity, StructureName.toString()), ContainedInStructureTagEdgeType, StructureTagEntity, StructureTagName.toString());
}

export function createStructureTagContainsStructureTagEdge(containingStructureTagName: ResourceLocation, subjectStructureTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, subjectStructureTagName.toString()), ContainedInStructureTagEdgeType, StructureTagEntity, containingStructureTagName.toString());
}