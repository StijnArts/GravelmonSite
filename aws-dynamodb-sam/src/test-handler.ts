const { helloWorld } = require("/opt/nodejs/dynamodb-graph/models/nodes/test.js");

interface LambdaResponse {
  statusCode: number;
  body: string;
}

const handler = async (): Promise<LambdaResponse> => {
  try {
    const message = helloWorld();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
        success: true,
      }),
    };
  } catch (error) {
    console.error("Error calling helloWorld:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? helloWorld() : String(helloWorld()),
      }),
    };
  }
};

module.exports = { handler };
