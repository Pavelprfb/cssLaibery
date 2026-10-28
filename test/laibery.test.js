'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Laibery = require('../laibery.js');

let passed = 0;

function eq(cls, expected) {
  assert.equal(Laibery.preview(cls), expected, 'preview(' + cls + ')');
  passed++;
}

// --- override behavior is on by default ---
assert.equal(Laibery.config().important, true);
assert.equal(
  Laibery.preview('b$2$s$red'),
  '[class~="b$2$s$red"]{border-width:2px!important;border-style:solid!important;border-color:red!important}'
);
passed += 2;

// Keep the existing expectations readable; the important-specific tests
// are at the end.
Laibery.config({ important: false });

// --- user's example ---
eq(
  'b$2$s$red',
  '[class~="b$2$s$red"]{border-width:2px;border-style:solid;border-color:red}'
);
eq(
  'b$1$s$border',
  '[class~="b$1$s$border"]{border-width:1px;border-style:solid;border-color:var(--lb-border)}'
);
eq('b$thin$d$primary', '[class~="b$thin$d$primary"]{border-width:thin;border-style:dashed;border-color:var(--lb-primary)}');
eq('b$red$2$s', '[class~="b$red$2$s"]{border-width:2px;border-style:solid;border-color:red}');
eq('b$2$0$red', null); // duplicate width
eq('b$red', '[class~="b$red"]{border-color:red}');

// --- spacing + sizing ---
eq('p$16', '[class~="p$16"]{padding:16px}');
eq('p$8$16', '[class~="p$8$16"]{padding:8px 16px}');
eq('px$24', '[class~="px$24"]{padding-left:24px;padding-right:24px}');
eq('py$6', '[class~="py$6"]{padding-top:6px;padding-bottom:6px}');
eq('m$-8', '[class~="m$-8"]{margin:-8px}');
eq('mx$auto', '[class~="mx$auto"]{margin-left:auto;margin-right:auto}');
eq('mt$32', '[class~="mt$32"]{margin-top:32px}');
eq('p$auto', null);
eq('w$50pct', '[class~="w$50pct"]{width:50%}');
eq('w$50%', '[class~="w$50%"]{width:50%}');
eq('w$full', '[class~="w$full"]{width:100%}');
eq('h$screen', '[class~="h$screen"]{height:100vh}');
eq('maxw$960', '[class~="maxw$960"]{max-width:960px}');
eq('w$calc(100%/3)', '[class~="w$calc(100%/3)"]{width:calc(100%/3)}');

// --- layout ---
eq('d$f', '[class~="d$f"]{display:flex}');
eq('d$if', '[class~="d$if"]{display:inline-flex}');
eq('pos$fixed', '[class~="pos$fixed"]{position:fixed}');
eq('top$0', '[class~="top$0"]{top:0}');
eq('z$-1', '[class~="z$-1"]{z-index:-1}');
eq('ov$h', '[class~="ov$h"]{overflow:hidden}');
eq('ar$16$9', '[class~="ar$16$9"]{aspect-ratio:16 / 9}');
eq('ar$16/9', '[class~="ar$16/9"]{aspect-ratio:16/9}');
eq('cols$3', '[class~="cols$3"]{grid-template-columns:repeat(3,minmax(0,1fr))}');
eq('cols$1$2', '[class~="cols$1$2"]{grid-template-columns:1fr 2fr}');
eq('cols$200px$1fr', '[class~="cols$200px$1fr"]{grid-template-columns:200px 1fr}');
eq('gap$8$16', '[class~="gap$8$16"]{gap:8px 16px}');
eq('justify$sb', '[class~="justify$sb"]{justify-content:space-between}');
eq('items$c', '[class~="items$c"]{align-items:center}');
eq('fd$col', '[class~="fd$col"]{flex-direction:column}');
eq('wrap$wrap', '[class~="wrap$wrap"]{flex-wrap:wrap}');
eq('wrap$nowrap', '[class~="wrap$nowrap"]{flex-wrap:nowrap}');

