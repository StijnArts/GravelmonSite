import { DynamoNode } from '../../service/dynamoNodes';

export const LabelEntity = "Label";
export const HasLabelEdgeType = "HasLabel";

const version = 1;

export function createLabelNode(name: string, lastEdited: number = Date.now()): DynamoNode {
    return new DynamoNode(LabelEntity, name, version, lastEdited);
}