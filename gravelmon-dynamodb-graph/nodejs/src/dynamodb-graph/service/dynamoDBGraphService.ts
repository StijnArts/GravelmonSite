import {
    DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import {
    BatchGetCommand,
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    QueryCommandInput
} from "@aws-sdk/lib-dynamodb";
import { DynamoEdge, DynamoItem, DynamoNode, ItemType, PK } from "./dynamoNodes";
import { deserializerRegistry } from "./deserializerRegistry";

export class DynamoDBGraphService {
    private client: DynamoDBDocumentClient;
    private tableName: string;

    constructor(tableName: string, client?: DynamoDBClient) {
        const baseClient = client ?? new DynamoDBClient({});
        this.client = DynamoDBDocumentClient.from(baseClient, {
            marshallOptions: {
                removeUndefinedValues: true
            }
        });
        this.tableName = tableName;
    }

    // ---------- Core Query ----------

    async queryByPK(
        pk: PK
    ): Promise<any[]> {
        const input: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: "PK = :pk",
            ExpressionAttributeValues: {
                ":pk": pk
            }
        };

        const result = await this.client.send(new QueryCommand(input));
        return this.deserializeItems(result.Items ?? []);
    }

    async queryByPKAndSKPrefix(
        pk: PK,
        skPrefix: string
    ): Promise<any[]> {
        const input: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": pk,
                ":sk": skPrefix
            }
        };

        const result = await this.client.send(new QueryCommand(input));
        return this.deserializeItems(result.Items ?? []);
    }

    async getNode(pk: PK): Promise<DynamoNode | null> {
        const items = await this.queryByPKAndSKPrefix(pk, "METADATA");
        const node = items.find(i => i instanceof DynamoNode);
        return node ?? null;
    }

    async getEdges<T extends DynamoEdge>(pk: PK): Promise<T[]> {
        const items = await this.queryByPKAndSKPrefix(pk, "EDGE#");
        return items.filter((i): i is T => i instanceof DynamoEdge);
    }

    async getNodesAndEdges<T extends DynamoNode | DynamoEdge>(pk: PK): Promise<T[]> {
        const items = await this.queryByPKAndSKPrefix(pk, "EDGE#");
        return items;
    }

    async getEdgesByType(
        pk: PK,
        edgeType: string
    ): Promise<DynamoEdge[]> {
        const prefix = `EDGE#${edgeType}#`;
        const items = await this.queryByPKAndSKPrefix(pk, prefix);
        return items.filter((i): i is DynamoEdge => i instanceof DynamoEdge);
    }

    async batchGetNodes(pks: PK[]): Promise<DynamoNode[]> {
        const keys = pks.map(pk => ({
            PK: pk,
            SK: "METADATA"
        }));

        const requestItems: Record<string, any> = {
            [this.tableName]: {
                Keys: keys
            }
        };

        let results: DynamoNode[] = [];
        let unprocessed = requestItems;

        do {
            const response = await this.client.send(
                new BatchGetCommand({
                    RequestItems: unprocessed
                })
            );
            const items = response.Responses?.[this.tableName] ?? [];
            results.push(...items.map(DynamoNode.deserialize));
            unprocessed = response.UnprocessedKeys ?? {};
        } while (Object.keys(unprocessed).length > 0);

        return results;
    }

    // ---------- Write Operations ----------

    async putItem(item: DynamoItem): Promise<void> {
        const serialized = item.serialize();
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: serialized
            })
        );
    }

    // ---------- Deserialization ----------

    private deserializeItems(
        items: Record<string, any>[]
    ): any[] {
        return items.map(item => this.deserializeItem(item));
    }

    private deserializeItem(item: Record<string, any>): any {
        const type = item.entityType;
        return deserializerRegistry.deserialize(type, item);
    }
}