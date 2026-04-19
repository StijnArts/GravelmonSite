import { DynamoNode } from '../../dynamo';

export const EggGroupEntity = "EggGroup";

export function createEggGroupNode(name: string): DynamoNode {
    return new DynamoNode(EggGroupEntity, name);
}