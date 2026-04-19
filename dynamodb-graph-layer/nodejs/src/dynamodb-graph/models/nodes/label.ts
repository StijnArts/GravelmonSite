import { DynamoNode } from '../dynamo';

export const LabelEntity = "Label";

export function createLabelNode(name: string): DynamoNode {
    return new DynamoNode(LabelEntity, name);
}