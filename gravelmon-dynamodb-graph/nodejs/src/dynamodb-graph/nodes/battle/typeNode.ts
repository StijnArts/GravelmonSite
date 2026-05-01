import { deserializerRegistry } from '../../service/deserializerRegistry';
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

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            resists: this.resists,
            immunities: this.immunities,
            weaknesses: this.weaknesses,
            introducedByGame: this.introducedByGame
        }
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        const typeNode = new TypeNode(data.name);
        typeNode.resists = data.resists;
        typeNode.immunities = data.immunities;
        typeNode.weaknesses = data.weaknesses;
        typeNode.introducedByGame = data.introducedByGame;
        return typeNode;
    }
}

deserializerRegistry.register(TypeEntity, TypeNode.deserialize);