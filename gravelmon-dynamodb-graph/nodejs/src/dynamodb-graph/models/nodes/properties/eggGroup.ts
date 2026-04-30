import { DynamoNode } from '../../dynamoNodes';

export const EggGroupEntity = "EggGroup";
export const InEggGroupEdgeType = "InEggGroup";

export function createEggGroupNode(name: string): DynamoNode {
    return new DynamoNode(EggGroupEntity, name);
}