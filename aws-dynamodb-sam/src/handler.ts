const {
  createNode,
  createEdge,
  getNode,
  getEdge,
  getNeighbors,
  queryNodes,
  ensureTableExists,
  successResponse,
  errorResponse,
} = require("dynamodb-graph");

interface LambdaEvent {
  httpMethod?: string;
  queryStringParameters?: { [key: string]: string | undefined };
  body?: string;
}

interface RequestBody {
  operation?: string;
  id?: string;
  name?: string;
  description?: string;
  metadata?: any;
  sourceId?: string;
  targetId?: string;
  relation?: string;
  properties?: any;
}

const handler = async (event: LambdaEvent) => {
  if (!process.env.DYNAMODB_TABLE) {
    return errorResponse(500, "DYNAMODB_TABLE environment variable is required.");
  }
  
  await ensureTableExists();

  try {
    if (event.httpMethod === "GET") {
      const id = event.queryStringParameters?.id;
      if (!id) {
        return errorResponse(400, "Missing query parameter: id");
      }
      const item = await getNode(id);
      if (!item) {
        return errorResponse(404, "Node not found");
      }
      return successResponse(item);
    }

    const body: RequestBody = event.body ? JSON.parse(event.body) : {};
    const operation = body.operation?.toLowerCase();

    switch (operation) {
      case "create":
      case "createnode":
        if (!body.id) {
          return errorResponse(400, "Missing id in request body.");
        }
        const createdNode = await createNode({
          id: body.id,
          name: body.name,
          description: body.description,
          metadata: body.metadata,
        });
        return successResponse(createdNode);
      case "createedge":
        if (!body.sourceId || !body.targetId) {
          return errorResponse(400, "Missing sourceId or targetId in request body.");
        }
        const createdEdge = await createEdge({
          sourceId: body.sourceId,
          targetId: body.targetId,
          relation: body.relation,
          properties: body.properties,
        });
        return successResponse(createdEdge);
      case "query":
      case "querynodes":
        return successResponse(await queryNodes(body.name));
      case "neighbors":
        if (!body.sourceId) {
          return errorResponse(400, "Missing sourceId in request body.");
        }
        return successResponse(await getNeighbors(body.sourceId));
      case "getedge":
        if (!body.sourceId || !body.targetId) {
          return errorResponse(400, "Missing sourceId or targetId in request body.");
        }
        const edge = await getEdge(body.sourceId, body.targetId);
        if (!edge) {
          return errorResponse(404, "Edge not found");
        }
        return successResponse(edge);
      default:
        return errorResponse(400, `Unsupported operation: ${body.operation}`);
    }
  } catch (error: any) {
    return errorResponse(500, error.message || "Internal error");
  }
};

module.exports = { handler };
