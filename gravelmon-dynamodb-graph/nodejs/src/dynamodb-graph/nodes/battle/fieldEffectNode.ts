import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { TypeEntity } from './typeNode';
import { deserializerRegistry } from '../../service/deserializerRegistry';
import {MoveRange} from "../../models/battle/moveRange";

export const FieldEffectEntity = "FieldEffect";
export const FieldEffectLabelEntity = "FieldEffectLabel";

export const enum FieldEffectEdgeType {
    IsType = "IsType",
    WithLabel = "WithLabel"
}

export interface FieldEffectType {
    type : string;
    isRebalanced: boolean;
}

export class FieldEffectIdentifier {
    game: string;
    fieldEffect: string;
    constructor(game: string, pokemon: string) {
        this.game = game;
        this.fieldEffect = pokemon;
    }

    toString(): string {
        return `${this.game}#${this.fieldEffect}`;
    }

    static fromString(identifier: string): FieldEffectIdentifier {
        const [game, fieldEffect] = identifier.split("#");
        return new FieldEffectIdentifier(game, fieldEffect);
    }

    getFieldEffect(): string {
        return this.fieldEffect;
    }

    serialize(): any {
        return {
            game: this.game,
            fieldEffect: this.fieldEffect
        };
    }

    static deserialize(data: any): FieldEffectIdentifier {
        return new FieldEffectIdentifier(data.game, data.fieldEffect);
    }
}

export function createFieldEffectLabelNode(name: string): DynamoNode {
    return new DynamoNode(FieldEffectLabelEntity, name);
}

export function createFieldEffectIsTypeEdge(fieldEffectName: FieldEffectIdentifier, typeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(FieldEffectEntity, fieldEffectName.toString()), FieldEffectEdgeType.IsType, TypeEntity, typeName);
}

export function createFieldEffectWithLabelEdge(fieldEffectName: FieldEffectIdentifier, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(FieldEffectEntity, fieldEffectName.toString()), FieldEffectEdgeType.WithLabel, FieldEffectLabelEntity, labelName);
}

export interface FieldEffectData {
    identifier: FieldEffectIdentifier;
    durationInTurns: number;
    fieldEffectRange: MoveRange.AllAllies | MoveRange.AllOpponents | MoveRange.AllPokemon;
    description?: string;
}

export class FieldEffectNode extends DynamoNode {
    fieldEffectData: FieldEffectData;
    rebalancedFieldEffectData?: FieldEffectData;
    fieldEffectLabels: string[];

    constructor(fieldEffectData: FieldEffectData,
                rebalancedFieldEffectData?: FieldEffectData,
                fieldEffectLabels: string[] = []) {
        super(FieldEffectEntity, fieldEffectData.identifier.toString());
        this.fieldEffectData = fieldEffectData;
        this.rebalancedFieldEffectData = rebalancedFieldEffectData;
        this.fieldEffectLabels = fieldEffectLabels;
    }

    static deserialize(data: Record<string, any>): FieldEffectNode {
        const fieldEffectData = FieldEffectNode.deserializeFieldEffectData(data.fieldEffectData);
        return new FieldEffectNode(
            fieldEffectData,
            data.rebalancedFieldEffectData ? FieldEffectNode.deserializeFieldEffectData(data.rebalancedFieldEffectData) : undefined,
            data.fieldEffectLabels || []
        );
    }

    static deserializeFieldEffectData(data: any): FieldEffectData {
        return {
            identifier: FieldEffectIdentifier.deserialize(data.identifier),
            durationInTurns: data.durationInTurns,
            fieldEffectRange: data.fieldEffectRange,
            description: data.description,
        }
    }

    private serializeFieldEffectData(data: FieldEffectData): any {
        return {
            identifier: data.identifier.serialize(),
            durationInTurns: data.durationInTurns,
            fieldEffectRange: data.fieldEffectRange,
            description: data.description,
        }
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            fieldEffectData: this.serializeFieldEffectData(this.fieldEffectData),
            rebalancedFieldEffectData: this.rebalancedFieldEffectData ? this.serializeFieldEffectData(this.rebalancedFieldEffectData) : undefined,
            fieldEffectLabels: this.fieldEffectLabels
        }
    }
}

deserializerRegistry.register(FieldEffectEntity, FieldEffectNode.deserialize);