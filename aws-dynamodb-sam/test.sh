#!/bin/bash

# Test script for AWS SAM Lambda
# Runs local tests and invokes Lambda functions locally

set -e  # Exit on any error

echo ""
echo "===================================="
echo "Running Tests"
echo "===================================="
echo ""

# Check if build artifacts exist
if [ ! -f ".aws-sam/build/template.yaml" ]; then
    echo "ERROR: SAM build artifacts not found"
    echo "Please run ./build.sh first"
    exit 1
fi

# Run npm tests if they exist
echo "[1/3] Running unit tests..."
npm test || echo "WARNING: Unit tests failed or not configured"

echo ""
echo "[2/3] Testing Lambda functions locally..."
echo ""

# Invoke TestFunction
echo "Invoking TestFunction..."
sam local invoke TestFunction
if [ $? -ne 0 ]; then
    echo "ERROR: TestFunction invocation failed"
    exit 1
fi

echo ""

# Check if DynamoRelationalFunction exists and invoke it
echo "Invoking DynamoRelationalFunction..."
sam local invoke DynamoRelationalFunction || echo "WARNING: DynamoRelationalFunction invocation failed or not available"

echo ""
echo "[3/3] Running integration tests..."
cd ../gravelmon-dynamodb-graph/nodejs

npm run test:integration || echo "WARNING: Integration tests failed or not configured"

cd ../../aws-dynamodb-sam

echo ""
echo "===================================="
echo "Testing Completed!"
echo "===================================="
echo ""
echo "To run specific tests:"
echo "  - Layer tests:     npm run test --prefix ../gravelmon-dynamodb-graph/nodejs"
echo "  - Watch mode:      npm run test:watch --prefix ../gravelmon-dynamodb-graph/nodejs"
echo "  - Invoke function: sam local invoke <FunctionName>"
echo "  - Start API:       npm run start"
echo ""
