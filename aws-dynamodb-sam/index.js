const {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
  GetItemCommand,
  PutItemCommand,
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
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
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

exports.handler = async (event) => {
  if (!tableName) {
    return errorResponse(500, "DYNAMODB_TABLE environment variable is required.");
  }

  await ensureTableExists();

  try {
    if (event.httpMethod === "GET") {
      const id = event.queryStringParameters && event.queryStringParameters.id;
      if (!id) {
        return errorResponse(400, "Missing query parameter: id");
      }
      const item = await getById(id);
      if (!item) {
        return errorResponse(404, "Item not found");
      }
      return successResponse(item);
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const operation = body.operation && body.operation.toLowerCase();
    switch (operation) {
      case "create":
        if (!body.id) {
          return errorResponse(400, "Missing id in request body.");
        }
        const created = await createItem({ id: body.id, name: body.name, description: body.description });
        return successResponse(created);
      case "query":
        return successResponse(await queryByName(body.name));
      default:
        return errorResponse(400, `Unsupported operation: ${body.operation}`);
    }
  } catch (error) {
    return errorResponse(500, error.message || "Internal error");
  }
};

async function createItem(item) {
  await client.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
    })
  );
  return item;
}

async function getById(id) {
  const result = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: marshall({ id }),
    })
  );
  return result.Item ? unmarshall(result.Item) : null;
}

async function queryByName(name) {
  const response = await client.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: "contains(#name, :name)",
      ExpressionAttributeNames: { "#name": "name" },
      ExpressionAttributeValues: marshall({ ":name": name || "" }),
    })
  );
  return response.Items ? response.Items.map(unmarshall) : [];
}

function successResponse(body) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function errorResponse(statusCode, message) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}
