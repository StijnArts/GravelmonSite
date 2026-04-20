import { DynamoEdge, DynamoNode, getNodePK } from '../../dynamo';
import { ResourceLocation } from './resourceLocation';

export const StructureEntity = "Structure";
export const StructureTagEntity = "StructureTag";
export const StructureTagContainsStructureEdgeType = "ContainsStructure";
export const StructureTagContainsStructureTagEdgeType = "ContainsStructureTag";

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
    constructor(resourceLocation: ResourceLocation) {
        super(StructureTagEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
    }   
}

export function createStructureNode(resourceLocation: ResourceLocation): DynamoNode {
    return new StructureNode(resourceLocation);
}

export function createStructureTagNode(resourceLocation: ResourceLocation): StructureTagNode {
    return new StructureTagNode(resourceLocation);
}

export function createStructureTagContainsStructureEdge(StructureTagName: ResourceLocation, StructureName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName.toString()), StructureTagContainsStructureEdgeType, StructureEntity, StructureName.toString());
}

export function createStructureTagContainsStructureTagEdge(containingStructureTagName: ResourceLocation, subjectStructureTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, containingStructureTagName.toString()), StructureTagContainsStructureTagEdgeType, StructureTagEntity, subjectStructureTagName.toString());
}