// --- typography ---
eq('fz$16', '[class~="fz$16"]{font-size:16px}');
eq('fw$bold', '[class~="fw$bold"]{font-weight:700}');
eq('fw$b', '[class~="fw$b"]{font-weight:700}');
eq('ff$mono', '[class~="ff$mono"]{font-family:var(--lb-font-mono)}');
eq('lh$1.5', '[class~="lh$1.5"]{line-height:1.5}');
eq('lh$24', '[class~="lh$24"]{line-height:24px}');
eq('ta$c', '[class~="ta$c"]{text-align:center}');
eq('td$n', '[class~="td$n"]{text-decoration:none}');
eq('tt$u', '[class~="tt$u"]{text-transform:uppercase}');
eq('ws$nw', '[class~="ws$nw"]{white-space:nowrap}');
eq('c$primary', '[class~="c$primary"]{color:var(--lb-primary)}');
eq('c$ff0000', '[class~="c$ff0000"]{color:#ff0000}');
eq('c$ff000080', '[class~="c$ff000080"]{color:#ff000080}');
eq('bg$surface', '[class~="bg$surface"]{background-color:var(--lb-surface)}');
eq('bg$transparent', '[class~="bg$transparent"]{background-color:transparent}');
eq('fw$nope', null);

// --- radius + effects ---
eq('r$12', '[class~="r$12"]{border-radius:12px}');
eq('r$full', '[class~="r$full"]{border-radius:9999px}');
eq('r$8$8$0$0', '[class~="r$8$8$0$0"]{border-radius:8px 8px 0 0}');
eq('r-tl$8', '[class~="r-tl$8"]{border-top-left-radius:8px}');
eq('op$50', '[class~="op$50"]{opacity:0.5}');
eq('op$0.35', '[class~="op$0.35"]{opacity:0.35}');
eq('sh$md', '[class~="sh$md"]{box-shadow:var(--lb-shadow-md)}');
eq('tr$200', '[class~="tr$200"]{transition:all 200ms ease}');
eq('tr$300$inout', '[class~="tr$300$inout"]{transition:all 300ms ease-in-out}');
eq('cur$p', '[class~="cur$p"]{cursor:pointer}');
eq('pe$none', '[class~="pe$none"]{pointer-events:none}');
eq('sel$none', '[class~="sel$none"]{user-select:none}');

