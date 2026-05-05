#!/bin/bash

# Build script for AWS SAM Lambda with DynamoDB Graph Layer
# Compiles layer, builds SAM, and prepares for deployment

set -e  # Exit on any error

echo ""
echo "===================================="
echo "Building Layer and Lambda Functions"
echo "===================================="
echo ""

# Navigate to layer directory and build
echo "[1/3] Building DynamoDB Graph Layer..."
cd ../gravelmon-dynamodb-graph/nodejs

npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Layer build failed"
    exit 1
fi

echo ""
echo "[2/3] Compiling Lambda handlers..."
cd ../../aws-dynamodb-sam

npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Handler compilation failed"
    exit 1
fi

echo ""
echo "[3/3] Building SAM application..."
sam build
if [ $? -ne 0 ]; then
    echo "ERROR: SAM build failed"
    exit 1
fi

echo ""
echo "===================================="
echo "Build Completed Successfully!"
echo "===================================="
echo ""
echo "Next steps:"
echo "  - Local testing:   ./test.sh"
echo "  - Deploy to AWS:   ./deploy.sh"
echo "  - Local invoke:    sam local invoke TestFunction"
echo ""
