import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { TypeEntity } from './typeNode';
import {MoveRange} from "../../models/battle/moveRange";
import { deserializerRegistry } from '../../service/deserializerRegistry';

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

export interface MoveType {
    type : string;
    isRebalanced: boolean;
}

export class MoveIdentifier {
    game: string;
    move: string;
    constructor(game: string, pokemon: string) {
        this.game = game;
        this.move = pokemon;
    }

    toString(): string {
        return `${this.game}#${this.move}`;
    }

    static fromString(identifier: string): MoveIdentifier {
        const [game, move] = identifier.split("#");
        return new MoveIdentifier(game, move);
    }

    getMove(): string {
        return this.move;
    }

    serialize(): any {
        return {
            game: this.game,
            move: this.move
        };
    }

    static deserialize(data: any): MoveIdentifier {
        return new MoveIdentifier(data.game, data.move);
    }
}

export function createMoveLabelNode(name: string): DynamoNode {
    return new DynamoNode(MoveLabelEntity, name);
}

export function createMoveIsTypeEdge(moveName: MoveIdentifier, typeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveEntity, moveName.toString()), MoveEdgeType.IsType, TypeEntity, typeName);
}

export function createMoveWithLabelEdge(moveName: MoveIdentifier, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(MoveEntity, moveName.toString()), MoveEdgeType.WithLabel, MoveLabelEntity, labelName);
}

export interface MoveData {
    moveTypes: MoveType[];
    powerPoints: number;
    basePower: number;
    priority: number;
    accuracy: number;
    moveRange: MoveRange;
    moveCategory: MoveCategory;
    description?: string;
    zMoveEffect?: string;
    typeGemCost: Record<string, number>
    associatedWeathers?: string[];
    associatedTerrain?: string[];
    associatedFieldEffects?: string[];
}

export class MoveNode extends DynamoNode {
    moveIdentifier: MoveIdentifier;
    moveData: MoveData;
    rebalancedMoveData?: MoveData;
    moveLabels: string[];

    constructor(name: MoveIdentifier, 
                moveData: MoveData,
                rebalancedMoveData?: MoveData,
                moveLabels: string[] = []) {
        super(MoveEntity, name.toString());
        this.moveIdentifier = name;
        this.moveData = moveData;
        this.rebalancedMoveData = rebalancedMoveData;
        this.moveLabels = moveLabels;
    }

    static deserialize(data: Record<string, any>): MoveNode {
        return new MoveNode(
            MoveIdentifier.deserialize(data.moveIdentifier),
            MoveNode.deserializeMoveData(data.moveData),
            data.rebalancedMoveData ? MoveNode.deserializeMoveData(data.rebalancedMoveData) : undefined,
            data.moveLabels || []
        );
    }

    static deserializeMoveData(data: any): MoveData {
        return {
            moveTypes: data.moveTypes.map((moveType: any) => ({ type: moveType.type, isRebalanced: moveType.isRebalanced })),
            powerPoints: data.powerPoints,
            basePower: data.basePower,
            priority: data.priority,
            accuracy: data.accuracy,
            moveRange: data.moveRange,
            moveCategory: data.moveCategory,
            description: data.description,
            zMoveEffect: data.zMoveEffect,
            typeGemCost: data.typeGemCost,
            associatedWeathers: data.associatedWeathers,
            associatedTerrain: data.associatedTerrain,
            associatedFieldEffects: data.associatedFieldEffects
        }
    }

    private serializeMoveData(moveData: MoveData): any {
        return {
            moveTypes: moveData.moveTypes,
            powerPoints: moveData.powerPoints,
            basePower: moveData.basePower,
            priority: moveData.priority,
            accuracy: moveData.accuracy,
            moveRange: moveData.moveRange,
            moveCategory: moveData.moveCategory,
            description: moveData.description,
            zMoveEffect: moveData.zMoveEffect,
            typeGemCost: moveData.typeGemCost,
            associatedWeathers: moveData.associatedWeathers,
            associatedTerrain: moveData.associatedTerrain,
            associatedFieldEffects: moveData.associatedFieldEffects
        }
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            moveIdentifier: this.moveIdentifier.serialize(),
            moveData: this.serializeMoveData(this.moveData),
            rebalancedMoveData: this.rebalancedMoveData ? this.serializeMoveData(this.rebalancedMoveData) : undefined,
            moveLabels: this.moveLabels
        }
    }
}

deserializerRegistry.register(MoveEntity, MoveNode.deserialize);