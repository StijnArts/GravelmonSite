#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

npm install

if [ -z "${DYNAMODB_ENDPOINT:-}" ]; then
  export DYNAMODB_ENDPOINT="http://host.docker.internal:8000"
fi
if [ -z "${DYNAMODB_TABLE:-}" ]; then
  export DYNAMODB_TABLE="Products"
fi
if [ -z "${AWS_REGION:-}" ]; then
  export AWS_REGION="us-east-1"
fi

if [ -f "$SCRIPT_DIR/DynamoDBLocal.jar" ]; then
  echo "Starting DynamoDB Local from jar on port 8000..."
  java -Djava.library.path="$SCRIPT_DIR/DynamoDBLocal_lib" -jar "$SCRIPT_DIR/DynamoDBLocal.jar" -inMemory -port 8000 &
  sleep 2
else
  echo "WARNING: DynamoDBLocal.jar not found. Make sure DynamoDB Local is running on port 8000."
  echo "You can run: docker run --rm -p 8000:8000 amazon/dynamodb-local"
fi

echo "Starting local API on http://127.0.0.1:3000"
sam local start-api --template template.yaml --port 3000 --parameter-overrides "DynamoTableName=${DYNAMODB_TABLE}" "LocalDynamoEndpoint=${DYNAMODB_ENDPOINT}"
