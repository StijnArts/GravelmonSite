import { DynamoEdge, DynamoNode, getNodePK } from '../../../dynamoNodes';
import { TypeEntity } from '../type';
import {MoveRange} from "./moveRange";

export const MoveEntity = "Move";
export const MoveLabelEntity = "MoveLabel";

export const enum MoveEdgeType {
    IsType = "IsType",
    WithLabel = "WithLabel"
}

export enum MoveCategory {
    Physical = "Physical",
    Special = "Special",
    Status = "Status"
}

export function createMoveLabelNode(name: string): DynamoNode {
    return new DynamoNode(MoveLabelEntity, name);
}

export function createMoveIsTypeEdge(moveName: string, typeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveEntity, moveName), MoveEdgeType.IsType, TypeEntity, typeName);
}

export function createMoveWithLabelEdge(moveName: string, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveEntity, moveName), MoveEdgeType.WithLabel, MoveLabelEntity, labelName);
}

export class MoveNode extends DynamoNode {
    powerPoints: number;
    basePower: number;
    priority: number;
    accuracy: number;
    moveRange: MoveRange;
    moveCategory: MoveCategory;
    description?: string;

    constructor(name: string, basePower: number, powerPoints: number, priority: number, accuracy: number, moveRange: MoveRange, moveCategory: MoveCategory, description?: string) {
        super(MoveEntity, name);
        this.powerPoints = powerPoints;
        this.basePower = basePower;
        this.priority = priority;
        this.accuracy = accuracy;
        this.moveRange = moveRange;
        this.moveCategory = moveCategory;
        this.description = description;
    }
}