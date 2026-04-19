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
    constructor(name: string, resourceLocation: ResourceLocation) {
        super(StructureEntity, name);
        this.resourceLocation = resourceLocation;
    }   
}

class StructureTagNode extends DynamoNode {
    resourceLocation: ResourceLocation
    constructor(name: string, resourceLocation: ResourceLocation) {
        super(StructureTagEntity, name);
        this.resourceLocation = resourceLocation;
    }   
}

export function createStructureNode(name: string, resourceLocation: ResourceLocation): DynamoNode {
    return new StructureNode(name, resourceLocation);
}

export function createStructureTagNode(name: string, resourceLocation: ResourceLocation): StructureTagNode {
    return new StructureTagNode(name, resourceLocation);
}

export function createStructureTagContainsEdge(StructureTagName: string, StructureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName), StructureTagContainsStructureEdgeType, StructureEntity, StructureName);
}

export function createStructureTagContainsStructureTagEdge(StructureTagName1: string, StructureTagName2: string): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName1), StructureTagContainsStructureTagEdgeType, StructureTagEntity, StructureTagName2);
}

export function createSpawnEntitySpawnsInStructureEdge(
    spawnEntityType: string, spawnPresetName: string, 
    structureEntityType: string, structureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(spawnEntityType, spawnPresetName), 
        SpawnsInStructureEdgeType, structureEntityType, structureName);
}

export function createSpawnEntityDoesNotSpawnInStructureEdge(
    spawnEntityType: string, spawnPresetName: string, 
    structureEntityType: string, structureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(spawnEntityType, spawnPresetName), 
        DoesNotSpawnInStructureEdgeType, structureEntityType, structureName);
}