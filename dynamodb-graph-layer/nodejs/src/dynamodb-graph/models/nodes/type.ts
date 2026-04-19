import { DynamoEdge, DynamoNode, getNodePK, getPkName} from '../dynamo';

export const TypeEntity = "Type";

export enum TypeRelationShip {
    IMMUNITY = "ImmuneTo",
    WEAKNESS = "WeakAgainst",
    RESISTANCE = "Resists"
}

export function createTypeNode(name: string): DynamoNode {
    return new DynamoNode(TypeEntity, name);
}

export function createTypeEdge(attackingType: string, defendingType: string, typeRelationship: TypeRelationShip): DynamoEdge {
    switch (typeRelationship) {
        case TypeRelationShip.IMMUNITY:
            return new ImmunityEdge(attackingType, defendingType);
        case TypeRelationShip.WEAKNESS:
            return new WeaknessEdge(attackingType, defendingType);
        case TypeRelationShip.RESISTANCE:
            return new ResistanceEdge(attackingType, defendingType);
        default:
            throw new Error(`Unknown type relationship: ${typeRelationship}`);
    }
}


abstract class TypeRelationShipEdge extends DynamoEdge {
    constructor(attackingType: string, defendingType: string, typeRelationship: TypeRelationShip, reverse: boolean = false) {
        super(getNodePK(TypeEntity, attackingType), typeRelationship, TypeEntity, defendingType, reverse);
    }

    reverseEdge(): TypeRelationShipEdge {
        const attackingType = getPkName(this.PK);
        const defendingType = getPkName(this.Target);
        switch (this.entityType) {
            case TypeRelationShip.IMMUNITY:
                return new ImmunityEdge(defendingType, attackingType, !this.isReverseEdge());
            case TypeRelationShip.WEAKNESS: 
                return new WeaknessEdge(defendingType, attackingType, !this.isReverseEdge());
            case TypeRelationShip.RESISTANCE:
                return new ResistanceEdge(defendingType, attackingType, !this.isReverseEdge());
            default:
                throw new Error(`Unknown type relationship: ${this.entityType}`);
        }
    }
}

class ImmunityEdge extends TypeRelationShipEdge {
    constructor(attackingType: string, defendingType: string, reverse: boolean = false) {
        super(attackingType, defendingType, TypeRelationShip.IMMUNITY, reverse);
    }
}

class WeaknessEdge extends TypeRelationShipEdge {
    constructor(attackingType: string, defendingType: string, reverse: boolean = false) {
        super(attackingType, defendingType, TypeRelationShip.WEAKNESS, reverse);
    }
}

class ResistanceEdge extends TypeRelationShipEdge {
    constructor(attackingType: string, defendingType: string, reverse: boolean = false) {
        super(attackingType, defendingType, TypeRelationShip.RESISTANCE, reverse);
    }
}