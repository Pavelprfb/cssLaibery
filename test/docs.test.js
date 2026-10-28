'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Laibery = require('../laibery.js');

const root = path.join(__dirname, '..');
const docsDir = path.join(root, 'docs');
const html = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf8');
const aliases = fs.readFileSync(path.join(docsDir, 'aliases.md'), 'utf8');
const classes = JSON.parse(fs.readFileSync(path.join(docsDir, 'classes.json'), 'utf8'));
const llms = fs.readFileSync(path.join(docsDir, 'llms.txt'), 'utf8');
const llmsFull = fs.readFileSync(path.join(docsDir, 'llms-full.txt'), 'utf8');

let passed = 0;

// --- structured data covers the whole map ---
assert.equal(classes.name, 'Laibery');
assert.equal(classes.version, Laibery.version);
assert.equal(classes.license, 'MIT');
assert.equal(classes.properties.length, 520, 'classes.json has all 520 properties');
assert.ok(classes.curated.length >= 40, 'classes.json includes curated aliases');
assert.equal(classes.extras.length, 2, 'classes.json includes svg-d and svg-r');
passed += 6;

const anchors = new Set();
for (const item of classes.properties) {
  assert.ok(item.alias, 'property alias exists');
  assert.ok(item.property, 'property name exists: ' + item.alias);
  assert.ok(item.example.includes('$'), 'example contains $: ' + item.alias);
  assert.ok(!item.example.includes('$VALUE'), 'example is concrete: ' + item.alias);
  assert.equal(typeof item.category, 'string');
  assert.ok(!anchors.has(item.anchor), 'unique property anchor: ' + item.anchor);
  anchors.add(item.anchor);
  assert.ok(
    Laibery.preview(item.example) !== null,
    'example parses: ' + item.alias + ' -> ' + item.example
  );
}
passed += 1;

for (const item of classes.extras.concat(classes.curated.map(item => ({
  alias: item.aliases[0],
  example: item.example
})))) {
  assert.ok(Laibery.preview(item.example) !== null, 'example parses: ' + item.alias + ' -> ' + item.example);
}
passed += 1;

// --- HTML documentation lists every property with a shareable anchor ---
assert.ok(html.includes('<!doctype html>'), 'docs/index.html is a full page');
assert.equal((html.match(/<tr id="property-/g) || []).length, 520, 'HTML has 520 property rows');
assert.ok(html.includes('id="property-search"'), 'HTML has a property search box');
assert.ok(html.includes('id="property-category"'), 'HTML has a category filter');
assert.ok(html.includes('id="property-count"'), 'HTML has a result count');
assert.ok(html.includes('id="curated-search"'), 'HTML has a curated alias search box');
assert.ok(html.includes('id="curated-count"'), 'HTML has a curated result count');
assert.ok(html.includes('data-example='), 'HTML has copyable examples');
assert.ok(html.includes('id="properties"'), 'HTML has the properties section');
assert.ok(html.includes('id="ai"'), 'HTML has the AI section');
assert.ok(html.includes('href="classes.json"'), 'HTML links classes.json');
assert.ok(html.includes('href="llms.txt"'), 'HTML links llms.txt');
assert.ok(html.includes('href="llms-full.txt"'), 'HTML links llms-full.txt');
assert.ok(html.includes('href="aliases.md"'), 'HTML links aliases.md');
assert.ok(html.includes('href="../laibery.js"') || html.includes('src="../laibery.js"'), 'HTML loads the library');
passed += 13;

for (const item of classes.properties) {
  assert.ok(html.includes('id="' + item.anchor + '"'), 'HTML anchor exists: ' + item.anchor);
}
for (const item of classes.curated) {
  assert.ok(html.includes('id="' + item.anchor + '"'), 'HTML curated anchor exists: ' + item.anchor);
}
passed += 1;

// --- Markdown and AI files are complete ---
assert.ok(aliases.includes('## All 520 properties'), 'aliases.md has the full table heading');
const aliasRows = aliases.slice(aliases.indexOf('## All 520 properties')).split(/\r?\n/).filter(line => line.startsWith('| `'));
assert.equal(aliasRows.length, 520, 'aliases.md lists all 520 properties');
assert.ok(aliases.includes('Canonical documentation: [docs/](index.html)'), 'aliases.md links the docs route');
passed += 3;

assert.ok(llms.includes('# Laibery'), 'llms.txt has a title');
assert.ok(llms.includes('Version: ' + Laibery.version), 'llms.txt has the version');
assert.ok(llms.includes('docs/index.html'), 'llms.txt links the HTML docs');
assert.ok(llms.includes('docs/llms-full.txt'), 'llms.txt links the full AI docs');
assert.ok(llms.includes('docs/classes.json'), 'llms.txt links structured data');
passed += 5;

assert.ok(llmsFull.includes('# Laibery — full documentation for humans and AI'), 'llms-full.txt has a title');
assert.ok(llmsFull.includes('## All 520 properties'), 'llms-full.txt includes the full table');
assert.equal(
  llmsFull.slice(llmsFull.indexOf('## All 520 properties')).split(/\r?\n/).filter(line => line.startsWith('| `')).length,
  520,
  'llms-full.txt lists all 520 properties'
);
passed += 3;

// --- links in the docs point at real local files ---
for (const file of ['index.html', 'aliases.md', 'classes.json', 'llms.txt', 'llms-full.txt', 'css-property-alias-map.txt']) {
  assert.ok(fs.existsSync(path.join(docsDir, file)), 'docs file exists: ' + file);
}
passed += 1;

console.log('Docs OK — ' + passed + ' assertions passed');
