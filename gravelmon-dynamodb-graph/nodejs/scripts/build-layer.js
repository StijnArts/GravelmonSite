const fs = require("fs");
const path = require("path");

const srcDir = path.resolve(__dirname, "..", "dist", "dynamodb-graph");
const targetDir = path.resolve(__dirname, "..", "node_modules", "dynamodb-graph");

function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // Ensure the directory is recreated empty
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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
    // Ensure the destination file is removed before copying
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    fs.copyFileSync(src, dest);
  }
}

removeDirectory(targetDir);
copyRecursive(srcDir, targetDir);
console.log(`Copied layer package from ${srcDir} to ${targetDir}`);
