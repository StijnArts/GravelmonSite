#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const outputDir = path.join(__dirname, '../dist');
const zipPath = path.join(outputDir, 'lambda-layer.zip');

// Ensure dist directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create output stream
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Maximum compression
});

// Listen for finish event
output.on('close', () => {
  console.log(`✓ Lambda layer created: ${zipPath}`);
  console.log(`  Size: ${(archive.pointer() / 1024).toFixed(2)} KB`);
});

// Listen for errors
output.on('error', (err) => {
  console.error('Error creating zip:', err);
  process.exit(1);
});

archive.on('error', (err) => {
  console.error('Archive error:', err);
  process.exit(1);
});

// Pipe archive to output
archive.pipe(output);

// Add files to zip
console.log('Building Lambda layer zip...');

// Add compiled dist/ files to nodejs/ for Lambda layer structure
if (fs.existsSync(path.join(__dirname, '../dist'))) {
  archive.glob('**', {
    cwd: path.join(__dirname, '../dist'),
    ignore: ['lambda-layer.zip', '**/__tests__/**', '**/__tests__'],
  }, {
    prefix: 'nodejs',
  });
  console.log('  ✓ Added compiled dist/ files to nodejs/ (excluding __tests__)');
} else {
  console.warn('  ⚠ dist/ directory not found. Run npm run build first.');
}

// Add package.json
const packageJsonPath = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJsonPath)) {
  archive.file(packageJsonPath, { name: 'package.json' });
  console.log('  ✓ Added package.json');
}

// Add tsconfig.json
const tsconfigPath = path.join(__dirname, '../tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  archive.file(tsconfigPath, { name: 'tsconfig.json' });
  console.log('  ✓ Added tsconfig.json');
}

// Add README if it exists
const readmePath = path.join(__dirname, '../README.md');
if (fs.existsSync(readmePath)) {
  archive.file(readmePath, { name: 'README.md' });
  console.log('  ✓ Added README.md');
}

// Add LICENSE if it exists
const licensePath = path.join(__dirname, '../LICENSE');
if (fs.existsSync(licensePath)) {
  archive.file(licensePath, { name: 'LICENSE' });
  console.log('  ✓ Added LICENSE');
}

// Finalize archive
archive.finalize();
