interface LambdaResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

function successResponse(body: any): LambdaResponse {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function errorResponse(statusCode: number, message: string): LambdaResponse {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  };
}

export { successResponse, errorResponse };
