import { DynamoNode } from '../../service/dynamoNodes';

export const EggGroupEntity = "EggGroup";
export const InEggGroupEdgeType = "InEggGroup";

const version = 1;

export function createEggGroupNode(name: string, lastEdited: number = Date.now()): DynamoNode {
    return new DynamoNode(EggGroupEntity, name, version, lastEdited);
}