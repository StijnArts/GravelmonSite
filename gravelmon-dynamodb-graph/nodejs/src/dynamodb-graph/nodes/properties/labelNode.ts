import { DynamoNode } from '../../service/dynamoNodes';

export const LabelEntity = "Label";
export const HasLabelEdgeType = "HasLabel";

export function createLabelNode(name: string): DynamoNode {
    return new DynamoNode(LabelEntity, name);
}