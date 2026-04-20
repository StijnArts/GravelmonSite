import { DynamoDBClient, PutItemCommand, TransactWriteItemsCommand, QueryCommand, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

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

export type SkCondition =
    | { eq: string }
    | { beginsWith: string }
    | { between: { start: string; end: string } }
    | { ge: string }
    | { le: string }
    | { gt: string }
    | { lt: string };

export type EdgeFactory<T extends DynamoEdge = DynamoEdge> = (item: Record<string, any>) => T;

function defaultEdgeFactory(item: Record<string, any>): DynamoEdge {
    const skParts = item.SK.split('#');
    const edgeType = item.entityType;

    if (skParts[1] === "IN") {
        const sourceType = skParts[3];
        const sourceName = skParts[4];
        return new DynamoEdge(item.PK, edgeType, sourceType, sourceName, true);
    }

    const targetType = skParts[2];
    const targetName = skParts[3];
    return new DynamoEdge(item.PK, edgeType, targetType, targetName);
}

export function buildSkCondition(condition: SkCondition): {
    expression: string;
    values: Record<string, any>;
} {
    if ('eq' in condition) {
        return {
            expression: 'SK = :sk',
            values: { ':sk': condition.eq }
        };
    }

    if ('beginsWith' in condition) {
        return {
            expression: 'begins_with(SK, :sk)',
            values: { ':sk': condition.beginsWith }
        };
    }

    if ('between' in condition) {
        return {
            expression: 'SK BETWEEN :start AND :end',
            values: { ':start': condition.between.start, ':end': condition.between.end }
        };
    }

    if ('ge' in condition) {
        return {
            expression: 'SK >= :sk',
            values: { ':sk': condition.ge }
        };
    }

    if ('le' in condition) {
        return {
            expression: 'SK <= :sk',
            values: { ':sk': condition.le }
        };
    }

    if ('gt' in condition) {
        return {
            expression: 'SK > :sk',
            values: { ':sk': condition.gt }
        };
    }

    if ('lt' in condition) {
        return {
            expression: 'SK < :sk',
            values: { ':sk': condition.lt }
        };
    }

    throw new Error('Unsupported SK condition');
}

export async function queryEdges<T extends DynamoEdge = DynamoEdge>(
    pk: PK,
    tableName: string = process.env.DYNAMODB_TABLE || "",
    skCondition: SkCondition = { beginsWith: "EDGE#" },
    edgeType?: string,
    edgeFactory: EdgeFactory<T> = defaultEdgeFactory as EdgeFactory<T>
): Promise<T[]> {
    if (!tableName) {
        throw new Error("DYNAMODB_TABLE environment variable is required.");
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    });

    const sk = buildSkCondition(skCondition);
    const values: Record<string, any> = { ':pk': pk, ...sk.values };
    const params: any = {
        TableName: tableName,
        KeyConditionExpression: `PK = :pk AND ${sk.expression}`,
        ExpressionAttributeValues: marshall(values),
    };

    if (edgeType) {
        params.FilterExpression = 'entityType = :edgeType';
        const filterValues = { ...values, ':edgeType': edgeType };
        params.ExpressionAttributeValues = marshall(filterValues);
    }

    const result = await client.send(new QueryCommand(params));

    return result.Items?.map(item => {
        const unmarshalled = unmarshall(item) as Record<string, any>;
        return edgeFactory(unmarshalled);
    }) || [];
}

export async function createNode(node: DynamoNode, tableName: string = process.env.DYNAMODB_TABLE || ""): Promise<void> {
    if (!tableName) {
        throw new Error("DYNAMODB_TABLE environment variable is required.");
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    });

    await client.send(new PutItemCommand({
        TableName: tableName,
        Item: marshall(node, { removeUndefinedValues: true, convertClassInstanceToMap: true }),
    }));
}

export async function getNode(pk: PK, tableName: string = process.env.DYNAMODB_TABLE || ""): Promise<DynamoNode | null> {
    if (!tableName) {
        throw new Error("DYNAMODB_TABLE environment variable is required.");
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    });

    const result = await client.send(new GetItemCommand({
        TableName: tableName,
        Key: marshall({ PK: pk, SK: "METADATA" })
    }));

    if (!result.Item) return null;

    const item = unmarshall(result.Item);
    return new DynamoNode(item.entityType, item.name);
}

export async function getOutgoingEdges<T extends DynamoEdge = DynamoEdge>(
    pk: PK,
    tableName: string = process.env.DYNAMODB_TABLE || "",
    edgeType?: string,
    edgeFactory: EdgeFactory<T> = defaultEdgeFactory as EdgeFactory<T>
): Promise<T[]> {
    const beginsWith = edgeType ? `EDGE#${edgeType}` : "EDGE#";
    return queryEdges(pk, tableName, { beginsWith }, edgeType, edgeFactory);
}

export async function getIncomingEdges<T extends DynamoEdge = DynamoEdge>(
    pk: PK,
    tableName: string = process.env.DYNAMODB_TABLE || "",
    edgeType?: string,
    edgeFactory: EdgeFactory<T> = defaultEdgeFactory as EdgeFactory<T>
): Promise<T[]> {
    const beginsWith = edgeType ? `EDGE#IN#${edgeType}` : "EDGE#IN#";
    return queryEdges(pk, tableName, { beginsWith }, edgeType, edgeFactory);
}

export async function queryNodes(nodeType?: string, tableName: string = process.env.DYNAMODB_TABLE || ""): Promise<DynamoNode[]> {
    if (!tableName) {
        throw new Error("DYNAMODB_TABLE environment variable is required.");
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    });

    const params: any = {
        TableName: tableName,
        FilterExpression: "SK = :metadata",
        ExpressionAttributeValues: marshall({ ':metadata': 'METADATA' }),
    };

    if (nodeType) {
        params.FilterExpression += " AND begins_with(PK, :nodePrefix)";
        params.ExpressionAttributeValues = marshall({
            ':metadata': 'METADATA',
            ':nodePrefix': `NODE#${nodeType}#`
        });
    }

    const result = await client.send(new ScanCommand(params));
    return result.Items?.map(item => {
        const unmarshalled = unmarshall(item) as Record<string, any>;
        return new DynamoNode(unmarshalled.entityType, unmarshalled.name);
    }) || [];
}