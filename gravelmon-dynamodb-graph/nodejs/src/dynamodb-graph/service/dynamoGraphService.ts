import { DynamoDBClient, PutItemCommand, TransactWriteItemsCommand, QueryCommand, GetItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoEdge, PK, SK, DynamoNode } from "./dynamoNodes";
import { SkCondition, KeyConditionBuilder, FilterBuilder, UpdateBuilder, Deserializer } from "./queryBuilder";

// Re-export builder classes and types for convenience
export type { SkCondition, KeyConditionBuilder, FilterBuilder, UpdateBuilder, Deserializer } from "./queryBuilder";

// Helper to extract deserializer from a class with static deserialize method
function getDeserializer<T>(TypeClass: { deserialize(data: Record<string, any>): T }): Deserializer<T> {
    return (data: Record<string, any>) => TypeClass.deserialize(data);
}

// Default deserializers using the model's static methods
const defaultEdgeDeserializer: Deserializer<DynamoEdge> = getDeserializer(DynamoEdge);
const defaultNodeDeserializer: Deserializer<DynamoNode> = getDeserializer(DynamoNode);

export class DynamoGraphService {
    private client: DynamoDBClient;
    private tableName: string;

    constructor(tableName?: string, region?: string, endpoint?: string) {
        this.tableName = tableName || process.env.DYNAMODB_TABLE || "";
        
        if (!this.tableName) {
            throw new Error("DYNAMODB_TABLE environment variable or constructor tableName parameter is required.");
        }

        this.client = new DynamoDBClient({
            region: region || process.env.AWS_REGION || "us-east-1",
            endpoint: endpoint || process.env.DYNAMODB_ENDPOINT || undefined,
        });
    }

    private static buildSkCondition(condition: SkCondition): {
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

    async createEdge(edge: DynamoEdge, tableName?: string): Promise<void> {
        const table = tableName || this.tableName;

        await this.client.send(
            new PutItemCommand({
                TableName: table,
                Item: marshall(edge, { removeUndefinedValues: true, convertClassInstanceToMap: true }),
            })
        );
    }

    async queryEdges<T = DynamoEdge>(
        pk: PK,
        tableName?: string,
        skCondition: SkCondition = { beginsWith: "EDGE#" },
        edgeType?: string,
        deserializer: Deserializer<T> = defaultEdgeDeserializer as Deserializer<T>
    ): Promise<T[]> {
        const table = tableName || this.tableName;
        const sk = DynamoGraphService.buildSkCondition(skCondition);
        const values: Record<string, any> = { ':pk': pk, ...sk.values };
        const params: any = {
            TableName: table,
            KeyConditionExpression: `PK = :pk AND ${sk.expression}`,
            ExpressionAttributeValues: marshall(values),
        };

        if (edgeType) {
            params.FilterExpression = 'entityType = :edgeType';
            const filterValues = { ...values, ':edgeType': edgeType };
            params.ExpressionAttributeValues = marshall(filterValues);
        }

        const result = await this.client.send(new QueryCommand(params));

        return result.Items?.map(item => {
            const unmarshalled = unmarshall(item) as Record<string, any>;
            return deserializer(unmarshalled);
        }) || [];
    }

    async createNode(node: DynamoNode, tableName?: string): Promise<void> {
        const table = tableName || this.tableName;

        await this.client.send(new PutItemCommand({
            TableName: table,
            Item: marshall(node, { removeUndefinedValues: true, convertClassInstanceToMap: true }),
        }));
    }

    async getNode(pk: PK, tableName?: string): Promise<DynamoNode | null> {
        const table = tableName || this.tableName;

        const result = await this.client.send(new GetItemCommand({
            TableName: table,
            Key: marshall({ PK: pk, SK: "METADATA" })
        }));

        if (!result.Item) return null;

        const item = unmarshall(result.Item);
        return new DynamoNode(item.entityType, item.name);
    }

    async getOutgoingEdges<T = DynamoEdge>(
        pk: PK,
        tableName?: string,
        edgeType?: string,
        deserializer: Deserializer<T> = defaultEdgeDeserializer as Deserializer<T>
    ): Promise<T[]> {
        const beginsWith = edgeType ? `EDGE#${edgeType}` : "EDGE#";
        return this.queryEdges(pk, tableName, { beginsWith }, edgeType, deserializer);
    }



    async queryNodes<T = DynamoNode>(
        nodeType?: string,
        tableName?: string,
        deserializer: Deserializer<T> = defaultNodeDeserializer as Deserializer<T>
    ): Promise<T[]> {
        const table = tableName || this.tableName;

        const params: any = {
            TableName: table,
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

        const result = await this.client.send(new ScanCommand(params));
        return result.Items?.map(item => {
            const unmarshalled = unmarshall(item) as Record<string, any>;
            return deserializer(unmarshalled);
        }) || [];
    }

    async deleteNode(nodeOrPk: PK | DynamoNode, tableName?: string): Promise<void> {
        const table = tableName || this.tableName;
        const pk = typeof nodeOrPk === 'string' ? nodeOrPk : nodeOrPk.PK;

        await this.client.send(new DeleteItemCommand({
            TableName: table,
            Key: marshall({ PK: pk, SK: "METADATA" })
        }));
    }

    async deleteEdge(edge: DynamoEdge, tableName?: string): Promise<void> {
        const table = tableName || this.tableName;

        await this.client.send(
            new DeleteItemCommand({
                TableName: table,
                Key: marshall({ PK: edge.PK, SK: edge.SK })
            })
        );
    }

    async updateNode(
        nodeOrPk: PK | DynamoNode,
        updates: Partial<Omit<DynamoNode, 'PK' | 'SK' | 'TYPE'>>,
        tableName?: string
    ): Promise<DynamoNode | null> {
        const table = tableName || this.tableName;
        const pk = typeof nodeOrPk === 'string' ? nodeOrPk : nodeOrPk.PK;

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
            return this.getNode(pk, table);
        }

        const params: any = {
            TableName: table,
            Key: marshall({ PK: pk, SK: "METADATA" }),
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeValues: marshall(expressionAttributeValues),
            ReturnValues: "ALL_NEW"
        };

        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        const result = await this.client.send(new UpdateItemCommand(params));

        if (!result.Attributes) return null;

        const item = unmarshall(result.Attributes);
        return new DynamoNode(item.entityType, item.name);
    }

    async updateEdge(
        edge: DynamoEdge,
        updates: Partial<Omit<DynamoEdge, 'PK' | 'SK' | 'TYPE' | 'Target' | 'sourceType' | 'targetType'>>,
        tableName?: string
    ): Promise<DynamoEdge | null> {
        const table = tableName || this.tableName;

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
            return edge;
        }

        const params: any = {
            TableName: table,
            Key: marshall({ PK: edge.PK, SK: edge.SK }),
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeValues: marshall(expressionAttributeValues),
            ReturnValues: "ALL_NEW"
        };

        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        const result = await this.client.send(new UpdateItemCommand(params));

        if (!result.Attributes) return null;

        const item = unmarshall(result.Attributes);
        return DynamoEdge.deserialize(item);
    }

