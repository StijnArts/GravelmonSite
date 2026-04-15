# AWS DynamoDB SAM Node.js App

This project is an AWS SAM Node.js application that uses DynamoDB as the database and exposes a Lambda-backed HTTP API.

The implementation uses AWS SDK for JavaScript v3 in `index.js` to perform DynamoDB operations.

## Recommended architecture

- Local machine:
  - `DynamoDB Local` runs on `localhost:8000`
  - `sam local start-api` runs the Node.js Lambda handler in a container
  - Local HTTP requests hit the Lambda API and the Lambda uses the AWS SDK to access DynamoDB
- AWS deployment:
  - `AWS SAM` deploys the Lambda function and DynamoDB table in the same AWS account
  - The Lambda function uses DynamoDB CRUD permissions provided by the SAM template

This keeps the production architecture aligned with AWS while allowing local development and testing.

## Project structure

- `template.yaml` - SAM template defining the Lambda and DynamoDB table
- `package.json` - Node.js package file with dependencies and scripts
- `index.js` - Lambda handler and DynamoDB service code
- `run-local.bat` / `run-local.sh` - helpers for local testing

## Local setup

### Prerequisites

- Docker
- AWS SAM CLI
- Node.js 18+
- npm

### Start DynamoDB Local

Run DynamoDB Local on port `8000` before starting SAM local. The Lambda runtime container uses `host.docker.internal` to connect back to the host, so the service must be reachable from Docker.

Windows:

```powershell
cd aws-dynamodb-sam
if (-Not (Test-Path DynamoDBLocal.jar)) {
  Invoke-WebRequest -Uri https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.zip -OutFile dynamodb_local_latest.zip
  Expand-Archive dynamodb_local_latest.zip -Force
}
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory -port 8000
```

If you do not have the local jar, you can also use Docker:

```powershell
docker run --rm -p 8000:8000 amazon/dynamodb-local
```

Linux/macOS:

```bash
cd aws-dynamodb-sam
if [ ! -f DynamoDBLocal.jar ]; then
  curl -LO https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz
  tar -xzf dynamodb_local_latest.tar.gz
fi
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory -port 8000
```

### Run locally

Windows:

```powershell
cd aws-dynamodb-sam
run-local.bat
```

Linux/macOS:

```bash
cd aws-dynamodb-sam
./run-local.sh
```

Or use npm:

```bash
cd aws-dynamodb-sam
npm install
npm start
```

### Test the API

Create an item:

```bash
curl -X POST http://127.0.0.1:3000/items \
  -H "Content-Type: application/json" \
  -d '{"operation":"create","id":"item-1","name":"Sample","description":"Sample item"}'
```

Get an item by id:

```bash
curl "http://127.0.0.1:3000/items?id=item-1"
```

Query by name:

```bash
curl -X POST http://127.0.0.1:3000/items \
  -H "Content-Type: application/json" \
  -d '{"operation":"query","name":"Sample"}'
```

## Deploy to AWS

Build and deploy the app:

```bash
cd aws-dynamodb-sam
npm install
sam deploy --guided --template-file template.yaml --stack-name dynamodb-sam-app --capabilities CAPABILITY_IAM
```

The SAM template creates a DynamoDB table and a Lambda function with DynamoDB access.
