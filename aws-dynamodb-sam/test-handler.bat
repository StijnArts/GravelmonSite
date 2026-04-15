@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

set "URL=http://127.0.0.1:3000/items"

echo Testing DynamoDB SAM handler on %URL%

echo.
echo 1) Create item
set "CREATE_BODY={""operation"":""create"",""id"":""item-1"",""name"":""Sample"",""description"":""Test item""}"
curl -s -X POST "%URL%" -H "Content-Type: application/json" -d "%CREATE_BODY%"
echo.
echo.
echo 2) Get item by id
curl -s "%URL%?id=item-1"
echo.
echo.
echo 3) Query items by name
set "QUERY_BODY={""operation"":""query"",""name"":""Sample""}"
curl -s -X POST "%URL%" -H "Content-Type: application/json" -d "%QUERY_BODY%"
echo.
echo.
echo Test requests complete.
ENDLOCAL