    // Query builder methods
    queryWithBuilder<T = DynamoEdge>(
        pk: PK,
        keyConditionBuilder: KeyConditionBuilder,
        tableName?: string,
        deserializer: Deserializer<T> = defaultEdgeDeserializer as Deserializer<T>
    ): Promise<T[]> {
        const table = tableName || this.tableName;
        const builtCondition = keyConditionBuilder.build();

        const params: any = {
            TableName: table,
            KeyConditionExpression: builtCondition.expression,
            ExpressionAttributeValues: marshall({ PK: pk, ...builtCondition.values }),
            ExpressionAttributeNames: builtCondition.names,
        };

        return this.executeQuery(params, deserializer);
    }

    scanWithFilter<T = DynamoEdge>(
        filterBuilder: FilterBuilder,
        tableName?: string,
        deserializer: Deserializer<T> = defaultEdgeDeserializer as Deserializer<T>
    ): Promise<T[]> {
        const table = tableName || this.tableName;
        const builtFilter = filterBuilder.build();

        const params: any = {
            TableName: table,
            FilterExpression: builtFilter.expression,
            ExpressionAttributeValues: marshall(builtFilter.values),
            ExpressionAttributeNames: builtFilter.names,
        };

        return this.executeScan(params, deserializer);
    }

    async updateWithBuilder(
        pk: PK,
        sk: SK,
        updateBuilder: UpdateBuilder,
        tableName?: string
    ): Promise<Record<string, any> | null> {
        const table = tableName || this.tableName;
        const builtUpdate = updateBuilder.build();

        const params: any = {
            TableName: table,
            Key: marshall({ PK: pk, SK: sk }),
            UpdateExpression: builtUpdate.expression,
            ExpressionAttributeValues: marshall(builtUpdate.values),
            ExpressionAttributeNames: builtUpdate.names,
            ReturnValues: "ALL_NEW",
        };

        const result = await this.client.send(new UpdateItemCommand(params));
        return result.Attributes ? unmarshall(result.Attributes) : null;
    }

    private async executeQuery<T>(
        params: any,
        deserializer: Deserializer<T>
    ): Promise<T[]> {
        const result = await this.client.send(new QueryCommand(params));
        return result.Items?.map(item => {
            const unmarshalled = unmarshall(item) as Record<string, any>;
            return deserializer(unmarshalled);
        }) || [];
    }

    private async executeScan<T>(
        params: any,
        deserializer: Deserializer<T>
    ): Promise<T[]> {
        const result = await this.client.send(new ScanCommand(params));
        return result.Items?.map(item => {
            const unmarshalled = unmarshall(item) as Record<string, any>;
            return deserializer(unmarshalled);
        }) || [];
    }
}