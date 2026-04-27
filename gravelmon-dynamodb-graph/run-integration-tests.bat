@echo off
setlocal

echo Starting local DynamoDB...
docker compose up -d
timeout /t 5 > nul

echo Running integration tests...
cd nodejs
call npm run test:integration

echo Stopping local DynamoDB...
cd ..
docker compose down

echo Integration tests completed.
pause