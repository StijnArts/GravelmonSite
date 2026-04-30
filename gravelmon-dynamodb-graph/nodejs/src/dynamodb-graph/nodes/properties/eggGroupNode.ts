import { DynamoNode } from '../../service/dynamoNodes';

export const EggGroupEntity = "EggGroup";
export const InEggGroupEdgeType = "InEggGroup";

export function createEggGroupNode(name: string): DynamoNode {
    return new DynamoNode(EggGroupEntity, name);
}