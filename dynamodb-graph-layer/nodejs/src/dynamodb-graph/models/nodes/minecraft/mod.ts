import { DynamoEdge, DynamoNode, getNodePK } from '../../dynamo';

export const ModEntity = "Mod";
export const AddedByModEdgeType = "AddedByMod";

export function createModNode(name: string): DynamoNode {
    return new DynamoNode(ModEntity, name);
}

export function createAddedByModEdge(modName: string, entityType: string, entityName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(ModEntity, modName), AddedByModEdgeType, entityType, entityName);
}