# Lambda Layer Import Setup Guide

This setup allows you to import functions and types from your Lambda Layer with full IDE tooltips and TypeScript support.

## How It Works

The solution uses **TypeScript path aliases** combined with a **local layer mirroring structure** to achieve:
- ✅ IDE autocomplete and tooltips during development
- ✅ Type checking and IntelliSense support
- ✅ Compatibility with AWS Lambda deployment
- ✅ Clean, standard Node.js import syntax

## Development Setup

### 1. Initial Setup

```bash
# In aws-dynamodb-sam directory
npm install
npm run setup-layer
npm run build
```

The `setup-layer` script creates a local directory structure that mirrors `/opt/nodejs/` (the Lambda layer mount path).

### 2. Importing from Your Layer

In your handler files, use standard ES module imports:

```typescript
// Import specific exports
import { helloWorld } from "dynamodb-graph/models/nodes/test.js";

// Import all exports
import * as GraphModels from "dynamodb-graph/models";

// Import types
import type { SomeType } from "dynamodb-graph/types/index.js";
```

**Key Points:**
- No absolute paths like `/opt/nodejs/` in your code
- No path aliases needed in handler code
- Imports work identically in dev and production
- TypeScript resolves these to the layer's `dist/` directory

### 3. How It Works Locally

The setup creates this structure:
```
aws-dynamodb-sam/
├── src/
│   └── handler.ts (imports from "dynamodb-graph/...")
├── dist/ (compiled output)
├── layer/
│   └── nodejs/
│       └── node_modules/
│           └── dynamodb-graph/ (symlinked or copied from layer source)
└── tsconfig.json (with baseUrl and paths configuration)
```

TypeScript's `paths` configuration allows resolution:
- **Import:** `import { x } from "dynamodb-graph/models"`
- **Resolves to:** `../gravelmon-dynamodb-graph/nodejs/dist/dynamodb-graph/models`

## AWS Lambda Deployment

### For SAM/CloudFormation Deployment:

1. **Build the layer in its own project:**
   ```bash
   cd ../gravelmon-dynamodb-graph/nodejs
   npm run build
   ```

2. **Deploy the layer:**
   ```bash
   aws lambda publish-layer-version \
     --layer-name gravelmon-dynamodb-graph \
     --zip-file fileb://layer.zip \
     --compatible-runtimes nodejs20.x
   ```

3. **Reference in SAM template.yaml:**
   ```yaml
   Globals:
     Function:
       Layers:
         - !Sub "arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:layer:gravelmon-dynamodb-graph:1"
   ```

4. **Build and deploy SAM:**
   ```bash
   npm run build
   sam build
   sam deploy
   ```

### Lambda Execution Flow

When Lambda executes:
1. Your handler code is deployed to `/var/task/`
2. The layer is mounted at `/opt/nodejs/`
3. Node.js resolves `dynamodb-graph/...` imports to `/opt/nodejs/node_modules/dynamodb-graph/`

## Ensuring Layer Compatibility

### Critical: Layer Structure in `/opt/nodejs/`

The layer MUST have this structure in the ZIP file:
```
nodejs/
└── node_modules/
    └── dynamodb-graph/
        ├── index.js
        ├── index.d.ts
        ├── package.json
        └── [other exports]
```

The `gravelmon-dynamodb-graph/nodejs/scripts/build-layer.js` already handles this by:
1. Compiling TypeScript to `dist/dynamodb-graph/`
2. Copying to `node_modules/dynamodb-graph/`
3. Creating the layer ZIP with correct structure

### Verify Layer Exports

Ensure your layer's main export file includes all needed exports:

```typescript
// src/dynamodb-graph/index.ts
export * from "./models";
export * from "./types";
export * from "./utils";
```

## Quick Commands

```bash
# Setup local development layer
npm run setup-layer

# Build everything (handlers + validates layer setup)
npm run build

# Start local SAM API with layer
npm run start

# Rebuild after layer changes
npm run setup-layer && npm run build
```

## Troubleshooting

### "Cannot find module 'dynamodb-graph'"
- Run: `npm run setup-layer`
- Rebuild the layer: `npm run build --prefix ../gravelmon-dynamodb-graph/nodejs`

### IDE doesn't show tooltips
- Verify `tsconfig.json` has correct `paths` configuration
- Reload VS Code with Ctrl+Shift+P → "Reload Window"
- Ensure TypeScript is using the workspace version (not system version)

### Lambda execution fails with module not found
- Verify layer ZIP structure: `unzip -l layer.zip | grep nodejs/node_modules`
- Ensure the layer includes the compiled `.js` files, not just TypeScript sources
- Check that layer version is correctly referenced in template.yaml

### After updating the layer
1. Rebuild the layer: `npm run build --prefix ../gravelmon-dynamodb-graph/nodejs`
2. Regenerate local structure: `npm run setup-layer`
3. Rebuild handlers: `npm run build`

## TypeScript Configuration Details

The `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "dynamodb-graph/*": ["../gravelmon-dynamodb-graph/nodejs/dist/dynamodb-graph/*"],
      "dynamodb-graph": ["../gravelmon-dynamodb-graph/nodejs/dist/dynamodb-graph"]
    }
  }
}
```

This enables both:
- `import { x } from "dynamodb-graph"` (imports from index)
- `import { x } from "dynamodb-graph/models"` (imports from subpaths)

## Best Practices

1. **Always use relative imports for layer subpaths:**
   ```typescript
   // ✅ Good
   import { Model } from "dynamodb-graph/models/nodes/test.js";
   
   // ❌ Avoid
   import { Model } from "/opt/nodejs/dynamodb-graph/models/nodes/test.js";
   ```

2. **Keep layer imports at handler entry points:**
   ```typescript
   // handler.ts - main entry point
   import { utility } from "dynamodb-graph/utils";
   ```

3. **Ensure layer is always built before deploying:**
   ```bash
   npm run build --prefix ../gravelmon-dynamodb-graph/nodejs
   ```

4. **Export types for IDE support:**
   Make sure your layer exports TypeScript type definitions (`.d.ts` files)

## References

- [AWS Lambda Layers Documentation](https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [Node.js Module Resolution](https://nodejs.org/api/modules.html#modules_all_together)
