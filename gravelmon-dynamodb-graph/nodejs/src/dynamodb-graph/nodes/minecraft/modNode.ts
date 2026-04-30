import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import {BiomeEntity, BiomeTagEntity} from "./biomeNode";
import {ResourceLocation} from "../../models/minecraft/resourceLocation";
import {StructureEntity, StructureTagEntity} from "./structureNode";
import { ItemEntity } from './itemNode';

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

export function createModAddsItemEdge(modName: string, entityResourceLocation: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(ModEntity, modName), AddedByModEdgeType, ItemEntity, entityResourceLocation.toString());
}