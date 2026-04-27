@echo off
REM Build script for AWS SAM Lambda with DynamoDB Graph Layer
REM Compiles layer, builds SAM, and prepares for deployment

setlocal enabledelayedexpansion

echo.
echo ====================================
echo Building Layer and Lambda Functions
echo ====================================
echo.

REM Navigate to layer directory and build
echo [1/3] Building DynamoDB Graph Layer...
cd ..\gravelmon-dynamodb-graph\nodejs
if errorlevel 1 (
    echo ERROR: Failed to navigate to layer directory
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo ERROR: Layer build failed
    exit /b 1
)

echo.
echo [2/3] Compiling Lambda handlers...
cd ..\..\aws-dynamodb-sam
if errorlevel 1 (
    echo ERROR: Failed to navigate back to sam directory
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo ERROR: Handler compilation failed
    exit /b 1
)

echo.
echo [3/3] Building SAM application...
call sam build
if errorlevel 1 (
    echo ERROR: SAM build failed
    exit /b 1
)

echo.
echo ====================================
echo Build Completed Successfully!
echo ====================================
echo.
echo Next steps:
echo   - Local testing:   test.bat
echo   - Deploy to AWS:   deploy.bat
echo   - Local invoke:    sam local invoke TestFunction
echo.

endlocal
