import { DynamoEdge, DynamoNode, getNodePK, getPkName} from '../dynamo';

const TypeEntity = "Type";

export class TypeNode extends DynamoNode {
    constructor(name: string) {
        super(TypeEntity, name);
    }
}

export enum TypeRelationShip {
    IMMUNITY = "ImmuneTo",
    WEAKNESS = "WeakAgainst",
    RESISTANCE = "Resists"
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
                return new ImmunityEdge(defendingType, attackingType, true);
            case TypeRelationShip.WEAKNESS: 
                return new WeaknessEdge(defendingType, attackingType, true);
            case TypeRelationShip.RESISTANCE:
                return new ResistanceEdge(defendingType, attackingType, true);
            default:
                throw new Error(`Unknown type relationship: ${this.entityType}`);
        }
    }
}

export class ImmunityEdge extends TypeRelationShipEdge {
    constructor(attackingType: string, defendingType: string, reverse: boolean = false) {
        super(attackingType, defendingType, TypeRelationShip.IMMUNITY, reverse);
    }
}

export class WeaknessEdge extends TypeRelationShipEdge {
    constructor(attackingType: string, defendingType: string, reverse: boolean = false) {
        super(attackingType, defendingType, TypeRelationShip.WEAKNESS, reverse);
    }
}

export class ResistanceEdge extends TypeRelationShipEdge {
    constructor(attackingType: string, defendingType: string, reverse: boolean = false) {
        super(attackingType, defendingType, TypeRelationShip.RESISTANCE, reverse);
    }
}