// --- full property names and map aliases ---
eq('a-i$c', '[class~="a-i$c"]{align-items:center}');
eq('a-i$center', '[class~="a-i$center"]{align-items:center}');
eq('j-c$sb', '[class~="j-c$sb"]{justify-content:space-between}');
eq('f-d$col', '[class~="f-d$col"]{flex-direction:column}');
eq('u-s$none', '[class~="u-s$none"]{user-select:none}');
eq('z-i$5', '[class~="z-i$5"]{z-index:5}');
eq('r-g$12', '[class~="r-g$12"]{row-gap:12px}');
eq('c-g$8', '[class~="c-g$8"]{column-gap:8px}');
eq('p-e$none', '[class~="p-e$none"]{pointer-events:none}');
eq('l$10', '[class~="l$10"]{left:10px}');
eq('v$hidden', '[class~="v$hidden"]{visibility:hidden}');
eq('q$none', '[class~="q$none"]{quotes:none}');
eq('background-color$red', '[class~="background-color$red"]{background-color:red}');
eq('background-color$primary', '[class~="background-color$primary"]{background-color:var(--lb-primary)}');
eq('border-width$1px', '[class~="border-width$1px"]{border-width:1px}');
eq('b-t$1$s$primary', '[class~="b-t$1$s$primary"]{border-top-width:1px;border-top-style:solid;border-top-color:var(--lb-primary)}');
eq('border$1px$solid$blue', '[class~="border$1px$solid$blue"]{border-width:1px;border-style:solid;border-color:blue}');
eq('outline$2$solid$primary', '[class~="outline$2$solid$primary"]{outline-width:2px;outline-style:solid;outline-color:var(--lb-primary)}');
eq('column-rule$1$solid$red', '[class~="column-rule$1$solid$red"]{column-rule-width:1px;column-rule-style:solid;column-rule-color:red}');
eq('margin-left$20', '[class~="margin-left$20"]{margin-left:20px}');
eq('padding$8$16', '[class~="padding$8$16"]{padding:8px 16px}');
eq('width$50pct', '[class~="width$50pct"]{width:50%}');
eq('z-index$10', '[class~="z-index$10"]{z-index:10}');
eq('order$2', '[class~="order$2"]{order:2}');
eq('columns$2', '[class~="columns$2"]{columns:2}');
eq('opacity$0.5', '[class~="opacity$0.5"]{opacity:0.5}');
eq('opacity$50', '[class~="opacity$50"]{opacity:0.5}');
eq('font-size$18', '[class~="font-size$18"]{font-size:18px}');
eq('line-height$1.5', '[class~="line-height$1.5"]{line-height:1.5}');
eq('line-height$24', '[class~="line-height$24"]{line-height:24px}');
eq('color$black', '[class~="color$black"]{color:black}');
eq('color$primary', '[class~="color$primary"]{color:var(--lb-primary)}');
eq('display$flex', '[class~="display$flex"]{display:flex}');
eq('position$absolute', '[class~="position$absolute"]{position:absolute}');
eq('grid-template-columns$3', '[class~="grid-template-columns$3"]{grid-template-columns:repeat(3,minmax(0,1fr))}');
eq('grid-template-columns$200px$1fr', '[class~="grid-template-columns$200px$1fr"]{grid-template-columns:200px 1fr}');
eq('font-weight$b', '[class~="font-weight$b"]{font-weight:700}');
eq('aspect-ratio$16$9', '[class~="aspect-ratio$16$9"]{aspect-ratio:16 / 9}');
eq('border-radius$full', '[class~="border-radius$full"]{border-radius:9999px}');
eq('background$primary', '[class~="background$primary"]{background:var(--lb-primary)}');
eq('box-shadow$0$0$10px$primary', '[class~="box-shadow$0$0$10px$primary"]{box-shadow:0 0 10px var(--lb-primary)}');

// --- values may contain a colon after the first "$" ---
eq(
  'background-image$url(https://example.com/a.png)',
  '[class~="background-image$url(https://example.com/a.png)"]{background-image:url(https://example.com/a.png)}'
);
eq(
  'hover:background-image$url(https://example.com/a.png)',
  '[class~="hover:background-image$url(https://example.com/a.png)"]:hover{background-image:url(https://example.com/a.png)}'
);
eq(
  "content$'hello'",
  "[class~=\"content$'hello'\"]{content:'hello'}"
);

// --- deliberate conflicts with the map ---
eq('d$grid', '[class~="d$grid"]{display:grid}');
eq('r$12', '[class~="r$12"]{border-radius:12px}');
eq('z$10', '[class~="z$10"]{z-index:10}');
eq('zoom$1.5', '[class~="zoom$1.5"]{zoom:1.5}');
eq('svg-d$M0,0L10,10', '[class~="svg-d$M0,0L10,10"]{d:M0,0L10,10}');
eq('svg-r$10', '[class~="svg-r$10"]{r:10px}');

// --- invalid values in the new builders ---
eq('padding$auto', null);
eq('font-size$auto', null);
eq('gap$auto', null);
eq('border-radius$auto', null);
eq('background-image$url(https://example.com/a.png);color:red', null);

