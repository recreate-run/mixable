#!/usr/bin/env node
/**
 * Generate index.html for static deployment
 * This script creates an entry HTML file for Netlify deployment
 * by finding the hashed asset filenames and inserting them into the template
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distClient = join(__dirname, '..', 'dist', 'client');
const assetsDir = join(distClient, 'assets');

// Check if dist/client exists
if (!existsSync(distClient)) {
  console.error('❌ Error: dist/client directory not found. Run `bun run build` first.');
  process.exit(1);
}

// Check if assets directory exists
if (!existsSync(assetsDir)) {
  console.error('❌ Error: dist/client/assets directory not found.');
  process.exit(1);
}

// Read all assets
const assets = readdirSync(assetsDir);

// Find the main JS and CSS files
const mainJs = assets.find(f => f.startsWith('main-') && f.endsWith('.js'));
const stylesCs = assets.find(f => f.startsWith('styles-') && f.endsWith('.css'));

if (!mainJs) {
  console.error('❌ Error: Could not find main JavaScript file (main-*.js) in assets/');
  console.error('Available files:', assets);
  process.exit(1);
}

if (!stylesCs) {
  console.warn('⚠️  Warning: Could not find styles CSS file (styles-*.css) in assets/');
}

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Mixable - Build production-ready software with multimodal AI">
    <meta name="theme-color" content="#000000">
    <title>Mixable - AI-Powered Development</title>

    <!-- Favicon and Icons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/logo192.png">
    <link rel="manifest" href="/manifest.json">

    <!-- Preload critical assets -->
    <link rel="modulepreload" href="/assets/${mainJs}">
    ${stylesCs ? `<link rel="stylesheet" href="/assets/${stylesCs}">` : ''}
</head>
<body>
    <div id="root"></div>
    <noscript>
        <div style="padding: 2rem; text-align: center; font-family: system-ui, -apple-system, sans-serif;">
            <h1>JavaScript Required</h1>
            <p>This application requires JavaScript to be enabled. Please enable JavaScript in your browser settings.</p>
        </div>
    </noscript>
    <script type="module" src="/assets/${mainJs}"></script>
</body>
</html>`;

// Write index.html
const indexPath = join(distClient, 'index.html');
writeFileSync(indexPath, html);

console.log('✓ Generated index.html successfully');
console.log(`  Main JS: /assets/${mainJs}`);
if (stylesCs) {
  console.log(`  Styles:  /assets/${stylesCs}`);
}
console.log(`  Output:  ${indexPath}`);
