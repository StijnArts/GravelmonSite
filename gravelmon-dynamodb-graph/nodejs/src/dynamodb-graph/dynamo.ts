import { DynamoDBClient, PutItemCommand, TransactWriteItemsCommand, QueryCommand, GetItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoEdge, PK, SK, DynamoNode } from "./models/dynamoNodes";

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

export async function deleteNode(pk: PK, tableName?: string): Promise<void>;
export async function deleteNode(node: DynamoNode, tableName?: string): Promise<void>;
export async function deleteNode(nodeOrPk: PK | DynamoNode, tableName: string = process.env.DYNAMODB_TABLE || ""): Promise<void> {
    if (!tableName) {
        throw new Error("DYNAMODB_TABLE environment variable is required.");
    }

    const pk = typeof nodeOrPk === 'string' ? nodeOrPk : nodeOrPk.PK;

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    });

    await client.send(new DeleteItemCommand({
        TableName: tableName,
        Key: marshall({ PK: pk, SK: "METADATA" })
    }));
}

export async function deleteEdge(edge: DynamoEdge, tableName: string = process.env.DYNAMODB_TABLE || ""): Promise<void> {
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
                    Delete: {
                        TableName: tableName,
                        Key: marshall({ PK: edge.PK, SK: edge.SK })
                    },
                },
                {
                    Delete: {
                        TableName: tableName,
                        Key: marshall({ PK: reverseEdge.PK, SK: reverseEdge.SK })
                    },
                },
            ],
        })
    );
}

export async function updateNode(
    pk: PK,
    updates: Partial<Omit<DynamoNode, 'PK' | 'SK' | 'TYPE'>>,
    tableName?: string
): Promise<DynamoNode | null>;
export async function updateNode(
    node: DynamoNode,
    updates: Partial<Omit<DynamoNode, 'PK' | 'SK' | 'TYPE'>>,
    tableName?: string
): Promise<DynamoNode | null>;
export async function updateNode(
    nodeOrPk: PK | DynamoNode,
    updates: Partial<Omit<DynamoNode, 'PK' | 'SK' | 'TYPE'>>,
    tableName: string = process.env.DYNAMODB_TABLE || ""
): Promise<DynamoNode | null> {
    if (!tableName) {
        throw new Error("DYNAMODB_TABLE environment variable is required.");
    }

    const pk = typeof nodeOrPk === 'string' ? nodeOrPk : nodeOrPk.PK;

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    });

    // Build update expression
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};
    let index = 0;

    // Reserved keywords that need attribute name mapping
    const reservedKeywords = new Set(['name', 'type', 'status', 'value']);

    for (const [key, value] of Object.entries(updates)) {
        let attrName = key;
        if (reservedKeywords.has(key)) {
            const placeholder = `#attr${index}`;
            expressionAttributeNames[placeholder] = key;
            attrName = placeholder;
        }
        updateExpressions.push(`${attrName} = :val${index}`);
        expressionAttributeValues[`:val${index}`] = value;
        index++;
    }

    if (updateExpressions.length === 0) {
        return getNode(pk, tableName);
    }

    const params: any = {
        TableName: tableName,
        Key: marshall({ PK: pk, SK: "METADATA" }),
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        ReturnValues: "ALL_NEW"
    };

    if (Object.keys(expressionAttributeNames).length > 0) {
        params.ExpressionAttributeNames = expressionAttributeNames;
    }

    const result = await client.send(new UpdateItemCommand(params));

    if (!result.Attributes) return null;

    const item = unmarshall(result.Attributes);
    return new DynamoNode(item.entityType, item.name);
}

export async function updateEdge(
    edge: DynamoEdge,
    updates: Partial<Omit<DynamoEdge, 'PK' | 'SK' | 'TYPE' | 'Target' | 'sourceType' | 'targetType'>>,
    tableName: string = process.env.DYNAMODB_TABLE || ""
): Promise<DynamoEdge | null> {
    if (!tableName) {
        throw new Error("DYNAMODB_TABLE environment variable is required.");
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    });

    // Build update expression for forward edge
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};
    let index = 0;

    // Reserved keywords that need attribute name mapping
    const reservedKeywords = new Set(['name', 'type', 'status', 'value']);

    for (const [key, value] of Object.entries(updates)) {
        let attrName = key;
        if (reservedKeywords.has(key)) {
            const placeholder = `#attr${index}`;
            expressionAttributeNames[placeholder] = key;
            attrName = placeholder;
        }
        updateExpressions.push(`${attrName} = :val${index}`);
        expressionAttributeValues[`:val${index}`] = value;
        index++;
    }

    if (updateExpressions.length === 0) {
        return edge;
    }

    const reverseEdge = edge.reverseEdge();

    // Update both forward and reverse edges
    const updateParams: any = {
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
    };

    if (Object.keys(expressionAttributeNames).length > 0) {
        updateParams.ExpressionAttributeNames = expressionAttributeNames;
    }

    await client.send(
        new TransactWriteItemsCommand({
            TransactItems: [
                {
                    Update: {
                        TableName: tableName,
                        Key: marshall({ PK: edge.PK, SK: edge.SK }),
                        ...updateParams,
                    },
                },
                {
                    Update: {
                        TableName: tableName,
                        Key: marshall({ PK: reverseEdge.PK, SK: reverseEdge.SK }),
                        ...updateParams,
                    },
                },
            ],
        })
    );

    // Apply updates to the edge object and return it
    Object.assign(edge, updates);
    return edge;
}