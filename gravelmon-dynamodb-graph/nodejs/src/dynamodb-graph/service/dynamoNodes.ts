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

    public serialize(): Record<string, any> {
        return {
            PK: this.PK,
            SK: this.SK,
            TYPE: this.TYPE,
            entityType: this.entityType,
        }
    }
}

export class DynamoNode extends DynamoItem {
    name: string;

    constructor(entityType: string, name: string) {
        super(getNodePK(entityType, name), "METADATA", ItemType.NODE, entityType);
        this.name = name;
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        const node = new DynamoNode(data.entityType, data.name);
        return node;
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            name: this.name,
        }
    }
}

export class DynamoEdge extends DynamoItem {
    Target: PK;
    sourceType: string;
    targetType: string;

    constructor(pk: PK, edgeType: string, targetEntityType: string, targetName: string) {
        super(pk, getEdgeSK(edgeType, targetEntityType, targetName), ItemType.EDGE, edgeType);
        this.Target = getNodePK(targetEntityType, targetName);
        this.sourceType = getPkType(pk);
        this.targetType = targetEntityType;
    }

    static deserialize(data: Record<string, any>): DynamoEdge {
        const skParts = data.SK.split('#');
        const edgeType = data.entityType;
        const targetType = skParts[2];
        const targetName = skParts[3];

        return new DynamoEdge(data.PK, edgeType, targetType, targetName);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            Target: this.Target,
            sourceType: this.sourceType,
            targetType: this.targetType,
        }
    }
}

export function getNodePK(type: string, name: string): PK {
   return `NODE#${type}#${name}`;
}

export function getEdgeSK(edgeType: string, targetType: string, targetName: string): SK {
    return `EDGE#${edgeType}#${targetType}#${targetName}`;
}

export function getPkType(pk: PK): string {
    const parts = pk.split('#');
    return parts[1];
}

export function getPkName(pk: PK): string {
    const parts = pk.split('#');
    return parts[2];
}