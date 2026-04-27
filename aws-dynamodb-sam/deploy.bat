@echo off
REM Deploy script for AWS SAM Lambda with DynamoDB Graph Layer
REM Deploys the Lambda functions and layer to AWS

setlocal enabledelayedexpansion

echo.
echo ====================================
echo Deploying to AWS
echo ====================================
echo.

REM Check if build artifacts exist
if not exist ".aws-sam\build\template.yaml" (
    echo ERROR: SAM build artifacts not found
    echo Please run build.bat first
    exit /b 1
)

REM Validate template
echo [1/3] Validating SAM template...
call sam validate
if errorlevel 1 (
    echo ERROR: Template validation failed
    exit /b 1
)

echo.
echo [2/3] Building for deployment...
call sam build
if errorlevel 1 (
    echo ERROR: SAM build failed
    exit /b 1
)

echo.
echo [3/3] Deploying stack to AWS...
echo.
echo NOTE: This will prompt you for deployment parameters
echo       (stack name, region, etc.) on first deployment
echo.
call sam deploy --guided

if errorlevel 1 (
    echo ERROR: Deployment failed
    exit /b 1
)

echo.
echo ====================================
echo Deployment Completed Successfully!
echo ====================================
echo.
echo To check deployment status:
echo   aws cloudformation describe-stacks --stack-name ^<stack-name^>
echo.
echo To invoke your function:
echo   aws lambda invoke --function-name ^<function-name^> output.json
echo.

endlocal
