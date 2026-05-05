#!/bin/bash

# Deploy script for AWS SAM Lambda with DynamoDB Graph Layer
# Deploys the Lambda functions and layer to AWS

set -e  # Exit on any error

echo ""
echo "===================================="
echo "Deploying to AWS"
echo "===================================="
echo ""

# Check if build artifacts exist
if [ ! -f ".aws-sam/build/template.yaml" ]; then
    echo "ERROR: SAM build artifacts not found"
    echo "Please run ./build.sh first"
    exit 1
fi

# Validate template
echo "[1/3] Validating SAM template..."
sam validate
if [ $? -ne 0 ]; then
    echo "ERROR: Template validation failed"
    exit 1
fi

echo ""
echo "[2/3] Building for deployment..."
sam build
if [ $? -ne 0 ]; then
    echo "ERROR: SAM build failed"
    exit 1
fi

echo ""
echo "[3/3] Deploying stack to AWS..."
echo ""
echo "NOTE: This will prompt you for deployment parameters"
echo "      (stack name, region, etc.) on first deployment"
echo ""
sam deploy --guided

if [ $? -ne 0 ]; then
    echo "ERROR: Deployment failed"
    exit 1
fi

echo ""
echo "===================================="
echo "Deployment Completed Successfully!"
echo "===================================="
echo ""
echo "To check deployment status:"
echo "  aws cloudformation describe-stacks --stack-name <stack-name>"
echo ""
echo "To invoke your function:"
echo "  aws lambda invoke --function-name <function-name> output.json"
echo ""
