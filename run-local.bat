@echo off
SETLOCAL
pushd "%~dp0"

echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
  echo npm install failed.
  popd
  exit /b %ERRORLEVEL%
)

if not defined DYNAMODB_ENDPOINT set "DYNAMODB_ENDPOINT=http://host.docker.internal:8000"
if not defined DYNAMODB_TABLE set "DYNAMODB_TABLE=Products"
if not defined AWS_REGION set "AWS_REGION=us-east-1"

if exist "%~dp0DynamoDBLocal.jar" (
  echo Starting DynamoDB Local from jar on port 8000...
  start /B java -Djava.library.path="%~dp0DynamoDBLocal_lib" -jar "%~dp0DynamoDBLocal.jar" -inMemory -port 8000
  timeout /t 2 > nul
) else (
  echo WARNING: DynamoDBLocal.jar not found. Make sure DynamoDB Local is running on port 8000.
  echo You can run: docker run --rm -p 8000:8000 amazon/dynamodb-local
)

echo Starting local API on http://127.0.0.1:3000
call sam local start-api --template template.yaml --port 3000 --parameter-overrides DynamoTableName=%DYNAMODB_TABLE% LocalDynamoEndpoint=%DYNAMODB_ENDPOINT%
popd
