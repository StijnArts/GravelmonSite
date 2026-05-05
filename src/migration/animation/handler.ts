import {
  createAnimationNode,
  createErrorResponse, createSuccessResponse,
  DynamoDBGraphService,
  LambdaEvent,
  parseBody,
  PrimaryPoseType
} from "gravelmon-dynamodb";

export const handler = async (event: LambdaEvent, dynamoGraphService?: DynamoDBGraphService) => {
  if (!process.env.DYNAMODB_TABLE) {

    return createErrorResponse(500, "DYNAMODB_TABLE environment variable is required.");
  }

  dynamoGraphService = dynamoGraphService || new DynamoDBGraphService(process.env.DYNAMODB_TABLE);
  console.log("DynamoDBGraphService:", DynamoDBGraphService);
  console.log("Resolved module path:", require.resolve("dynamodb-graph"));
  console.log("Service prototype:", Object.getOwnPropertyNames(DynamoDBGraphService.prototype));
  let tableExists = await dynamoGraphService.tableExists();

  if(!tableExists) return createErrorResponse(500, "Table does not exist");

  try {
    const parsed = parseBody<{ name: string, primaryPoseType: PrimaryPoseType }[]>(event);
    const animationNodes = parsed.map(entry=> createAnimationNode(entry.name, entry.primaryPoseType))
    await dynamoGraphService.batchPutItems(animationNodes);
    return createSuccessResponse(200, "Successfully created animation nodes")
  } catch (error: any) {
    return createErrorResponse(500, error.message || "Internal error");
  }
};
