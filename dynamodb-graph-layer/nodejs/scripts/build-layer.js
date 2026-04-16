const fs = require("fs");
const path = require("path");

const srcDir = path.resolve(__dirname, "..", "src", "dynamodb-graph");
const targetDir = path.resolve(__dirname, "..", "node_modules", "dynamodb-graph");

function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

removeDirectory(targetDir);
copyRecursive(srcDir, targetDir);
console.log(`Copied layer package from ${srcDir} to ${targetDir}`);
