#!/usr/bin/env node

/**
 * Setup script to create a local Lambda layer structure for development.
 * This creates a directory structure that mirrors the /opt/nodejs/ 
 * structure used by AWS Lambda, allowing proper imports and IDE tooltips.
 */

const fs = require("fs");
const path = require("path");

const layerSourceDir = path.resolve(__dirname, "..", "gravelmon-dynamodb-graph", "nodejs", "dist", "dynamodb-graph");
const layerDirDev = path.resolve(__dirname, "layer", "nodejs", "node_modules", "dynamodb-graph");

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory does not exist: ${src}`);
    console.log(`Please run: npm run build --prefix ../gravelmon-dynamodb-graph/nodejs`);
    return false;
  }

  ensureDirectory(path.dirname(dest));
  
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDirectory(dest);
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
  return true;
}

try {
  ensureDirectory(layerDirDev);
  
  // Remove old layer
  const parentDir = path.dirname(layerDirDev);
  if (fs.existsSync(parentDir)) {
    fs.rmSync(path.resolve(parentDir, "dynamodb-graph"), { recursive: true, force: true });
  }

  // Copy built layer
  if (copyRecursive(layerSourceDir, layerDirDev)) {
    console.log(`✓ Layer setup complete at: layer/nodejs/node_modules/dynamodb-graph`);
    console.log(`✓ You can now import with: import { yourExport } from "dynamodb-graph"`);
  }
} catch (error) {
  console.error("Error setting up layer:", error.message);
  process.exit(1);
}