// --- documented coverage for all 520 map properties ---
const aliasesDoc = fs.readFileSync(path.join(__dirname, '..', 'docs', 'aliases.md'), 'utf8');
const tableStart = aliasesDoc.indexOf('## All 520 properties');
const aliasRows = aliasesDoc.slice(tableStart).split(/\r?\n/).filter(line => line.startsWith('| `'));
assert.equal(aliasRows.length, 520, 'docs/aliases.md lists all 520 properties');
let documentedExamples = 0;
for (const row of aliasRows) {
  const cells = row.split('|').map(cell => cell.trim());
  const example = cells[3].replace(/`/g, '');
  if (example.includes('$VALUE')) continue;
  assert.ok(Laibery.preview(example), 'documented example parses: ' + example);
  documentedExamples++;
}
assert.equal(documentedExamples, 520, 'every documented property has a concrete, parseable example');
passed += 3;

// --- variants ---
eq(
  'hover:bg$primary',
  '[class~="hover:bg$primary"]:hover{background-color:var(--lb-primary)}'
);
eq(
  'md:cols$3',
  '@media (min-width:768px){[class~="md:cols$3"]{grid-template-columns:repeat(3,minmax(0,1fr))}}'
);
eq(
  '2xl:p$48',
  '@media (min-width:1536px){[class~="2xl:p$48"]{padding:48px}}'
);
eq(
  'md:hover:b$2$s$primary',
  '@media (min-width:768px){[class~="md:hover:b$2$s$primary"]:hover{border-width:2px;border-style:solid;border-color:var(--lb-primary)}}'
);
eq(
  'dark:bg$dark',
  '.dark [class~="dark:bg$dark"]{background-color:var(--lb-dark)}'
);

// --- invalid tokens ---
eq('foo$bar', null);
eq('p$16$32$4$8$2', null);
eq('b$2$s$red$blue', null);
eq('', null);
eq('hello', null);

// --- engine API (no DOM) ---
Laibery.add('p$16');
Laibery.add('b$2$s$red hover:bg$primary');
const sheet = Laibery.css();
assert.match(sheet, /--lb-primary:#3b82f6/);
assert.ok(sheet.includes('[class~="p$16"]{padding:16px}'));
assert.ok(sheet.includes('[class~="b$2$s$red"]'));
assert.ok(sheet.includes('[class~="hover:bg$primary"]:hover'));
passed += 4;

Laibery.theme({ primary: '#7c3aed' });
assert.ok(Laibery.css().includes('--lb-primary:#7c3aed'));
assert.ok(Laibery.css().includes('var(--lb-primary)'));
passed += 2;

Laibery.theme({ Brand: '#123456' });
assert.ok(Laibery.css().includes('--lb-brand:#123456'));
eq('bg$Brand', '[class~="bg$Brand"]{background-color:var(--lb-brand)}');

Laibery.define('demo', 200, function (values) {
  return [['--demo-var', values[0]]];
});
eq('demo$42', '[class~="demo$42"]{--demo-var:42}');

// define() retries a token that previously failed to parse, even when
// the value contains a colon.
Laibery.add('zbg$url(https://example.com/x.png)');
Laibery.define('zbg', 200, function (values) {
  return [['background-image', values[0]]];
});
eq(
  'zbg$url(https://example.com/x.png)',
  '[class~="zbg$url(https://example.com/x.png)"]{background-image:url(https://example.com/x.png)}'
);

// --- deterministic ordering ---
Laibery.add('p$16 px$24 pt$8 b$2$s$red bt$1$s$border md:cols$3 sm:cols$2');
const ordered = Laibery.css();
assert.ok(ordered.indexOf('[class~="p$16"]') < ordered.indexOf('[class~="px$24"]'));
assert.ok(ordered.indexOf('[class~="px$24"]') < ordered.indexOf('[class~="pt$8"]'));
assert.ok(ordered.indexOf('[class~="b$2$s$red"]') < ordered.indexOf('[class~="bt$1$s$border"]'));
assert.ok(ordered.indexOf('@media (min-width:640px)') < ordered.indexOf('@media (min-width:768px)'));
passed += 4;

// Shorthand before longhand for map-derived properties too.
Laibery.add('padding$8 padding-left$4 border$1$s$red border-top$2$s$blue background$red background-color$blue');
const genericOrdered = Laibery.css();
assert.ok(genericOrdered.indexOf('[class~="padding$8"]') < genericOrdered.indexOf('[class~="padding-left$4"]'));
assert.ok(genericOrdered.indexOf('[class~="border$1$s$red"]') < genericOrdered.indexOf('[class~="border-top$2$s$blue"]'));
assert.ok(genericOrdered.indexOf('[class~="background$red"]') < genericOrdered.indexOf('[class~="background-color$blue"]'));
passed += 3;

// --- important / override configuration ---
assert.equal(Laibery.config().important, false);
Laibery.config({ important: true });
assert.equal(Laibery.config().important, true);
eq('p$16', '[class~="p$16"]{padding:16px!important}');
eq(
  'hover:background-color$primary',
  '[class~="hover:background-color$primary"]:hover{background-color:var(--lb-primary)!important}'
);
assert.ok(Laibery.css().includes('[class~="p$16"]{padding:16px!important}'));
passed += 1;

Laibery.config({ important: false });
eq('p$16', '[class~="p$16"]{padding:16px}');
assert.ok(!Laibery.css().includes('padding:16px!important'));
passed += 1;

Laibery.config({ nonce: 'test-nonce' });
assert.equal(Laibery.config().nonce, 'test-nonce');
passed += 1;
Laibery.config({ nonce: '' });

// --- stylesheet creation and placement (minimal fake DOM) ---
// Regression: a newly created <style> must be attached before keepLast()
// runs, otherwise start() silently produces no stylesheet at all.
function fakeNode(tag) {
  return {
    nodeType: 1,
    tagName: tag.toUpperCase(),
    id: '',
    nonce: '',
    textContent: '',
    classList: [],
    parentNode: null,
    children: [],
    get isConnected() {
      let node = this;
      while (node.parentNode) node = node.parentNode;
      return node === document.documentElement;
    },
    get lastElementChild() {
      return this.children.length ? this.children[this.children.length - 1] : null;
    },
    appendChild(child) {
      if (child.parentNode) child.remove();
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    remove() {
      if (!this.parentNode) return;
      const i = this.parentNode.children.indexOf(this);
      if (i !== -1) this.parentNode.children.splice(i, 1);
      this.parentNode = null;
    },
    setAttribute(name, value) {
      this[name] = value;
    },
    querySelectorAll() {
      return [];
    }
  };
}

function findById(node, id) {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findById(child, id);
    if (found) return found;
  }
  return null;
}

const html = fakeNode('html');
const head = fakeNode('head');
const body = fakeNode('body');
html.appendChild(head);
html.appendChild(body);

globalThis.document = {
  documentElement: html,
  head,
  body,
  readyState: 'complete',
  createElement: fakeNode,
  getElementById: id => findById(html, id),
  addEventListener() {}
};
globalThis.MutationObserver = function () {
  this.observe = function () {};
  this.disconnect = function () {};
};

Laibery.start();
const generated = document.getElementById('laibery-styles');
assert.ok(generated, 'start() creates #laibery-styles');
assert.equal(generated.parentNode, body);
assert.equal(body.lastElementChild, generated);
assert.ok(generated.textContent.includes('--lb-primary'));
assert.ok(generated.textContent.includes('box-sizing:border-box'));
passed += 3;

const siteStyle = fakeNode('style');
body.appendChild(siteStyle);
assert.notEqual(body.lastElementChild, generated);
Laibery.start();
assert.equal(body.lastElementChild, generated, 'start() keeps the sheet last');
passed += 1;

Laibery.stop();
delete globalThis.document;
delete globalThis.MutationObserver;

console.log('OK — ' + passed + ' assertions passed');
