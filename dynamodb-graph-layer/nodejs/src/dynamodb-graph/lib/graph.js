const {
  DynamoDBClient,
  CreateTableCommand,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");

module.exports = {
  ensureTableExists,
  createNode,
  createEdge,
  getNode,
  getEdge,
  getNeighbors,
  queryNodes,
};

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const TABLE_ENDPOINT = process.env.DYNAMODB_ENDPOINT;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: TABLE_ENDPOINT || undefined,
});

const NODE_PREFIX = "NODE#";
const EDGE_PREFIX = "EDGE#";

async function ensureTableExists() {
  if (!TABLE_NAME) {
    throw new Error("DYNAMODB_TABLE environment variable is required.");
  }

  try {
    const command = new CreateTableCommand({
      TableName: TABLE_NAME,
      AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "PK", KeyType: "HASH" },
        { AttributeName: "SK", KeyType: "RANGE" },
      ],
      BillingMode: "PAY_PER_REQUEST",
    });

    await dynamoClient.send(command);
    return true;
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      return false;
    }
    throw error;
  }
}

function buildNodeKey(id) {
  return { PK: `${NODE_PREFIX}${id}`, SK: "NODE" };
}

function buildEdgeKey(sourceId, targetId) {
  return { PK: `${NODE_PREFIX}${sourceId}`, SK: `${EDGE_PREFIX}${targetId}` };
}

async function createNode({ id, name, description, metadata }) {
  if (!id) {
    throw new Error("Node id is required.");
  }

  const item = {
    ...buildNodeKey(id),
    Type: "Node",
    Name: name || null,
    Description: description || null,
    Metadata: metadata ? JSON.stringify(metadata) : null,
  };

  await dynamoClient.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(item, { removeUndefinedValues: true }),
    })
  );

  return { id, name, description, metadata: metadata || null };
}

async function createEdge({ sourceId, targetId, relation, properties }) {
  if (!sourceId || !targetId) {
    throw new Error("sourceId and targetId are required.");
  }

  const item = {
    ...buildEdgeKey(sourceId, targetId),
    Type: "Edge",
    SourceId: sourceId,
    TargetId: targetId,
    Relation: relation || null,
    Properties: properties ? JSON.stringify(properties) : null,
  };

  await dynamoClient.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(item, { removeUndefinedValues: true }),
    })
  );

  return { sourceId, targetId, relation, properties: properties || null };
}

async function getNode(id) {
  if (!id) {
    throw new Error("Node id is required.");
  }

  const result = await dynamoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall(buildNodeKey(id)),
    })
  );

  if (!result.Item) {
    return null;
  }

  const item = unmarshall(result.Item);
  return {
    id,
    name: item.Name || null,
    description: item.Description || null,
    metadata: item.Metadata ? JSON.parse(item.Metadata) : null,
  };
}

async function getEdge(sourceId, targetId) {
  if (!sourceId || !targetId) {
    throw new Error("sourceId and targetId are required.");
  }

  const result = await dynamoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall(buildEdgeKey(sourceId, targetId)),
    })
  );

  if (!result.Item) {
    return null;
  }

  const item = unmarshall(result.Item);
  return {
    sourceId: item.SourceId,
    targetId: item.TargetId,
    relation: item.Relation || null,
    properties: item.Properties ? JSON.parse(item.Properties) : null,
  };
}

async function getNeighbors(sourceId) {
  if (!sourceId) {
    throw new Error("sourceId is required.");
  }

  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :edgePrefix)",
    ExpressionAttributeValues: marshall({
      ":pk": buildNodeKey(sourceId).PK,
      ":edgePrefix": EDGE_PREFIX,
    }),
  });

  const result = await dynamoClient.send(command);
  const edges = (result.Items || []).map((item) => {
    const edge = unmarshall(item);
    return {
      sourceId: edge.SourceId,
      targetId: edge.TargetId,
      relation: edge.Relation || null,
      properties: edge.Properties ? JSON.parse(edge.Properties) : null,
    };
  });

  return edges;
}

async function queryNodes(name) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "#type = :nodeType",
    ExpressionAttributeNames: { "#type": "Type" },
    ExpressionAttributeValues: marshall({ ":nodeType": "Node" }),
  };

  if (name) {
    params.FilterExpression = "#type = :nodeType AND contains(#name, :name)";
    params.ExpressionAttributeNames["#name"] = "Name";
    params.ExpressionAttributeValues = {
      ...params.ExpressionAttributeValues,
      ...marshall({ ":name": name }),
    };
  }

  const result = await dynamoClient.send(new ScanCommand(params));

  return (result.Items || []).map((item) => {
    const node = unmarshall(item);
    return {
      id: node.PK.replace(NODE_PREFIX, ""),
      name: node.Name || null,
      description: node.Description || null,
      metadata: node.Metadata ? JSON.parse(node.Metadata) : null,
    };
  });
}