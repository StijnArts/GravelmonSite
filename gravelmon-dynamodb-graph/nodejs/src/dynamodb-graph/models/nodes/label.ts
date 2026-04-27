import { DynamoNode } from '../dynamo';

export const LabelEntity = "Label";
export const HasLabelEdgeType = "HasLabel";

export function createLabelNode(name: string): DynamoNode {
    return new DynamoNode(LabelEntity, name);
}