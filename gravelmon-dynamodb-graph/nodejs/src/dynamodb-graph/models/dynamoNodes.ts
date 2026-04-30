

export type PK = string;
export type SK = string | "METADATA";

export enum ItemType {
    NODE = "NODE",
    EDGE = "EDGE"
}

export abstract class DynamoItem {
    PK: PK;
    SK: SK;
    TYPE: ItemType;
    entityType: string;

    constructor(pk: PK, sk: SK, type: ItemType, entityType: string) {
        this.PK = pk;
        this.SK = sk;
        this.TYPE = type;
        this.entityType = entityType;
    }
}

export class DynamoNode extends DynamoItem {
    name: string;

    constructor(entityType: string, name: string) {
        super(getNodePK(entityType, name), "METADATA", ItemType.NODE, entityType);
        this.name = name;
    }
}

export class DynamoEdge extends DynamoItem {
    Target: PK;
    sourceType: string;
    targetType: string;

    constructor(pk: PK, edgeType: string, targetEntityType: string, targetName: string, isReverseEdge: boolean = false) {
        super(pk, getEdgeSK(edgeType, targetEntityType, targetName, isReverseEdge), ItemType.EDGE, edgeType);
        this.Target = getNodePK(targetEntityType, targetName);
        this.sourceType = getPkType(pk);
        this.targetType = targetEntityType;
    }

    reverseEdge(): DynamoEdge {
        return new DynamoEdge(this.Target, this.entityType, getPkType(this.PK), getPkName(this.PK), !this.isReverseEdge());
    }

    isReverseEdge(): boolean {
        const parts = this.SK.split('#');
        if(parts[1] === "IN") return true;
        return false;
    }
}

export function getNodePK(type: string, name: string): PK {
   return `NODE#${type}#${name}`;
}

export function getEdgeSK(edgeType: string, targetType: string, targetName: string, reverse: boolean = false): SK {
    const prefix = reverse ? "EDGE#IN" : "EDGE";
    return `${prefix}#${edgeType}#${targetType}#${targetName}`;
}

export function getPkType(pk: PK): string {
    const parts = pk.split('#');
    return parts[1];
}

export function getPkName(pk: PK): string {
    const parts = pk.split('#');
    return parts[2];
}