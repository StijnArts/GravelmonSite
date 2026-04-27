@echo off
REM Test script for AWS SAM Lambda
REM Runs local tests and invokes Lambda functions locally

setlocal enabledelayedexpansion

echo.
echo ====================================
echo Running Tests
echo ====================================
echo.

REM Check if build artifacts exist
if not exist ".aws-sam\build\template.yaml" (
    echo ERROR: SAM build artifacts not found
    echo Please run build.bat first
    exit /b 1
)

REM Run npm tests if they exist
echo [1/3] Running unit tests...
call npm test
if errorlevel 1 (
    echo WARNING: Unit tests failed or not configured
)

echo.
echo [2/3] Testing Lambda functions locally...
echo.

REM Invoke TestFunction
echo Invoking TestFunction...
call sam local invoke TestFunction
if errorlevel 1 (
    echo ERROR: TestFunction invocation failed
    exit /b 1
)

echo.

REM Check if DynamoRelationalFunction exists and invoke it
echo Invoking DynamoRelationalFunction...
call sam local invoke DynamoRelationalFunction
if errorlevel 1 (
    echo WARNING: DynamoRelationalFunction invocation failed or not available
)

echo.
echo [3/3] Running integration tests...
cd ..\gravelmon-dynamodb-graph\nodejs
if errorlevel 1 (
    echo WARNING: Could not run layer integration tests
    cd ..\..\aws-dynamodb-sam
    goto :test_complete
)

call npm run test:integration
if errorlevel 1 (
    echo WARNING: Integration tests failed or not configured
)

cd ..\..\aws-dynamodb-sam

:test_complete
echo.
echo ====================================
echo Testing Completed!
echo ====================================
echo.
echo To run specific tests:
echo   - Layer tests:     npm run test --prefix ../gravelmon-dynamodb-graph/nodejs
echo   - Watch mode:      npm run test:watch --prefix ../gravelmon-dynamodb-graph/nodejs
echo   - Invoke function: sam local invoke ^<FunctionName^>
echo   - Start API:       npm run start
echo.

endlocal
