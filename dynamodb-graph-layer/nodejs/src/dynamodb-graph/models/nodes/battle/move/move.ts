import { DynamoEdge, DynamoNode, getNodePK } from '../../../dynamo';
import { TypeEntity } from '../type';

export const MoveEntity = "Move";
export const MoveCategoryEntity = "MoveCategory";
export const MoveRangeEntity = "MoveRange";
export const MoveLabelEntity = "MoveLabel";
export const enum MoveEdgeType {
    IsType = "IsType",
    InCategory = "InCategory",
    HasRange = "HasRange",
    WithLabel = "WithLabel"
}

export function createMoveCategoryNode(name: string): DynamoNode {
    return new DynamoNode(MoveCategoryEntity, name);
}

export function createMoveRangeNode(name: string): DynamoNode {
    return new DynamoNode(MoveRangeEntity, name);
}

export function createMoveLabelNode(name: string): DynamoNode {
    return new DynamoNode(MoveLabelEntity, name);
}

export function createMoveIsTypeEdge(moveName: string, typeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveEntity, moveName), MoveEdgeType.IsType, TypeEntity, typeName);
}

export function createMoveInCategoryEdge(moveName: string, categoryName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveEntity, moveName), MoveEdgeType.InCategory, MoveCategoryEntity, categoryName);
}

export function createMoveHasRangeEdge(moveName: string, rangeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveEntity, moveName), MoveEdgeType.HasRange, MoveRangeEntity, rangeName);
}

export function createMoveWithLabelEdge(moveName: string, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveEntity, moveName), MoveEdgeType.WithLabel, MoveLabelEntity, labelName);
}

export class MoveNode extends DynamoNode {
    powerPoints: number;
    basePower: number;
    priority: number;
    accuracy: number;
    description?: string;

    constructor(name: string, basePower: number, powerPoints: number, priority: number, accuracy: number) {
        super(MoveEntity, name);
        this.powerPoints = powerPoints;
        this.basePower = basePower;
        this.priority = priority;
        this.accuracy = accuracy;
    }
}