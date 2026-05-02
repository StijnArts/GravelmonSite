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
    version: number;
    lastEdited: number;

    constructor(pk: PK, sk: SK, type: ItemType, entityType: string, version: number = 1, lastEdited: number = Date.now()) {
        this.PK = pk;
        this.SK = sk;
        this.TYPE = type;
        this.entityType = entityType;
        this.version = version;
        this.lastEdited = lastEdited;
    }

    public serialize(): Record<string, any> {
        return {
            PK: this.PK,
            SK: this.SK,
            TYPE: this.TYPE,
            entityType: this.entityType,
            version: this.version,
            lastEdited: this.lastEdited,
        }
    }
}

export class DynamoNode extends DynamoItem {
    name: string;

    constructor(entityType: string, name: string, version: number = 1, lastEdited: number = Date.now()) {
        super(getNodePK(entityType, name), "METADATA", ItemType.NODE, entityType, version, lastEdited);
        this.name = name;
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        return new DynamoNode(data.entityType, data.name, data.version, data.lastEdited);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            name: this.name,
        }
    }
}

export class DynamoEdge extends DynamoItem {
    target: PK;
    sourceType: string;
    targetType: string;
    targetName: string;

    constructor(pk: PK, edgeType: string, targetEntityType: string, targetName: string, version: number = 1, lastEdited: number = Date.now()) {
        super(pk, getEdgeSK(edgeType, targetEntityType, targetName), ItemType.EDGE, edgeType, version, lastEdited);
        this.target = getNodePK(targetEntityType, targetName);
        this.sourceType = getPkType(pk);
        this.targetType = targetEntityType;
        this.targetName = targetName;
    }

    static deserialize(data: Record<string, any>): DynamoEdge {
        const edgeType = data.entityType;
        const targetType = data.targetType;
        const targetName = data.targetName;

        return new DynamoEdge(data.PK, edgeType, targetType, targetName, data.version, data.lastEdited);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            target: this.target,
            sourceType: this.sourceType,
            targetType: this.targetType,
            targetName: this.targetName,
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
    if (parts.length < 2) {
        throw new Error(`Invalid PK format: ${pk}`);
    }

    return parts[1];
}

export function getPkName(pk: PK): string {
    const parts = pk.split('#');
    if (parts.length < 3) {
        throw new Error(`Invalid PK format: ${pk}`);
    }

    return parts[2];
}