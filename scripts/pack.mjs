#!/usr/bin/env node
/**
 * Pack script for creating a minimal MCPB bundle.
 *
 * The esbuild-bundled server at packages/server/dist/index.js is self-contained,
 * so we only need to include that file plus the manifest and icons.
 */

import { mkdirSync, cpSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const packDir = join(root, '.pack');

// Clean and create pack directory
rmSync(packDir, { recursive: true, force: true });
mkdirSync(packDir, { recursive: true });

// Copy the bundled server (self-contained with all deps via esbuild)
mkdirSync(join(packDir, 'dist'), { recursive: true });
cpSync(join(root, 'packages/server/dist/index.js'), join(packDir, 'dist/index.js'));

// Create a manifest pointing to dist/index.js
const manifest = {
  manifest_version: '0.3',
  name: 'arc-mcp',
  display_name: 'Arc Browser Control',
  version: '2.0.0',
  description: 'Control Arc browser with Playwright-style semantic locators via Node.js REPL',
  icon: 'icon.png',
  author: {
    name: 'Andrew Gazelka'
  },
  homepage: 'https://github.com/andrewgazelka/arc-mcp',
  server: {
    type: 'node',
    entry_point: 'dist/index.js',
    mcp_config: {
      command: 'node',
      args: ['${__dirname}/dist/index.js']
    }
  }
};
writeFileSync(join(packDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

// Copy icons
cpSync(join(root, 'icon.png'), join(packDir, 'icon.png'));
cpSync(join(root, 'icon.svg'), join(packDir, 'icon.svg'));

// Copy README
cpSync(join(root, 'README.md'), join(packDir, 'README.md'));

// Pack with mcpb
console.log('Packing MCPB bundle...');
execSync('npx @anthropic-ai/mcpb pack . ../arc-mcp.mcpb', {
  cwd: packDir,
  stdio: 'inherit'
});

// Clean up pack directory
rmSync(packDir, { recursive: true, force: true });

console.log('\nCreated arc-mcp.mcpb');
