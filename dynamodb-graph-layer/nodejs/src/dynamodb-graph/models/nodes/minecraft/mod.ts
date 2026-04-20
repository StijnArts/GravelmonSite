import { DynamoEdge, DynamoNode, getNodePK } from '../../dynamo';
import {BiomeEntity, BiomeTagEntity} from "./biome";
import {ResourceLocation} from "./resourceLocation";
import {StructureEntity, StructureTagEntity} from "./structure";

export const ModEntity = "Mod";
export const AddedByModEdgeType = "AddedByMod";

export function createModNode(name: string): DynamoNode {
    return new DynamoNode(ModEntity, name);
}

export function createModAddsBiomeEdge(modName: string, entityResourceLocation: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ModEntity, modName), AddedByModEdgeType, BiomeEntity, entityResourceLocation.toString());
}

export function createModAddsBiomeTagEdge(modName: string, entityResourceLocation: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ModEntity, modName), AddedByModEdgeType, BiomeTagEntity, entityResourceLocation.toString());
}

export function createModAddsStructureEdge(modName: string, entityResourceLocation: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ModEntity, modName), AddedByModEdgeType, StructureEntity, entityResourceLocation.toString());
}

export function createModAddsStructureTagEdge(modName: string, entityResourceLocation: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ModEntity, modName), AddedByModEdgeType, StructureTagEntity, entityResourceLocation.toString());
}