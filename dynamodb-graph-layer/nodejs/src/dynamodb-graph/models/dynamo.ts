import { DynamoDBClient, PutItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

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

export abstract class DynamoNode extends DynamoItem {
    Name: string;

    constructor(entityType: string, name: string) {
        super(getNodePK(entityType, name), "METADATA", ItemType.NODE, entityType);
        this.Name = name;
    }
}

export abstract class DynamoEdge extends DynamoItem {
    Target: PK;

    constructor(pk: PK, edgeType: string, targetEntityType: string, targetName: string, reverse: boolean = false) {
        super(pk, getEdgeSK(edgeType, targetEntityType, targetName, reverse), ItemType.EDGE, edgeType);
        this.Target = getNodePK(targetEntityType, targetName);
    }

    abstract reverseEdge(): DynamoEdge;
}

export async function createEdge(edge: DynamoEdge, tableName: string = process.env.DYNAMODB_TABLE || ""): Promise<void> {
    if (!tableName) {
        throw new Error("DYNAMODB_TABLE environment variable is required.");
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    });

    const reverseEdge = edge.reverseEdge();

    await client.send(
        new TransactWriteItemsCommand({
            TransactItems: [
                {
                    Put: {
                        TableName: tableName,
                        Item: marshall(edge, { removeUndefinedValues: true, convertClassInstanceToMap: true }),
                    },
                },
                {
                    Put: {
                        TableName: tableName,
                        Item: marshall(reverseEdge, { removeUndefinedValues: true, convertClassInstanceToMap: true }),
                    },
                },
            ],
        })
    );
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