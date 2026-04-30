import { DynamoNode } from '../../service/dynamoNodes';

export const TypeEntity = "Type";

export enum TypeRelationShip {
    IMMUNITY = "ImmuneTo",
    WEAKNESS = "WeakAgainst",
    RESISTANCE = "Resists"
}

export function createTypeNode(name: string): TypeNode {
    return new TypeNode(name);
}

export class TypeNode extends DynamoNode {
    private resists?: string[];
    private immunities?: string[];
    private weaknesses?: string[];
    private introducedByGame?: string;

    constructor(name: string) {
        super(TypeEntity, name);
    }
}