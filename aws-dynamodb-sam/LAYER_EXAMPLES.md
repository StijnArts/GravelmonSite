# Lambda Layer Imports - Quick Start Examples

## Basic Usage

### Single Export Import
```typescript
import { helloWorld } from "dynamodb-graph/models/nodes/test.js";

const message = helloWorld();
```

### Multiple Exports
```typescript
import { helloWorld, someOtherFunction } from "dynamodb-graph/models/index.js";
```

### Namespace Import
```typescript
import * as Models from "dynamodb-graph/models";

Models.helloWorld();
```

### Type Imports
```typescript
import type { GraphNode, EdgeType } from "dynamodb-graph/types";

const node: GraphNode = { /* ... */ };
```

## Complete Handler Example

```typescript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { queryGraph, processNode } from "dynamodb-graph/models/dynamo";
import type { GraphNode } from "dynamodb-graph/types";

interface LambdaResponse {
  statusCode: number;
  body: string;
}

interface GraphQueryEvent {
  nodeId: string;
  depth?: number;
}

const client = new DynamoDBClient({ region: "us-east-1" });

const handler = async (
  event: GraphQueryEvent
): Promise<LambdaResponse> => {
  try {
    const nodes = await queryGraph(event.nodeId, event.depth || 1);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        nodes,
        success: true,
      }),
    };
  } catch (error) {
    console.error("Graph query error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to query graph",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
```

## Development Workflow

### First Time Setup
```bash
cd aws-dynamodb-sam
npm install
npm run setup-layer      # Creates local layer mirror
npm run build            # Compiles everything
npm run start            # Starts SAM local API
```

### After Updating Layer Code
```bash
# Update the layer source in gravelmon-dynamodb-graph/nodejs/src
# Then:
cd gravelmon-dynamodb-graph/nodejs
npm run build            # Rebuild the layer

cd ../../../aws-dynamodb-sam
npm run setup-layer      # Update local mirror
npm run build            # Recompile handlers
npm run start            # Restart local API
```

### Using IDE with Layer Code
- **Hover over imported functions** → See JSDoc comments and types
- **Ctrl+Click on imports** → Jump to layer source code
- **Autocomplete** → Press Ctrl+Space to see available exports
- **Type checking** → TypeScript validates your usage against layer types

## Deployment Steps

### 1. Build Layer
```bash
cd gravelmon-dynamodb-graph/nodejs
npm run build
npm run create-layer      # Creates layer.zip if script exists
```

### 2. Publish to AWS
```bash
# Upload layer
aws lambda publish-layer-version \
  --layer-name my-dynamodb-graph \
  --zip-file fileb://layer.zip \
  --compatible-runtimes nodejs20.x

# Note the LayerVersionArn returned
```

### 3. Update SAM Template
```yaml
# template.yaml
Globals:
  Function:
    Layers:
      - arn:aws:lambda:us-east-1:123456789012:layer:my-dynamodb-graph:1

Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: handler.handler
      Runtime: nodejs20.x
```

### 4. Deploy Handler
```bash
cd aws-dynamodb-sam
npm run build

sam build
sam deploy --guided
```

## IDE Tooltip Verification

### ✅ Tooltips Should Work
After importing:
```typescript
import { helloWorld } from "dynamodb-graph/models/nodes/test.js";
                        // ↓ Should show autocomplete suggestions
```

### ✅ Types Should Resolve
```typescript
import type { SomeType } from "dynamodb-graph/types";

const value: SomeType = /* ↓ IDE shows type requirements */
```

### ⚠️ If Tooltips Don't Appear
1. **Reload VS Code:** Ctrl+Shift+P → "Reload Window"
2. **Verify layer is built:**
   ```bash
   ls ../gravelmon-dynamodb-graph/nodejs/dist/dynamodb-graph/
   ```
3. **Check tsconfig.json:** Confirm `paths` are set correctly
4. **Verify setup-layer ran:** Check `aws-dynamodb-sam/layer/nodejs/node_modules/dynamodb-graph/`

## Export Organization

### Layer Source Structure (Best Practice)
```
src/dynamodb-graph/
├── index.ts              # Main exports
├── models/
│   ├── index.ts          # Re-exports
│   ├── nodes/
│   │   └── test.ts
│   └── dynamo.ts
├── types/
│   ├── index.ts
│   └── graph.ts
└── utils/
    └── index.ts
```

### index.ts (Root Export)
```typescript
// Explicitly export commonly used items
export * from "./models";
export * from "./types";
export { utility1, utility2 } from "./utils";

// Export specific items for cleaner API
export { DynamoHelper } from "./models/dynamo";
```

### This Enables
```typescript
// All valid:
import { helloWorld } from "dynamodb-graph/models/nodes/test.js";
import { DynamoHelper } from "dynamodb-graph/models/dynamo.js";
import type { GraphNode } from "dynamodb-graph/types/graph.js";
import { utility1 } from "dynamodb-graph/utils/index.js";
import { DynamoHelper } from "dynamodb-graph";  // From index.ts
```

## Troubleshooting Matrix

| Issue | Check | Solution |
|-------|-------|----------|
| Module not found | Layer built | `npm run build --prefix ../gravelmon-dynamodb-graph/nodejs` |
| No tooltips | IDE recognizes types | Reload VS Code window |
| Wrong path resolving | tsconfig.json paths | Run `npm run setup-layer` |
| Type errors on import | Layer exports types | Verify `.d.ts` files exist in layer dist |
| Lambda fails | Layer ZIP structure | Check: `unzip -l layer.zip \| grep dynamodb-graph` |

## Performance Notes

- **Development:** Imports resolve via TypeScript compiler (no runtime overhead)
- **Production:** Imports resolve via Node.js module system to `/opt/nodejs/`
- **Cold starts:** Layer adds minimal overhead (already mounted by AWS)
- **Size:** Minimize layer size by excluding unnecessary files:
  - ❌ `node_modules` (already in layer)
  - ❌ `.d.ts` source maps (optional)
  - ✅ Only compiled `.js` files and required assets

## Next Steps

1. Run `npm run setup-layer` in aws-dynamodb-sam
2. Try importing from the layer in your handlers
3. Verify tooltips appear in VS Code
4. Test locally: `npm run start`
5. Deploy to Lambda following deployment steps above
