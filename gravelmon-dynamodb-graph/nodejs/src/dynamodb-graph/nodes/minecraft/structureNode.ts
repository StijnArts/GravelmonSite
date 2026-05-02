import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { ResourceLocation } from '../../models/minecraft/resourceLocation';
import { deserializerRegistry } from '../../service/deserializerRegistry';

export const StructureEntity = "Structure";
export const StructureTagEntity = "StructureTag";

export const ContainedInStructureTagEdgeType = "ContainedInStructureTag";

export const SpawnsInStructureEdgeType = "SpawnsInStructure";
export const DoesNotSpawnInStructureEdgeType = "DoesNotSpawnInStructure";

export class StructureNode extends DynamoNode {
    resourceLocation: ResourceLocation
    constructor(resourceLocation: ResourceLocation) {
        super(StructureTagEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
    }
    
    static deserialize(data: Record<string, any>): DynamoNode {
        if(!data.resourceLocation) {
            throw new Error("Invalid data for deserializing StructureNode: missing resourceLocation");
        }

        return new StructureNode(ResourceLocation.deserialize(data.resourceLocation));
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            resourceLocation: this.resourceLocation.serialize()
        }
    }
}

export class StructureTagNode extends DynamoNode {
    resourceLocation: ResourceLocation
    containsStructures: ResourceLocation[]
    constructor(resourceLocation: ResourceLocation, containsStructures: ResourceLocation[] = []) {
        super(StructureTagEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
        this.containsStructures = containsStructures;
    }

    static deserialize(data: Record<string, any>): StructureTagNode {
        if(!data.resourceLocation) {
            throw new Error("Invalid data for deserializing StructureTagNode: missing resourceLocation");
        }
        const containsStructures: ResourceLocation[] = Array.isArray(data.containsStructures) ? data.containsStructures.map((structureData: any) => ResourceLocation.deserialize(structureData)) : [];

        return new StructureTagNode(ResourceLocation.deserialize(data.resourceLocation), containsStructures);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            resourceLocation: this.resourceLocation.serialize(),
            containsStructures: this.containsStructures.map(Structure => Structure.serialize())
        }
    }
}

export function createStructureNode(resourceLocation: ResourceLocation): DynamoNode {
    return new StructureNode(resourceLocation);
}

export function createStructureTagNode(resourceLocation: ResourceLocation, containsStructures: ResourceLocation[] = []): StructureTagNode {
    return new StructureTagNode(resourceLocation, containsStructures);
}

// Note: The edges between structures and structure tags are stored in the opposite direction of the edges between Structures and Structure tags,
// since the "contains" relationship is more intuitive to traverse from structure tags to structures than the other way around.
export function createStructureTagContainsStructureEdge(StructureTagName: ResourceLocation, StructureName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureEntity, StructureName.toString()), ContainedInStructureTagEdgeType, StructureTagEntity, StructureTagName.toString());
}

export function createStructureTagContainsStructureTagEdge(containingStructureTagName: ResourceLocation, subjectStructureTagName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, subjectStructureTagName.toString()), ContainedInStructureTagEdgeType, StructureTagEntity, containingStructureTagName.toString());
}

deserializerRegistry.register(StructureEntity, StructureNode.deserialize);
deserializerRegistry.register(StructureTagEntity, StructureTagNode.deserialize);