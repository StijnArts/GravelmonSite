const {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const tableName = process.env.DYNAMODB_TABLE;
const dynamoEndpoint = process.env.DYNAMODB_ENDPOINT || "";
const region = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({
  region,
  ...(dynamoEndpoint ? { endpoint: dynamoEndpoint } : {}),
});

async function ensureTableExists() {
  if (!dynamoEndpoint) {
    return;
  }

  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
  } catch (error) {
    if (error.name === "ResourceNotFoundException" || error.name === "ResourceNotFound") {
      await client.send(
        new CreateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: "PK", AttributeType: "S" },
            { AttributeName: "SK", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },
            { AttributeName: "SK", KeyType: "RANGE" },
          ],
          BillingMode: "PAY_PER_REQUEST",
        })
      );
      await waitForTableActive();
      return;
    }
    throw error;
  }
}

async function waitForTableActive() {
  const maxTries = 10;
  for (let i = 0; i < maxTries; i += 1) {
    const response = await client.send(new DescribeTableCommand({ TableName: tableName }));
    if (response.Table && response.Table.TableStatus === "ACTIVE") {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`DynamoDB table ${tableName} did not become active in time.`);
}

function nodeKey(id) {
  return {
    PK: `NODE#${id}`,
    SK: `NODE#${id}`,
  };
}

function edgeKey(sourceId, targetId) {
  return {
    PK: `NODE#${sourceId}`,
    SK: `EDGE#${targetId}`,
  };
}

async function createNode({ id, name, description, metadata }) {
  const node = {
    PK: `NODE#${id}`,
    SK: `NODE#${id}`,
    itemType: "node",
    id,
    name,
    description,
    metadata: metadata || {},
  };

  await client.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall(node),
    })
  );

  return node;
}

async function createEdge({ sourceId, targetId, relation, properties }) {
  const edge = {
    ...edgeKey(sourceId, targetId),
    itemType: "edge",
    sourceId,
    targetId,
    relation: relation || "unknown",
    properties: properties || {},
  };

  await client.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall(edge),
    })
  );

  return edge;
}

async function getNode(id) {
  const result = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: marshall(nodeKey(id)),
    })
  );
  return result.Item ? unmarshall(result.Item) : null;
}

async function getEdge(sourceId, targetId) {
  const result = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: marshall(edgeKey(sourceId, targetId)),
    })
  );
  return result.Item ? unmarshall(result.Item) : null;
}

async function getNeighbors(sourceId) {
  const response = await client.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :edgePrefix)",
      ExpressionAttributeValues: marshall({
        ":pk": `NODE#${sourceId}`,
        ":edgePrefix": "EDGE#",
      }),
    })
  );
  return response.Items ? response.Items.map(unmarshall) : [];
}

async function queryNodes(name) {
  const response = await client.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: "itemType = :type AND contains(#name, :name)",
      ExpressionAttributeNames: { "#name": "name" },
      ExpressionAttributeValues: marshall({ ":type": "node", ":name": name || "" }),
    })
  );
  return response.Items ? response.Items.map(unmarshall) : [];
}

module.exports = {
  ensureTableExists,
  createNode,
  createEdge,
  getNode,
  getEdge,
  getNeighbors,
  queryNodes,
};
