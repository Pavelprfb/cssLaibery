'use strict';

/*
 * Build the Laibery documentation site and AI-readable references.
 *
 * Input:
 *   docs/css-property-alias-map.txt   the 520-property source map
 *   README.md                         human guide
 *   package.json                      version
 *
 * Output:
 *   docs/index.html                   searchable documentation route
 *   docs/aliases.md                   Markdown property reference
 *   docs/classes.json                 structured data for tools and AI
 *   docs/llms.txt                     short LLM index
 *   docs/llms-full.txt                full Markdown documentation for LLMs
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, 'docs');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;

/* ============================================================
 * Source map
 * ============================================================ */

const mapText = fs.readFileSync(path.join(docsDir, 'css-property-alias-map.txt'), 'utf8');
const pairs = [];
for (const line of mapText.split(/\r?\n/)) {
  const match = line.match(/^(\S+)\$VALUE\s*=>\s*([a-z-]+):\s*VALUE;\s*$/);
  if (match) pairs.push({ alias: match[1], property: match[2] });
}
if (pairs.length !== 520) {
  throw new Error('Expected 520 properties in the alias map, found ' + pairs.length);
}

/* ============================================================
 * Examples
 * ============================================================ */

const borderShorthands = new Set([
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-block', 'border-inline', 'border-block-start', 'border-block-end',
  'border-inline-start', 'border-inline-end', 'outline', 'column-rule'
]);

const colorProps = /(^|-)color$/;

const lengthProps = new Set([
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'block-size', 'inline-size', 'min-block-size', 'max-block-size',
  'min-inline-size', 'max-inline-size',
  'top', 'right', 'bottom', 'left', 'inset', 'margin', 'padding',
  'gap', 'row-gap', 'column-gap', 'border-width', 'border-radius',
  'border-spacing', 'outline-width', 'outline-offset', 'font-size',
  'letter-spacing', 'word-spacing', 'line-height', 'column-width',
  'column-rule-width', 'text-indent', 'text-underline-offset',
  'text-decoration-thickness', 'shape-margin', 'perspective', 'flex-basis',
  'vertical-align', 'stroke-width', 'stroke-dashoffset', 'cx', 'cy', 'x', 'y', 'r',
  'background-position', 'background-position-x', 'background-position-y',
  'background-size', 'object-position', 'transform-origin',
  'perspective-origin', 'mask-position', 'mask-size', 'offset-anchor',
  'offset-distance', 'offset-position', 'translate'
]);

const enumProps = new Set([
  'display', 'position', 'overflow', 'overflow-x', 'overflow-y',
  'align-content', 'align-items', 'align-self', 'justify-content',
  'justify-items', 'justify-self', 'place-content', 'place-items',
  'place-self', 'flex-direction', 'flex-wrap', 'text-align',
  'text-decoration', 'text-decoration-line', 'text-transform',
  'white-space', 'font-style', 'cursor', 'pointer-events', 'user-select',
  'border-style'
]);

const sampleByProp = {
  display: 'flex',
  position: 'absolute',
  overflow: 'hidden',
  'overflow-x': 'hidden',
  'overflow-y': 'auto',
  visibility: 'hidden',
  float: 'left',
  clear: 'both',
  'box-sizing': 'border-box',
  direction: 'ltr',
  'flex-direction': 'column',
  'flex-wrap': 'wrap',
  'text-align': 'center',
  'text-decoration': 'underline',
  'text-decoration-line': 'underline',
  'text-transform': 'uppercase',
  'white-space': 'nowrap',
  'font-style': 'italic',
  cursor: 'pointer',
  'pointer-events': 'none',
  'user-select': 'none',
  'border-style': 'solid',
  'object-fit': 'cover',
  resize: 'both',
  'table-layout': 'fixed',
  'list-style-type': 'none',
  'vertical-align': 'middle',
  'text-overflow': 'ellipsis',
  'scroll-behavior': 'smooth',
  isolation: 'isolate',
  'mix-blend-mode': 'multiply',
  'background-repeat': 'no-repeat',
  'background-attachment': 'fixed',
  'background-clip': 'padding-box',
  'background-origin': 'content-box',
  'mask-clip': 'border-box',
  'mask-origin': 'content-box',
  'mask-mode': 'luminance',
  'mask-repeat': 'no-repeat',
  'border-collapse': 'collapse',

  'alignment-baseline': 'middle',
  all: 'unset',
  animation: 'fade$1s',
  'animation-composition': 'replace',
  'animation-delay': '100ms',
  'animation-direction': 'alternate',
  'animation-duration': '1s',
  'animation-fill-mode': 'both',
  'animation-iteration-count': 'infinite',
  'animation-name': 'fade',
  'animation-play-state': 'paused',
  'animation-timing-function': 'ease-in-out',
  appearance: 'none',
  'backdrop-filter': 'blur(8px)',
  'backface-visibility': 'hidden',
  background: 'primary',
  'background-blend-mode': 'multiply',
  'background-position-x': 'center',
  'background-position-y': 'center',
  'background-repeat-x': 'no-repeat',
  'background-repeat-y': 'no-repeat',
  'baseline-shift': 'sub',
  'border-block-end-style': 'solid',
  'border-block-start-style': 'solid',
  'border-block-style': 'solid',
  'border-bottom-style': 'solid',
  'border-image': 'none',
  'border-image-repeat': 'round',
  'border-image-slice': '30',
  'border-image-source': 'none',
  'border-inline-end-style': 'solid',
  'border-inline-start-style': 'solid',
  'border-inline-style': 'solid',
  'border-left-style': 'solid',
  'border-right-style': 'solid',
  'border-top-style': 'solid',
  'box-decoration-break': 'clone',
  'box-shadow': '0$0$10px$primary',
  'break-after': 'page',
  'break-before': 'page',
  'break-inside': 'avoid',
  'caption-side': 'bottom',
  'caret-color': 'primary',
  'caret-shape': 'bar',
  'clip-path': 'circle(50%)',
  'color-scheme': 'dark',
  'column-fill': 'balance',
  'column-rule-style': 'solid',
  'column-span': 'all',
  contain: 'layout',
  'contain-intrinsic-block-size': '100px',
  'contain-intrinsic-height': '100px',
  'contain-intrinsic-inline-size': '100px',
  'contain-intrinsic-size': '100px',
  'container-type': 'inline-size',
  'content-visibility': 'auto',
  'counter-increment': 'item',
  'counter-reset': 'item',
  'empty-cells': 'hide',
  'field-sizing': 'content',
  fill: 'primary',
  'fill-opacity': '0.5',
  'fill-rule': 'evenodd',
  filter: 'blur(4px)',
  flex: '1',
  'flex-flow': 'row$wrap',
  'flex-grow': '1',
  'flex-shrink': '0',
  'flood-color': 'primary',
  'flood-opacity': '0.5',
  font: '16px$sans-serif',
  'font-family': 'sans-serif',
  'font-kerning': 'normal',
  'font-stretch': 'condensed',
  'font-variant': 'small-caps',
  grid: 'none',
  'grid-area': '1/2/3/4',
  'grid-auto-flow': 'row',
  'grid-column': '1/3',
  'grid-row': '1/3',
  'grid-template-areas': 'none',
  hyphens: 'auto',
  'image-rendering': 'pixelated',
  'line-clamp': '2',
  'list-style': 'none',
  'list-style-position': 'inside',
  'mask-image': 'url(https://example.com/a.png)',
  'object-view-box': 'inset(10%)',
  'outline-style': 'solid',
  'overflow-wrap': 'break-word',
  'overscroll-behavior': 'contain',
  'print-color-adjust': 'exact',
  quotes: 'none',
  rotate: '45deg',
  scale: '1.05',
  'scroll-snap-align': 'center',
  'scroll-snap-type': 'x$mandatory',
  'scrollbar-gutter': 'stable',
  'shape-outside': 'circle(50%)',
  stroke: 'primary',
  'stroke-dasharray': '4',
  'stroke-dashoffset': '4',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'tab-size': '4',
  'text-align-last': 'center',
  'text-anchor': 'middle',
  'text-decoration-style': 'wavy',
  'text-orientation': 'mixed',
  'text-shadow': '0$0$4px$primary',
  'text-wrap': 'balance',
  'touch-action': 'none',
  transform: 'rotate(45deg)',
  'transform-box': 'fill-box',
  'transform-style': 'preserve-3d',
  transition: 'opacity$200ms',
  'transition-behavior': 'allow-discrete',
  'transition-delay': '100ms',
  'transition-duration': '200ms',
  'transition-property': 'opacity',
  'transition-timing-function': 'ease',
  'unicode-bidi': 'isolate',
  'will-change': 'transform',
  'word-break': 'break-all',
  'writing-mode': 'vertical-rl',
  widows: '2',
  orphans: '2',
  'z-index': '10',

  'anchor-name': '--my-anchor',
  'anchor-scope': 'all',
  'baseline-source': 'first',
  clip: 'rect(0,0,10px,10px)',
  'clip-rule': 'evenodd',
  'dominant-baseline': 'middle',
  'dynamic-range-limit': 'standard',
  'forced-color-adjust': 'none',
  'hanging-punctuation': 'first',
  'hyphenate-character': "'-'",
  'hyphenate-limit-chars': '5',
  'image-orientation': 'from-image',
  'image-resolution': '2dppx',
  'initial-letter': '3',
  interactivity: 'inert',
  'interest-delay': '200ms',
  'interest-delay-end': '200ms',
  'interest-delay-start': '200ms',
  'interpolate-size': 'allow-keywords',
  'line-break': 'strict',
  'math-depth': '2',
  'math-shift': 'compact',
  'math-style': 'compact',
  'overscroll-behavior-block': 'contain',
  'overscroll-behavior-inline': 'contain',
  'overscroll-behavior-x': 'contain',
  'overscroll-behavior-y': 'contain',
  page: 'auto',
  'page-break-after': 'always',
  'page-break-before': 'always',
  'page-break-inside': 'avoid',
  'reading-flow': 'flex-visual',
  'reading-order': '1',
  'scroll-initial-target': 'nearest',
  'scroll-target-group': 'auto',
  'shape-image-threshold': '0.5',
  'speak-as': 'spell-out',
  'stop-opacity': '0.5',
  'trigger-scope': '--my-trigger',
  'user-modify': 'read-write',
  'view-transition-class': 'card',
  'view-transition-name': 'card',
  'view-transition-scope': 'card',

  'animation-range': 'entry$50pct$exit$50pct',
  'animation-range-end': 'exit$50pct',
  'animation-range-start': 'entry$50pct',
  'animation-timeline': 'scroll()',
  offset: '10px',
  'offset-path': 'circle(50%)',
  'offset-rotate': '45deg',
  'scroll-snap-stop': 'always',
  'scroll-timeline': '--my-timeline$block',
  'scroll-timeline-axis': 'block',
  'scroll-timeline-name': '--my-timeline',
  'timeline-scope': '--my-timeline',
  'timeline-trigger': '--my-trigger$--my-timeline',
  'timeline-trigger-active-range': 'entry$50pct',
  'timeline-trigger-active-range-end': 'exit$50pct',
  'timeline-trigger-active-range-start': 'entry$50pct',
  'timeline-trigger-name': '--my-trigger',
  'timeline-trigger-source': '--my-timeline',
  'view-timeline': '--my-view$block',
  'view-timeline-axis': 'block',
  'view-timeline-inset': '10px',
  'view-timeline-name': '--my-view',

  'border-image-outset': '4px',
  'border-shape': 'circle(50%)',
  mask: 'url(https://example.com/mask.svg)',
  'mask-border': 'url(https://example.com/mask.png)$30',
  'mask-border-mode': 'luminance',
  'mask-border-outset': '4px',
  'mask-border-repeat': 'round',
  'mask-border-slice': '30',
  'mask-border-source': 'url(https://example.com/mask.png)',
  'mask-composite': 'intersect',
  'mask-type': 'luminance',
  caret: 'primary$bar',
  'caret-animation': 'auto',
  'stroke-miterlimit': '4',
  'stroke-opacity': '0.5',

  'color-interpolation': 'sRGB',
  'color-interpolation-filters': 'sRGB',
  marker: 'url(#arrow)',
  'marker-end': 'url(#arrow)',
  'marker-mid': 'url(#arrow)',
  'marker-start': 'url(#arrow)',
  'paint-order': 'stroke',
  'shape-rendering': 'geometricPrecision',
  'text-rendering': 'optimizeLegibility',
  'vector-effect': 'non-scaling-stroke',

  'column-height': '200px',
  'column-wrap': 'wrap',
  container: 'card$inline-size',
  'container-name': 'card',
  'overflow-anchor': 'none',
  'overflow-block': 'auto',
  'overflow-clip-margin': '10px',
  'overflow-inline': 'auto',
  'position-anchor': '--my-anchor',
  'position-area': 'top',
  'position-try': '--my-fallback',
  'position-try-fallbacks': 'flip-block',
  'position-try-order': 'most-height',
  'position-visibility': 'anchors-visible',

  'counter-set': 'item$1',
  'font-feature-settings': "'liga'$1",
  'font-language-override': "'ENG'",
  'font-optical-sizing': 'none',
  'font-palette': 'dark',
  'font-size-adjust': '0.5',
  'font-synthesis': 'none',
  'font-synthesis-position': 'none',
  'font-synthesis-small-caps': 'none',
  'font-synthesis-style': 'none',
  'font-synthesis-weight': 'none',
  'font-variant-alternates': 'historical-forms',
  'font-variant-caps': 'small-caps',
  'font-variant-east-asian': 'ruby',
  'font-variant-emoji': 'emoji',
  'font-variant-ligatures': 'none',
  'font-variant-numeric': 'tabular-nums',
  'font-variant-position': 'super',
  'font-variation-settings': "'wght'$700",
  'line-height-step': '24px',
  'list-style-image': 'url(https://example.com/a.png)',
  'ruby-align': 'center',
  'ruby-position': 'over',
  'text-autospace': 'normal',
  'text-box': 'trim-both$cap$alphabetic',
  'text-box-edge': 'cap$alphabetic',
  'text-box-trim': 'trim-both',
  'text-combine-upright': 'all',
  'text-decoration-inset': '2px',
  'text-decoration-skip': 'none',
  'text-decoration-skip-ink': 'none',
  'text-emphasis': 'dot$primary',
  'text-emphasis-position': 'over$right',
  'text-emphasis-style': 'dot',
  'text-justify': 'inter-word',
  'text-size-adjust': '100pct',
  'text-spacing-trim': 'trim-start',
  'text-underline-position': 'under',
  'text-wrap-mode': 'wrap',
  'text-wrap-style': 'balance',
  'white-space-collapse': 'collapse',

  'grid-auto-columns': '1fr',
  'grid-auto-rows': 'auto',
  'grid-column-end': '3',
  'grid-column-start': '1',
  'grid-row-end': '3',
  'grid-row-start': '1',
  'grid-template': '1fr$/$1fr'
};

function sampleFor(alias, prop) {
  if (prop === 'd') return 'svg-d$M0,0L10,10';
  if (prop === 'r') return 'svg-r$10';
  if (prop === 'zoom') return 'zoom$1.5';
  if (prop === 'corner-shape' || /^corner-.*-shape$/.test(prop)) return alias + '$round';
  if (borderShorthands.has(prop)) return alias + '$1px$solid$red';
  if (colorProps.test(prop) || prop === 'color' || prop === 'fill' || prop === 'stroke') {
    return alias + '$primary';
  }
  if (prop === 'opacity') return alias + '$50';
  if (prop === 'font-weight') return alias + '$bold';
  if (prop === 'aspect-ratio') return alias + '$16$9';
  if (prop === 'grid-template-columns' || prop === 'grid-template-rows') return alias + '$3';
  if (prop === 'line-height') return alias + '$1.5';
  if (prop === 'background-image') return alias + '$url(https://example.com/a.png)';
  if (prop === 'content') return "content$'hello'";
  if (sampleByProp[prop]) return alias + '$' + sampleByProp[prop];
  if (lengthProps.has(prop) || /(^|-)width$|(^|-)radius$|^(margin|padding|inset|scroll-margin|scroll-padding)(-|$)/.test(prop)) {
    return alias + '$16';
  }
  if (enumProps.has(prop)) return alias + '$center';
  if (prop === 'z-index') return alias + '$10';
  if (prop === 'order' || prop === 'columns' || prop === 'column-count') return alias + '$2';
  return alias + '$VALUE';
}

/* ============================================================
 * Categories
 * ============================================================ */

function categoryFor(prop) {
  if (/^(color-interpolation|shape-rendering|text-rendering|image-rendering|marker|paint-order|vector-effect|d$|r$|cx$|cy$|x$|y$)/.test(prop)) {
    return 'SVG & Masking';
  }
  if (/^(animation|transition|transform|translate|rotate|scale|perspective|offset|scroll-behavior|scroll-snap|scroll-timeline|view-timeline|timeline|will-change|backface-visibility)/.test(prop)) {
    return 'Animation & Transform';
  }
  if (/^(flex|grid|gap|row-gap|column-gap|order|align-|justify-|place-)/.test(prop)) {
    return 'Flex & Grid';
  }
  if (/^(margin|padding|width|height|min-|max-|block-size|inline-size|scroll-margin|scroll-padding)/.test(prop)) {
    return 'Size & Spacing';
  }
  if (/^(font|text|line-height|letter-spacing|word-spacing|white-space|word-break|overflow-wrap|hyphens|tab-size|vertical-align|list-style|quotes|counter|orphans|widows|ruby)/.test(prop)) {
    return 'Typography';
  }
  if (/^(color|background|accent-|caret|fill|stroke|stop-color|flood-color|lighting-color)/.test(prop)) {
    return 'Color & Background';
  }
  if (/^(border|outline|box-shadow|text-shadow|filter|backdrop-filter|clip-path|mask|mix-blend|isolation|opacity|box-decoration)/.test(prop)) {
    return 'Borders & Effects';
  }
  if (/^(display|position|top|right|bottom|left|inset|z-index|float|clear|overflow|visibility|aspect-ratio|object-|box-sizing|contain|content-visibility|container|columns|column-|direction|unicode-bidi|writing-mode|resize|all)/.test(prop)) {
    return 'Layout';
  }
  return 'Other';
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/* ============================================================
 * Curated aliases
 * ============================================================ */

const curatedGroups = [
  {
    title: 'Layout',
    blurb: 'Display, position, inset, overflow and stacking.',
    items: [
      { aliases: ['d'], property: 'display', example: 'd$flex', note: 'Display aliases: f flex, g grid, b block, ib inline-block, i inline, n none, if inline-flex, ig inline-grid, t table, tc table-cell, li list-item, c contents, fr flow-root.' },
      { aliases: ['pos'], property: 'position', example: 'pos$sticky', note: 'relative, absolute, fixed, sticky and other CSS keywords.' },
      { aliases: ['top', 'right', 'bottom', 'left'], property: 'top / right / bottom / left', example: 'top$0', note: 'Bare numbers become px.' },
      { aliases: ['z'], property: 'z-index', example: 'z$10', note: 'Laibery uses z for z-index. The map uses z for zoom, which is available as zoom$1.5.' },
      { aliases: ['float'], property: 'float', example: 'float$left' },
      { aliases: ['ar'], property: 'aspect-ratio', example: 'ar$16$9', note: 'Separate the two sides with $.' },
      { aliases: ['ov', 'ovx', 'ovy'], property: 'overflow / overflow-x / overflow-y', example: 'ov$hidden' }
    ]
  },
  {
    title: 'Flex & Grid',
    blurb: 'Flex containers, grid tracks and alignment.',
    items: [
      { aliases: ['flex'], property: 'flex', example: 'flex$1' },
      { aliases: ['grow', 'shrink'], property: 'flex-grow / flex-shrink', example: 'grow$1' },
      { aliases: ['order'], property: 'order', example: 'order$2' },
      { aliases: ['fd'], property: 'flex-direction', example: 'fd$col', note: 'r row, c column, rr row-reverse, cr column-reverse. Full words also work.' },
      { aliases: ['wrap'], property: 'flex-wrap', example: 'wrap$wrap', note: 'wrap, nowrap, wrap-reverse.' },
      { aliases: ['justify'], property: 'justify-content', example: 'justify$sb' },
      { aliases: ['items'], property: 'align-items', example: 'items$c' },
      { aliases: ['self'], property: 'align-self', example: 'self$e' },
      { aliases: ['gap'], property: 'gap', example: 'gap$16', note: 'Accepts one or two values: gap$8$16.' },
      { aliases: ['gapx', 'gapy'], property: 'column-gap / row-gap', example: 'gapx$24' },
      { aliases: ['cols', 'rows'], property: 'grid-template-columns / grid-template-rows', example: 'cols$3', note: 'cols$3 becomes repeat(3, minmax(0, 1fr)).' }
    ]
  },
  {
    title: 'Size & Spacing',
    blurb: 'Width, height, padding and margin.',
    items: [
      { aliases: ['w', 'h'], property: 'width / height', example: 'w$full', note: 'full, screen, fit, min, max, percentages and CSS lengths.' },
      { aliases: ['minw', 'maxw'], property: 'min-width / max-width', example: 'maxw$960' },
      { aliases: ['minh', 'maxh'], property: 'min-height / max-height', example: 'maxh$80vh' },
      { aliases: ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'], property: 'padding', example: 'p$8$16', note: 'p accepts 1–4 values like the CSS shorthand. px/py set both sides.' },
      { aliases: ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'], property: 'margin', example: 'm$16', note: 'Negative values work: m$-8. mx$auto centers a block.' }
    ]
  },
  {
    title: 'Typography',
    blurb: 'Fonts, text rhythm and color.',
    items: [
      { aliases: ['fz'], property: 'font-size', example: 'fz$16' },
      { aliases: ['fw'], property: 'font-weight', example: 'fw$bold', note: 'Weight aliases: thin 100, extralight 200, light 300, normal/n 400, medium/m 500, semibold/sb 600, bold/b 700, extrabold/eb 800, black 900.' },
      { aliases: ['ff'], property: 'font-family', example: 'ff$sans', note: 'sans, serif and mono map to theme font stacks.' },
      { aliases: ['fi'], property: 'font-style', example: 'fi$italic' },
      { aliases: ['lh'], property: 'line-height', example: 'lh$1.5', note: '1.5 stays unitless; 24 becomes 24px.' },
      { aliases: ['ls'], property: 'letter-spacing', example: 'ls$1' },
      { aliases: ['ta'], property: 'text-align', example: 'ta$c' },
      { aliases: ['td'], property: 'text-decoration', example: 'td$u', note: 'u underline, n none, l line-through.' },
      { aliases: ['tt'], property: 'text-transform', example: 'tt$u' },
      { aliases: ['ws'], property: 'white-space', example: 'ws$nowrap' },
      { aliases: ['c'], property: 'color', example: 'c$primary' },
      { aliases: ['bg'], property: 'background-color', example: 'bg$surface' }
    ]
  },
  {
    title: 'Borders & Radius',
    blurb: 'Border shorthands, sides, style and radius.',
    items: [
      { aliases: ['b'], property: 'border', example: 'b$2$s$red', note: 'Values are classified by type: width, style, then color. Visible borders need a style.' },
      { aliases: ['bx', 'by'], property: 'left+right / top+bottom border', example: 'bx$1$d$primary' },
      { aliases: ['bt', 'bb', 'bl', 'br'], property: 'border-top / bottom / left / right', example: 'bt$1$s$border', note: 'br is border-right. Use r for border-radius.' },
      { aliases: ['bw', 'bst', 'bc'], property: 'border-width / border-style / border-color', example: 'bc$primary' },
      { aliases: ['r'], property: 'border-radius', example: 'r$12', note: 'r$full becomes 9999px. r$8$8$0$0 accepts four corners.' },
      { aliases: ['r-tl', 'r-tr', 'r-br', 'r-bl'], property: 'one border-radius corner', example: 'r-tl$0' }
    ]
  },
  {
    title: 'Effects & Interaction',
    blurb: 'Opacity, shadows, transitions and input behavior.',
    items: [
      { aliases: ['op'], property: 'opacity', example: 'op$50', note: 'Integers are percentages: 50 becomes 0.5.' },
      { aliases: ['sh'], property: 'box-shadow', example: 'sh$md', note: 'sm, md, lg and xl map to theme shadow variables.' },
      { aliases: ['tr'], property: 'transition', example: 'tr$200', note: 'tr$300$inout sets duration and timing.' },
      { aliases: ['cur'], property: 'cursor', example: 'cur$p' },
      { aliases: ['pe'], property: 'pointer-events', example: 'pe$none' },
      { aliases: ['sel'], property: 'user-select', example: 'sel$none' }
    ]
  }
];

const curatedFlat = [];
for (const group of curatedGroups) {
  for (const item of group.items) {
    curatedFlat.push({
      group: group.title,
      aliases: item.aliases,
      property: item.property,
      example: item.example,
      note: item.note || '',
      anchor: 'alias-' + slug(item.aliases[0])
    });
  }
}

/* ============================================================
 * Reference data
 * ============================================================ */

const conflicts = [
  { mapAlias: 'd', mapProperty: 'd', laiberyProperty: 'display', use: 'svg-d$M0,0L10,10' },
  { mapAlias: 'r', mapProperty: 'r', laiberyProperty: 'border-radius', use: 'svg-r$10' },
  { mapAlias: 'z', mapProperty: 'zoom', laiberyProperty: 'z-index', use: 'zoom$1.5' }
];

const properties = pairs.map((pair) => {
  const example = sampleFor(pair.alias, pair.property);
  return {
    alias: pair.alias,
    property: pair.property,
    example,
    category: categoryFor(pair.property),
    anchor: 'property-' + slug(pair.property),
    type: pair.alias === pair.property ? 'property' : 'map-alias'
  };
});

const extras = [
  {
    alias: 'svg-d',
    property: 'd',
    example: 'svg-d$M0,0L10,10',
    category: 'SVG & Masking',
    anchor: 'alias-svg-d',
    note: 'SVG path data. The map alias d is used by Laibery for display.'
  },
  {
    alias: 'svg-r',
    property: 'r',
    example: 'svg-r$10',
    category: 'SVG & Masking',
    anchor: 'alias-svg-r',
    note: 'SVG radius. The map alias r is used by Laibery for border-radius.'
  }
];

const values = [
  { write: 'p$16, w$240', result: 'Bare numbers become px for length properties.' },
  { write: 'm$-8', result: 'Negative values are allowed.' },
  { write: 'w$50pct or w$50%', result: 'Percentages. pct avoids % in class names.' },
  { write: 'fz$1.25rem, h$80vh', result: 'CSS length units pass through.' },
  { write: 'w$full, h$screen', result: '100% width / 100vh height. w$screen is 100vw.' },
  { write: 'w$fit, w$min, w$max', result: 'fit-content, min-content, max-content.' },
  { write: 'mx$auto', result: 'auto.' },
  { write: 'bg$ff0000', result: '#ff0000. Hex with or without #; 3, 4, 6 or 8 digits.' },
  { write: 'bg$primary', result: 'var(--lb-primary). Palette names become theme variables.' },
  { write: 'op$50', result: '0.5. Opacity treats integers as percentages.' },
  { write: 'cols$3', result: 'repeat(3, minmax(0, 1fr)).' },
  { write: 'gap$8$16', result: '8px 16px.' },
  { write: 'ar$16$9', result: '16 / 9.' },
  { write: "content$'hello'", result: "content: 'hello'." },
  { write: 'background-image$url(https://example.com/a.png)', result: 'URLs work because the parser splits at the first $.' }
];

const pseudoClasses = [
  'hover', 'focus', 'focus-visible', 'focus-within', 'active', 'visited',
  'disabled', 'checked', 'required', 'invalid', 'empty', 'first', 'last',
  'only', 'odd', 'even'
];

const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };

const palette = [
  ['primary', '#3b82f6'],
  ['primary-dark', '#1d4ed8'],
  ['secondary', '#64748b'],
  ['success', '#16a34a'],
  ['danger', '#dc2626'],
  ['warning', '#d97706'],
  ['info', '#0891b2'],
  ['light', '#f8fafc'],
  ['dark', '#0f172a'],
  ['muted', '#64748b'],
  ['border', '#e2e8f0'],
  ['surface', '#ffffff'],
  ['text', '#0f172a']
];

const api = [
  ['Laibery.start()', 'Scan the document and observe changes. Idempotent.'],
  ['Laibery.stop()', 'Disconnect the MutationObserver.'],
  ['Laibery.add(...classes)', 'Register tokens immediately, even if they are not in the DOM.'],
  ['Laibery.preview(token)', 'Return the CSS for one token, or null if invalid.'],
  ['Laibery.css()', 'Return the complete generated stylesheet.'],
  ['Laibery.theme({ ... })', 'Update palette colors and re-render variables.'],
  ['Laibery.define(key, priority, build)', 'Add a custom property.'],
  ['Laibery.config(options)', 'Read or set important and nonce.'],
  ['Laibery.version', 'Current version string.']
];

const limitations = [
  'Values cannot contain spaces. Use aliases or functions without spaces (calc(100%/3) works; calc(100% - 3px) does not).',
  'Runtime only: there is no static extraction, SSR stylesheet or build-time purging.',
  'JavaScript is required; the page has no styles until Laibery runs.',
  'No automatic vendor prefixing.',
  'Override relies on !important plus stylesheet order. A site inline style with !important still wins; a site !important rule with higher specificity also wins.',
  'Strict CSP needs a nonce.',
  'Shadow DOM is not scanned; only the main document is observed.',
  'Rules accumulate until reload; there is no automatic cleanup for tokens no longer in the DOM.',
  'dark: is class-based (.dark ancestor), not prefers-color-scheme.',
  'Variants cover pseudo-classes, breakpoints and dark:; there are no @supports or container-query variants yet.'
];

const valueAliases = [
  { title: 'Display aliases', text: 'f flex, g grid, b block, ib inline-block, i inline, n none, if inline-flex, ig inline-grid, t table, tc table-cell, li list-item, c contents, fr flow-root.' },
  { title: 'Alignment aliases', text: 'c center, s start, e end, fs flex-start, fe flex-end, sb space-between, sa space-around, se space-evenly, st stretch, b baseline.' },
  { title: 'Font weight aliases', text: 'thin 100, extralight 200, light 300, normal/n 400, medium/m 500, semibold/sb 600, bold/b 700, extrabold/eb 800, black 900.' },
  { title: 'Cursor aliases', text: 'p pointer, d default, t text, na not-allowed, m move, g grab, gr grabbing, h help, w wait, c crosshair, z zoom-in, cp copy.' }
];

/* ============================================================
 * Helpers
 * ============================================================ */

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function code(value) {
  return '<code>' + esc(value) + '</code>';
}

function conflictFor(alias) {
  return conflicts.find(item => item.mapAlias === alias) || null;
}

function categoryList() {
  return [...new Set(properties.map(item => item.category))].sort();
}

/* ============================================================
 * Markdown reference: docs/aliases.md
 * ============================================================ */

function buildAliasesMarkdown() {
  const lines = [];
  lines.push('# Laibery — full CSS property reference');
  lines.push('');
  lines.push('This page lists every CSS property from the alias map Laibery ships with: **520 properties**.');
  lines.push('Every property is available by full name or map alias, except the three deliberate conflicts below.');
  lines.push('');
  lines.push('Canonical documentation: [docs/](index.html) · Machine-readable: [classes.json](classes.json) · AI index: [llms.txt](llms.txt)');
  lines.push('');
  lines.push('```html');
  lines.push('<!-- full property name -->');
  lines.push('<div class="background-color$primary border-width$2">...</div>');
  lines.push('');
  lines.push('<!-- map alias -->');
  lines.push('<div class="a-i$center b-t$1px$solid$red">...</div>');
  lines.push('```');
  lines.push('');
  lines.push('## Read this first');
  lines.push('');
  lines.push('### Value rules');
  lines.push('');
  lines.push('- `$` separates the property from its values; use another `$` for each value of a shorthand.');
  lines.push('- Bare numbers become **px** for length properties: `margin$16` → `16px`.');
  lines.push('- `pct` becomes `%`: `width$50pct` → `50%`.');
  lines.push('- Palette names become theme variables: `color$primary` → `var(--lb-primary)`.');
  lines.push('- Hex colors may omit `#`: `color$ff0000` → `#ff0000`.');
  lines.push('- People often use a short curated alias instead: `p$16`, `bg$surface`, `b$2$s$red`.');
  lines.push('- Every row includes a working example. Very new or form-specific properties may accept additional values; treat the example as a starting point.');
  lines.push('- Values cannot contain spaces, `;`, `{`, `}`, `<`, `>`, or `\\`. `$` separates values; colons and quotes are allowed, so URLs work:');
  lines.push('  `background-image$url(https://example.com/a.png)`.');
  lines.push('');
  lines.push('### Override behavior');
  lines.push('');
  lines.push('Generated declarations include `!important` by default, and the stylesheet is kept after the');
  lines.push("site's own CSS. That means Laibery classes beat normal CSS the page wrote earlier. Turn it off with:");
  lines.push('');
  lines.push('```js');
  lines.push('Laibery.config({ important: false });');
  lines.push('```');
  lines.push('');
  lines.push('That removes `!important` from generated declarations. The sheet still stays last, so same-specificity ties still favor Laibery; higher-specificity site rules win.');
  lines.push('');
  lines.push("A site `!important` rule with higher specificity (for example `#app .card`) still wins. Laibery's `!important` beats normal declarations and wins later-order ties at the same specificity.");
  lines.push('');
  lines.push('### Deliberate naming conflicts');
  lines.push('');
  lines.push('| Map alias | Map property | Laibery uses | Use this instead |');
  lines.push('| --- | --- | --- | --- |');
  for (const conflict of conflicts) {
    lines.push('| `' + conflict.mapAlias + '` | ' + (conflict.mapProperty === 'd' || conflict.mapProperty === 'r' ? 'SVG `' + conflict.mapProperty + '`' : '`' + conflict.mapProperty + '`') + ' | `' + conflict.mapAlias + '` = `' + conflict.laiberyProperty + '` | `' + conflict.use + '` |');
  }
  lines.push('');
  lines.push('The full property names `zoom`, `z-index`, and the extra aliases `svg-d` / `svg-r` are all available.');
  lines.push('');
  lines.push('### Curated aliases that differ from the map');
  lines.push('');
  lines.push('These are hand-tuned Laibery shortcuts. They take priority over the map alias of the same name.');
  lines.push('');
  lines.push('| Curated | CSS property | Example |');
  lines.push('| --- | --- | --- |');
  for (const group of curatedGroups) {
    for (const item of group.items) {
      lines.push('| `' + item.aliases.join('` `') + '` | ' + item.property + ' | `' + item.example + '` |');
    }
  }
  lines.push('');
  lines.push('## All 520 properties');
  lines.push('');
  lines.push('| Alias | CSS property | Example |');
  lines.push('| --- | --- | --- |');
  for (const item of properties) {
    const conflict = conflictFor(item.alias);
    let note = '';
    if (conflict) {
      note = ' **Laibery `' + conflict.mapAlias + '` is ' + conflict.laiberyProperty + '; use `' + conflict.use.replace(/\$.*$/, '') + '` for the map meaning.**';
    }
    lines.push('| `' + item.alias + '` | `' + item.property + '`' + note + ' | `' + item.example + '` |');
  }
  lines.push('');
  lines.push('## Related');
  lines.push('');
  lines.push('- [Documentation site](index.html) — tutorials, search, variants, API and all classes.');
  lines.push('- [classes.json](classes.json) — structured data for tools and AI.');
  lines.push('- [llms.txt](llms.txt) — short AI index; [llms-full.txt](llms-full.txt) — full AI-readable docs.');
  lines.push('- [README](../README.md) — getting started, any-website loading, override, theme and API.');
  lines.push('- [Demo](../demo/index.html) — self-styled page and live playground.');
  lines.push('');
  lines.push('MIT licensed.');
  lines.push('');
  return lines.join('\n');
}

/* ============================================================
 * Structured data: docs/classes.json
 * ============================================================ */

function buildClassesJson() {
  return {
    name: 'Laibery',
    version,
    license: 'MIT',
    description: 'Runtime utility CSS generated from class names. Every class token contains $, for example b$2$s$red -> border: 2px solid red.',
    canonicalDocs: 'docs/index.html',
    syntax: '[variant: ...] property$value[$value...]',
    styleElementId: 'laibery-styles',
    defaultImportant: true,
    install: {
      scriptTag: '<script src="laibery.js"></script>',
      hostedScriptTag: '<script src="https://your-host.example/laibery.js"></script>',
      autoStart: true,
      note: 'Load one JavaScript file. It scans the DOM and observes changes. No build step and no separate CSS file.'
    },
    override: {
      enabledByDefault: true,
      mechanism: 'Generated declarations use !important and the generated stylesheet is kept last in the document.',
      caveats: [
        'A site inline style with !important wins.',
        'A site !important rule with higher specificity wins.',
        'Strict CSP needs a nonce.',
        'Shadow DOM is not scanned.',
        'Cascade layers with !important should be tested.'
      ]
    },
    config: {
      read: 'Laibery.config()',
      set: 'Laibery.config({ important, nonce })',
      globalBeforeLoad: 'window.__LAIBERY_CONFIG__ = { important, nonce }',
      defaults: { important: true, nonce: '' }
    },
    variants: {
      pseudoClasses,
      breakpoints,
      dark: 'dark: targets descendants of an element with class="dark"'
    },
    values,
    curated: curatedFlat,
    properties,
    extras,
    conflicts,
    palette,
    api,
    limitations,
    docs: {
      html: 'index.html',
      markdown: 'aliases.md',
      llms: 'llms.txt',
      llmsFull: 'llms-full.txt',
      sourceMap: 'css-property-alias-map.txt'
    }
  };
}

/* ============================================================
 * AI files
 * ============================================================ */

function buildLlmsTxt() {
  return [
    '# Laibery',
    '',
    '> Laibery is a zero-build runtime utility CSS engine. A class like b$2$s$red is parsed in the browser and turned into real CSS. It ships 520 CSS properties, curated aliases, variants, theme variables, and site-CSS override by default.',
    '',
    'Version: ' + version + '  ',
    'License: MIT  ',
    'Canonical docs: docs/index.html  ',
    'Full AI docs: docs/llms-full.txt  ',
    'Structured data: docs/classes.json  ',
    'Markdown reference: docs/aliases.md  ',
    '',
    '## Install on any website',
    '',
    '```html',
    '<script src="https://your-host.example/laibery.js"></script>',
    '<div class="b$2$s$red p$16 r$8">Hello</div>',
    '```',
    '',
    'Auto-start is on. You do not need to call Laibery.start(). Classes without $ are ignored. Every utility token must contain $.',
    '',
    '## Syntax',
    '',
    '[variant: ...] property$value[$value...]',
    '',
    '- b$2$s$red -> border-width:2px!important; border-style:solid!important; border-color:red!important',
    '- p$16 -> padding:16px!important',
    '- hover:bg$primary -> background-color on hover',
    '- md:cols$3 -> 3-column grid from 768px',
    '- dark:bg$dark -> dark background inside class="dark"',
    '',
    '## Critical rules',
    '',
    '- Values cannot contain spaces, ;, {, }, <, >, or backslash. $ separates values.',
    '- Bare numbers become px for length properties. pct becomes %. Palette names become var(--lb-*). Hex colors may omit #.',
    '- Default output uses !important and the stylesheet is kept last, so normal site CSS loses.',
    '- Opt out with Laibery.config({ important: false }).',
    '- CSP: set window.__LAIBERY_CONFIG__ = { nonce: "..." } before loading, or Laibery.config({ nonce: "..." }).',
    '- Conflicts: d = display (SVG d is svg-d); r = border-radius (SVG r is svg-r); z = z-index (zoom is zoom).',
    '- Full property names always work (with the d/r/zoom exceptions above), so prefer them when unsure.',
    '',
    '## Where to read more',
    '',
    '- Human documentation and search: docs/index.html',
    '- Every one of the 520 properties with examples: docs/aliases.md and docs/classes.json',
    '- Full Markdown for LLM context: docs/llms-full.txt',
    '- Demo: demo/index.html',
    ''
  ].join('\n');
}

function buildLlmsFull(readme, aliases) {
  return [
    '# Laibery — full documentation for humans and AI',
    '',
    'Version: ' + version + '  ',
    'License: MIT  ',
    'Canonical HTML docs: docs/index.html  ',
    'Structured JSON: docs/classes.json  ',
    'Short AI index: docs/llms.txt  ',
    '',
    'This file combines the complete Laibery guide and the full 520-property reference.',
    '',
    '---',
    '',
    readme.trim(),
    '',
    '---',
    '',
    aliases.trim(),
    ''
  ].join('\n');
}

/* ============================================================
 * HTML documentation: docs/index.html
 * ============================================================ */

function buildPropertyRows() {
  return properties.map((item) => {
    const conflict = conflictFor(item.alias);
    const search = (item.alias + ' ' + item.property + ' ' + item.example + ' ' + item.category).toLowerCase();
    const note = conflict
      ? '<span class="docs-note">' + esc('Map ' + conflict.mapAlias + ' = ' + conflict.mapProperty + '; Laibery ' + conflict.mapAlias + ' = ' + conflict.laiberyProperty + '. Use ' + conflict.use.replace(/\$.*$/, '') + ' for the map meaning.') + '</span>'
      : '';
    return [
      '<tr id="' + esc(item.anchor) + '" data-category="' + esc(item.category) + '" data-aliases="' + esc(item.alias + ' ' + item.property) + '" data-search="' + esc(search) + '">',
      '<td><code>' + esc(item.alias) + '</code></td>',
      '<td><code>' + esc(item.property) + '</code>' + note + '</td>',
      '<td><code>' + esc(item.example) + '</code> <button class="docs-copy" type="button" data-example="' + esc(item.example) + '" aria-label="Copy ' + esc(item.example) + '">Copy</button></td>',
      '<td><span class="docs-chip">' + esc(item.category) + '</span></td>',
      '</tr>'
    ].join('\n');
  }).join('\n');
}

function buildCuratedRows() {
  return curatedGroups.map((group) => {
    return group.items.map((item) => {
      const search = (group.title + ' ' + item.aliases.join(' ') + ' ' + item.property + ' ' + item.example + ' ' + (item.note || '')).toLowerCase();
      return [
        '<tr id="alias-' + esc(slug(item.aliases[0])) + '" data-aliases="' + esc(item.aliases.join(' ')) + '" data-search="' + esc(search) + '">',
        '<td>' + esc(group.title) + '</td>',
        '<td>' + item.aliases.map(alias => '<code>' + esc(alias) + '</code>').join(' ') + '</td>',
        '<td>' + esc(item.property) + '</td>',
        '<td><code>' + esc(item.example) + '</code> <button class="docs-copy" type="button" data-example="' + esc(item.example) + '" aria-label="Copy ' + esc(item.example) + '">Copy</button></td>',
        '<td>' + (item.note ? esc(item.note) : '') + '</td>',
        '</tr>'
      ].join('\n');
    }).join('\n');
  }).join('\n');
}

function buildIndexHtml() {
  const categories = categoryList();
  const categoryOptions = categories.map(category => '<option value="' + esc(category) + '">' + esc(category) + '</option>').join('\n');
  const pseudoText = pseudoClasses.map(name => '<code>' + esc(name) + '</code>').join(' ');
  const breakpointRows = Object.entries(breakpoints).map(([name, width]) => '<tr><td><code>' + esc(name) + ':</code></td><td>' + width + 'px</td></tr>').join('\n');
  const paletteRows = palette.map(([name, color]) => '<tr><td><code>--lb-' + esc(name) + '</code></td><td><code>' + esc(color) + '</code></td></tr>').join('\n');
  const valueRows = values.map(item => '<tr><td><code>' + esc(item.write) + '</code></td><td>' + esc(item.result) + '</td></tr>').join('\n');
  const apiRows = api.map(([name, description]) => '<tr><td><code>' + esc(name) + '</code></td><td>' + esc(description) + '</td></tr>').join('\n');
  const limitationItems = limitations.map(item => '<li>' + esc(item) + '</li>').join('\n');
  const valueAliasCards = valueAliases.map(item => '<div class="docs-card"><h3>' + esc(item.title) + '</h3><p>' + esc(item.text) + '</p></div>').join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Laibery docs — all 520 CSS classes and properties</title>
<meta name="description" content="Learn Laibery: runtime utility CSS from class names. Search all 520 CSS properties, curated aliases, variants, theming, site-CSS override and AI-readable documentation.">
<link rel="alternate" type="application/json" href="classes.json">
<script src="../laibery.js"></script>
<style>
  :root { --docs-sidebar: 248px; }
  html { scroll-behavior: smooth; }
  body { margin: 0; }
  [id] { scroll-margin-top: 78px; }
  .docs-layout { display: grid; grid-template-columns: var(--docs-sidebar) minmax(0, 1fr); gap: 32px; max-width: 1220px; margin: 0 auto; padding: 24px; }
  .docs-sidebar { position: sticky; top: 82px; align-self: start; max-height: calc(100vh - 100px); overflow: auto; }
  .docs-nav a { display: block; padding: 7px 10px; border-radius: 8px; color: var(--lb-text); text-decoration: none; font-size: 13px; }
  .docs-nav a:hover { background: var(--lb-light); color: var(--lb-primary); }
  .docs-nav .docs-nav-title { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--lb-muted); padding: 12px 10px 4px; }
  .docs-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .docs-table th, .docs-table td { text-align: left; padding: 9px 10px; border-bottom: 1px solid var(--lb-border); vertical-align: top; }
  .docs-table th { background: var(--lb-surface); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--lb-muted); }
  .docs-table tbody tr:hover { background: var(--lb-light); }
  .docs-table tr:target { background: #fef3c7; }
  .docs-table code { background: var(--lb-light); padding: 2px 5px; border-radius: 5px; font-size: 12px; }
  .docs-table td code { white-space: nowrap; }
  .docs-search { width: 100%; box-sizing: border-box; padding: 11px 14px; border: 1px solid var(--lb-border); border-radius: 8px; font: inherit; font-size: 14px; }
  .docs-search:focus { outline: 2px solid var(--lb-primary); outline-offset: 2px; }
  .docs-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 14px 0; }
  .docs-toolbar select { padding: 10px 12px; border: 1px solid var(--lb-border); border-radius: 8px; font: inherit; font-size: 13px; background: var(--lb-surface); }
  .docs-count { color: var(--lb-muted); font-size: 13px; }
  .docs-copy { border: 1px solid var(--lb-border); background: var(--lb-surface); color: var(--lb-muted); border-radius: 5px; font-size: 10px; padding: 2px 6px; cursor: pointer; }
  .docs-copy:hover { border-color: var(--lb-primary); color: var(--lb-primary); }
  .docs-chip { display: inline-block; background: var(--lb-light); border: 1px solid var(--lb-border); border-radius: 999px; padding: 2px 7px; font-size: 11px; white-space: nowrap; }
  .docs-note { display: block; margin-top: 4px; color: var(--lb-danger); font-size: 11px; max-width: 280px; }
  .docs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }
  .docs-card { background: var(--lb-surface); border: 1px solid var(--lb-border); border-radius: 12px; padding: 18px; box-shadow: var(--lb-shadow-sm); }
  .docs-card h3 { margin: 0 0 7px; font-size: 15px; }
  .docs-card p { margin: 0; color: var(--lb-muted); font-size: 13px; line-height: 1.6; }
  .docs-card code { background: var(--lb-light); border-radius: 4px; padding: 1px 4px; font-size: 12px; }
  .docs-kbd { display: inline-block; background: var(--lb-light); border: 1px solid var(--lb-border); border-bottom-width: 2px; border-radius: 5px; padding: 1px 6px; font-family: var(--lb-font-mono); font-size: 12px; }
  .docs-table-wrap { overflow-x: auto; border: 1px solid var(--lb-border); border-radius: 12px; background: var(--lb-surface); }
  .docs-table-wrap .docs-table { min-width: 620px; }
  .docs-table-wrap .docs-table th:first-child, .docs-table-wrap .docs-table td:first-child { padding-left: 14px; }
  .docs-hero { background: radial-gradient(circle at 15% 0%, #dbeafe, transparent 45%), radial-gradient(circle at 85% 10%, #ede9fe, transparent 40%); border: 1px solid var(--lb-border); border-radius: 18px; padding: 34px; }
  .docs-example { background: var(--lb-dark); color: #f8fafc; border-radius: 10px; padding: 14px 16px; overflow: auto; font-family: var(--lb-font-mono); font-size: 13px; line-height: 1.6; }
  .docs-example code { background: transparent; color: inherit; padding: 0; }
  .docs-callout { border-left: 4px solid var(--lb-primary); background: #eff6ff; padding: 13px 16px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.6; }
  .docs-warning { border-left-color: var(--lb-warning); background: #fffbeb; }
  .docs-sidebar .docs-search { padding: 8px 10px; font-size: 13px; }
  @media (max-width: 860px) {
    .docs-layout { grid-template-columns: 1fr; padding: 16px; }
    .docs-sidebar { position: static; max-height: none; }
    .docs-sidebar .docs-nav { display: flex; flex-wrap: wrap; gap: 4px; }
    .docs-sidebar .docs-nav a { padding: 5px 8px; }
    .docs-sidebar .docs-nav-title { display: none; }
    .docs-hero { padding: 24px; }
  }
</style>
</head>
<body class="bg$light c$text ff$sans m$0">

<header class="pos$sticky top$0 z$10 bg$surface bb$1$s$border">
  <div class="maxw$1220 mx$auto p$12$24 d$flex items$c justify$sb gap$16 wrap$wrap">
    <a href="index.html" class="d$flex items$c gap$10 c$text td$n">
      <span class="d$inline-flex items$c justify$c w$34 h$34 r$9 bg$primary-dark c$white fw$black fz$18">L</span>
      <span>
        <span class="d$block fz$16 fw$bold lh$1.2">Laibery docs</span>
        <span class="d$block fz$11 c$muted">Every class. One route.</span>
      </span>
    </a>
    <nav class="d$flex items$c gap$4 fz$13 wrap$wrap">
      <a href="#start" class="c$text td$n p$6$10 r$6 hover:bg$light">Start</a>
      <a href="#any-site" class="c$text td$n p$6$10 r$6 hover:bg$light">Any site</a>
      <a href="#properties" class="c$text td$n p$6$10 r$6 hover:bg$light">All classes</a>
      <a href="#ai" class="c$text td$n p$6$10 r$6 hover:bg$light">For AI</a>
      <a href="../demo/index.html" class="c$text td$n p$6$10 r$6 hover:bg$light">Demo</a>
    </nav>
  </div>
</header>

<div class="docs-layout">
  <aside class="docs-sidebar">
    <input id="side-search" class="docs-search" type="search" placeholder="Jump to a class…" aria-label="Jump to a class">
    <nav class="docs-nav" aria-label="Documentation sections">
      <div class="docs-nav-title">Learn</div>
      <a href="#start">Start here</a>
      <a href="#any-site">Use on any website</a>
      <a href="#syntax">Syntax and values</a>
      <a href="#override">Override site CSS</a>
      <div class="docs-nav-title">Reference</div>
      <a href="#curated">Curated aliases</a>
      <a href="#properties">All 520 properties</a>
      <a href="#conflicts">Naming conflicts</a>
      <a href="#variants">Variants</a>
      <a href="#theme">Theme</a>
      <a href="#api">JavaScript API</a>
      <div class="docs-nav-title">Share</div>
      <a href="#ai">For AI / tools</a>
      <a href="aliases.md">Markdown reference</a>
      <a href="classes.json">classes.json</a>
      <a href="llms.txt">llms.txt</a>
      <a href="#limitations">Limitations</a>
    </nav>
  </aside>

  <main>
    <section id="start" class="m$0$0$40">
      <div class="docs-hero">
        <span class="d$inline-block bg$primary-dark c$white p$3$10 r$full fz$11 fw$semibold ls$1">v${esc(version)} · 520 PROPERTIES</span>
        <h1 class="fz$42 fw$black lh$1.08 m$14$0$12 maxw$800">Write the style <span class="c$primary">inside</span> the class name.</h1>
        <p class="fz$18 c$muted lh$1.65 maxw$760 m$0$0$20">
          Laibery reads class tokens such as <code>b$2$s$red</code> and generates real CSS at runtime.
          This page is the complete route: every curated alias, all 520 CSS properties, values,
          variants, theming, override behavior and the JavaScript API.
        </p>
        <div class="d$flex gap$10 wrap$wrap">
          <a href="#properties" class="d$inline-flex items$c justify$c p$10$18 r$8 bg$primary-dark c$white fw$semibold fz$14 td$n hover:bg$dark">Browse all 520 classes</a>
          <a href="../demo/index.html" class="d$inline-flex items$c justify$c p$10$18 r$8 bg$surface c$text b$1$s$border fw$semibold fz$14 td$n hover:bg$light">Open the live demo</a>
        </div>
      </div>

      <h2 class="fz$20 fw$bold m$24$0$10">How it works</h2>
      <div class="docs-grid m$10$0$0">
        <div class="docs-card">
          <h3>1. Load one file</h3>
          <p>Add <code>&lt;script src="laibery.js"&gt;&lt;/script&gt;</code>. It auto-starts and observes new elements. No build, no separate stylesheet.</p>
        </div>
        <div class="docs-card">
          <h3>2. Write a class</h3>
          <p><code>b$2$s$red</code> means border 2px solid red. <code>p$16</code> means padding 16px. Classes without <code>$</code> are ignored.</p>
        </div>
        <div class="docs-card">
          <h3>3. It wins by default</h3>
          <p>Declarations carry <code>!important</code> and the generated sheet stays last, so normal CSS a site wrote earlier loses.</p>
        </div>
      </div>

      <div class="m$20$0$0">
        <div class="fz$12 fw$bold c$muted tt$u ls$1 m$0$0$7">Minimal page</div>
        <pre class="docs-example m$0"><code>&lt;script src="/laibery.js"&gt;&lt;/script&gt;

&lt;div class="b$2$s$red p$16 r$8 bg$surface"&gt;
  Hello, Laibery
&lt;/div&gt;</code></pre>
      </div>
    </section>

    <section id="any-site" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">Use on any website</h2>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$18">
        You only need one JavaScript file. It works on a page you control, a CMS page, a tiny HTML widget,
        or a site where you inject a script later.
      </p>
      <div class="docs-grid">
        <div class="docs-card">
          <h3>Host the file</h3>
          <p>Put <code>laibery.js</code> next to the HTML, on GitHub Pages, S3, a CDN, or any static host.</p>
          <pre class="docs-example m$10$0$0"><code>&lt;script src="https://your-host.example/laibery.js"&gt;&lt;/script&gt;</code></pre>
        </div>
        <div class="docs-card">
          <h3>Or add it before &lt;/body&gt;</h3>
          <p>The library scans the existing DOM and watches for future elements with a <code>MutationObserver</code>.</p>
          <pre class="docs-example m$10$0$0"><code>&lt;script src="/laibery.js"&gt;&lt;/script&gt;</code></pre>
        </div>
      </div>

      <h3 class="fz$20 fw$bold m$24$0$8">CSP and nonces</h3>
      <p class="fz$15 c$muted lh$1.65 maxw$760 m$0$0$12">If <code>style-src</code> does not allow <code>'unsafe-inline'</code>, give the generated style element the page's nonce before Laibery loads.</p>
      <pre class="docs-example m$0"><code>&lt;script nonce="abc123"&gt;
  window.__LAIBERY_CONFIG__ = { nonce: 'abc123' };
&lt;/script&gt;
&lt;script nonce="abc123" src="/laibery.js"&gt;&lt;/script&gt;</code></pre>
      <p class="fz$14 c$muted lh$1.6 m$12$0$0">The script tag also needs a nonce when <code>script-src</code> requires one. You can also call <code>Laibery.config({ nonce: 'abc123' })</code> before the first scan.</p>

      <h3 class="fz$20 fw$bold m$24$0$8">Verify it loaded</h3>
      <pre class="docs-example m$0"><code>Laibery.version;                         // "0.2.0"
document.getElementById('laibery-styles'); // generated style element
Laibery.preview('b$2$s$red');            // CSS string, or null</code></pre>
      <p class="fz$14 c$muted lh$1.6 m$12$0$0">If <code>Laibery</code> is undefined, the script URL is wrong, the request was blocked, or the file was not served as JavaScript. If the style element is missing, call <code>Laibery.start()</code> or check the console.</p>
    </section>

    <section id="syntax" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">Syntax and values</h2>
      <pre class="docs-example m$0$0$14"><code>[variant: ...] property$value[$value...]</code></pre>
      <div class="docs-table-wrap">
        <table class="docs-table">
          <thead><tr><th>Class</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>b$2$s$red</code></td><td>border: width 2px, style solid, color red</td></tr>
            <tr><td><code>p$16</code></td><td>padding: 16px</td></tr>
            <tr><td><code>p$8$16</code></td><td>padding: 8px 16px</td></tr>
            <tr><td><code>bg$primary</code></td><td>background-color: var(--lb-primary)</td></tr>
            <tr><td><code>hover:bg$primary-dark</code></td><td>background on hover</td></tr>
            <tr><td><code>md:cols$3</code></td><td>3-column grid from 768px up</td></tr>
            <tr><td><code>md:hover:b$2$s$primary</code></td><td>border on hover, from 768px up</td></tr>
            <tr><td><code>dark:bg$dark</code></td><td>dark background inside class="dark"</td></tr>
          </tbody>
        </table>
      </div>
      <h3 class="fz$20 fw$bold m$24$0$8">Values</h3>
      <div class="docs-table-wrap">
        <table class="docs-table">
          <thead><tr><th>You write</th><th>You get</th></tr></thead>
          <tbody>${valueRows}</tbody>
        </table>
      </div>
      <p class="fz$14 c$muted lh$1.65 m$12$0$0">
        Each individual value cannot contain spaces, <code>;</code>, <code>{</code>, <code>}</code>, <code>&lt;</code>, <code>&gt;</code>, or a backslash.
        <code>$</code> separates values; colons, quotes, <code>/</code> and parentheses are allowed. The parser splits at the first <code>$</code>, so URLs work.
      </p>
    </section>

    <section id="override" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">Override earlier site CSS</h2>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$16">
        This is the behavior that makes Laibery useful on pages you do not own. Suppose the site already wrote:
      </p>
      <pre class="docs-example m$0$0$12"><code>&lt;style&gt;
  .card { border: 1px dashed #94a3b8; background: #ffe4e6; }
&lt;/style&gt;

&lt;div class="card"&gt;Site styling&lt;/div&gt;</code></pre>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$12">Add Laibery classes to the same element:</p>
      <pre class="docs-example m$0$0$12"><code>&lt;div class="card b$3$s$primary bg$surface"&gt;
  Laibery styling
&lt;/div&gt;</code></pre>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$12">Laibery generates:</p>
      <pre class="docs-example m$0$0$12"><code>[class~="b$3$s$primary"] {
  border-width: 3px !important;
  border-style: solid !important;
  border-color: var(--lb-primary) !important;
}
[class~="bg$surface"] {
  background-color: var(--lb-surface) !important;
}</code></pre>
      <p class="fz$15 c$muted lh$1.65 maxw$800 m$0$0$14">
        The generated declarations beat the site's normal <code>.card</code> declarations even though both selectors have class-level specificity.
        Laibery also keeps its <code>&lt;style id="laibery-styles"&gt;</code> after the site's own styles, so at equal specificity its <code>!important</code> wins on document order.
      </p>
      <div class="docs-callout docs-warning m$0$0$16">
        <strong>Important caveat:</strong> a site <code>!important</code> rule with higher specificity (for example <code>#app .card</code>) still wins, and a site inline <code>style="... !important"</code> still wins. Most normal site CSS is overridden; these edge cases are not.
      </div>
      <h3 class="fz$20 fw$bold m$0$0$8">What the runtime does</h3>
      <ol class="fz$14 c$muted lh$1.8 m$0$0$14">
        <li>Appends the generated stylesheet at the end of <code>&lt;body&gt;</code> (or head/html if there is no body).</li>
        <li>Watches for new <code>&lt;style&gt;</code> and <code>&lt;link&gt;</code> elements and moves the Laibery sheet after them.</li>
        <li>Recreates the sheet if a script or framework removes it.</li>
        <li>Reuses the same <code>&lt;style id="laibery-styles"&gt;</code> element instead of creating one per update.</li>
      </ol>
      <p class="fz$14 c$muted lh$1.6 m$0">
        Disable <code>!important</code> with <code>Laibery.config({ important: false })</code>. The sheet still stays last, so same-specificity ties still favor Laibery; higher-specificity site rules win.
      </p>
    </section>

    <section id="curated" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">Curated aliases</h2>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$16">
        These are the hand-tuned shortcuts. They take priority over a map alias of the same name. Every full CSS property name also works; see <a href="#properties" class="c$primary-dark">all 520 properties</a>.
      </p>
      <div class="docs-toolbar">
        <input id="curated-search" class="docs-search" style="flex:1 1 260px" type="search" placeholder="Search curated shortcuts, aliases or examples…" aria-label="Search curated aliases">
        <span class="docs-count"><strong id="curated-count">47</strong> shown</span>
      </div>
      <div class="docs-table-wrap">
        <table class="docs-table">
          <thead><tr><th>Group</th><th>Aliases</th><th>CSS property</th><th>Example</th><th>Notes</th></tr></thead>
          <tbody id="curated-rows">${buildCuratedRows()}</tbody>
        </table>
      </div>
      <div class="docs-grid m$16$0$0">${valueAliasCards}</div>
    </section>

    <section id="properties" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">All 520 properties</h2>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$14">
        Search by class, CSS property, example or category. Every row has a shareable anchor, for example <code>#property-border-radius</code>.
        Every row includes a working example. Very new or form-specific properties may accept other values too.
      </p>
      <div class="docs-toolbar">
        <input id="property-search" class="docs-search" style="flex:1 1 260px" type="search" placeholder="Search 520 properties, aliases or examples…" aria-label="Search all properties">
        <select id="property-category" aria-label="Filter by category">
          <option value="all">All categories</option>
          ${categoryOptions}
        </select>
        <span class="docs-count"><strong id="property-count">520</strong> shown</span>
      </div>
      <div class="docs-table-wrap">
        <table class="docs-table">
          <thead><tr><th>Alias</th><th>CSS property</th><th>Example</th><th>Category</th></tr></thead>
          <tbody id="property-rows">
${buildPropertyRows()}
          </tbody>
        </table>
      </div>
      <p class="fz$13 c$muted lh$1.6 m$10$0$0">
        Every full property name works. The map's <code>d</code>, <code>r</code> and <code>z</code> meanings conflict with Laibery's curated aliases; use <code>svg-d</code>, <code>svg-r</code> and <code>zoom</code> for those map meanings.
        Download the same data as <a href="classes.json" class="c$primary-dark">classes.json</a> or <a href="aliases.md" class="c$primary-dark">aliases.md</a>.
      </p>
    </section>

    <section id="conflicts" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">Naming conflicts to remember</h2>
      <div class="docs-table-wrap">
        <table class="docs-table">
          <thead><tr><th>Map alias</th><th>Map meaning</th><th>Laibery meaning</th><th>Use this for the map meaning</th></tr></thead>
          <tbody>
            <tr><td><code>d</code></td><td>SVG <code>d</code></td><td><code>display</code></td><td><code>svg-d$M0,0L10,10</code></td></tr>
            <tr><td><code>r</code></td><td>SVG <code>r</code></td><td><code>border-radius</code></td><td><code>svg-r$10</code></td></tr>
            <tr><td><code>z</code></td><td><code>zoom</code></td><td><code>z-index</code></td><td><code>zoom$1.5</code></td></tr>
          </tbody>
        </table>
      </div>
      <p class="fz$14 c$muted lh$1.6 m$12$0$0">Full names <code>zoom</code> and <code>z-index</code> are also available. <code>svg-d</code> and <code>svg-r</code> are extra aliases generated for the SVG properties.</p>
    </section>

    <section id="variants" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">Variants</h2>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$14">Put variants before the property, separated by <code>:</code>.</p>
      <h3 class="fz$20 fw$bold m$0$0$8">Pseudo-classes</h3>
      <p class="fz$14 lh$2 m$0$0$14">${pseudoText}</p>
      <pre class="docs-example m$0$0$18"><code>&lt;button class="bg$primary hover:bg$primary-dark focus:b$2$s$primary"&gt;Save&lt;/button&gt;</code></pre>
      <h3 class="fz$20 fw$bold m$0$0$8">Breakpoints</h3>
      <div class="docs-table-wrap maxw$520">
        <table class="docs-table">
          <thead><tr><th>Variant</th><th>Min-width</th></tr></thead>
          <tbody>${breakpointRows}</tbody>
        </table>
      </div>
      <pre class="docs-example m$12$0$18"><code>&lt;div class="cols$1 md:cols$2 lg:cols$3"&gt;...&lt;/div&gt;
&lt;div class="md:hover:b$2$s$primary"&gt;...&lt;/div&gt;</code></pre>
      <h3 class="fz$20 fw$bold m$0$0$8">Dark mode</h3>
      <pre class="docs-example m$0$0$12"><code>&lt;html class="dark"&gt;
  &lt;body class="bg$light dark:bg$dark"&gt;
    &lt;div class="bg$surface dark:bg$dark dark:c$white"&gt;...&lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
      <p class="fz$14 c$muted lh$1.6 m$0">Toggle the <code>dark</code> class however you like; no extra setup is needed.</p>
    </section>

    <section id="theme" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">Theme</h2>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$14">
        Palette names become CSS variables. Override them at runtime and every utility that references them updates.
      </p>
      <div class="docs-table-wrap maxw$520">
        <table class="docs-table">
          <thead><tr><th>Variable</th><th>Default</th></tr></thead>
          <tbody>${paletteRows}</tbody>
        </table>
      </div>
      <pre class="docs-example m$14$0$0"><code>Laibery.theme({
  primary: '#7c3aed',
  'primary-dark': '#6d28d9',
  surface: '#fffdf7'
});

Laibery.theme({ brand: '#123456' });
// now: bg$brand, c$brand, b$1$s$brand</code></pre>
      <p class="fz$14 c$muted lh$1.6 m$12$0$0">The stylesheet also defines <code>--lb-shadow-sm|md|lg|xl</code>, <code>--lb-font-sans|serif|mono</code>, and <code>box-sizing: border-box</code> on all elements.</p>
    </section>

    <section id="api" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">JavaScript API</h2>
      <div class="docs-table-wrap">
        <table class="docs-table">
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>${apiRows}</tbody>
        </table>
      </div>
      <h3 class="fz$20 fw$bold m$24$0$8">Configuration</h3>
      <pre class="docs-example m$0"><code>Laibery.config();                        // { important: true, nonce: '' }
Laibery.config({ important: false });   // opt out of !important
Laibery.config({ nonce: 'abc123' });    // CSP nonce

// Before the library loads:
window.__LAIBERY_CONFIG__ = { important: true, nonce: 'abc123' };</code></pre>
      <h3 class="fz$20 fw$bold m$24$0$8">Manual start and custom properties</h3>
      <pre class="docs-example m$0"><code>// Disable auto-start before loading:
window.__LAIBERY_MANUAL__ = true;
Laibery.start();

// Pre-generate rules:
Laibery.add('p$24 b$2$s$primary md:cols$3');

// Add a custom property:
Laibery.define('trbl', 200, function (values) {
  return [['transform', 'translate(' + values[0] + 'px,' + values[1] + 'px)']];
});
// &lt;div class="trbl$10$20"&gt;</code></pre>
      <p class="fz$14 c$muted lh$1.6 m$12$0$0"><code>define</code> is JavaScript you write. Validate any untrusted value before returning it as CSS.</p>
    </section>

    <section id="ai" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">For AI and other tools</h2>
      <p class="fz$16 c$muted lh$1.65 maxw$760 m$0$0$16">
        These files are generated from the same source map as the library, so an AI or coding tool can read them and work on another website without guessing class names.
      </p>
      <div class="docs-grid">
        <div class="docs-card">
          <h3><a href="classes.json" class="c$primary-dark">classes.json</a></h3>
          <p>Structured data: syntax, config, variants, values, curated aliases, 520 properties and examples in JSON.</p>
        </div>
        <div class="docs-card">
          <h3><a href="llms.txt" class="c$primary-dark">llms.txt</a></h3>
          <p>Short LLM index: install, critical rules, conflicts and links to the full reference.</p>
        </div>
        <div class="docs-card">
          <h3><a href="llms-full.txt" class="c$primary-dark">llms-full.txt</a></h3>
          <p>Full Markdown guide plus the complete 520-property table, ready to paste into an AI context.</p>
        </div>
        <div class="docs-card">
          <h3><a href="aliases.md" class="c$primary-dark">aliases.md</a></h3>
          <p>Human-readable Markdown property reference with aliases, examples and conflicts.</p>
        </div>
      </div>
      <div class="docs-callout m$16$0$0">
        <strong>AI handoff:</strong> read <code>classes.json</code> and <code>llms-full.txt</code>. Use only documented aliases or full property names;
        every token must contain <code>$</code>; prefer full property names when unsure; do not use <code>d</code>/<code>r</code> for SVG (use <code>svg-d</code>/<code>svg-r</code>);
        Laibery's generated declarations use <code>!important</code> by default.
      </div>
    </section>

    <section id="limitations" class="m$0$0$40">
      <h2 class="fz$30 fw$bold lh$1.2 m$0$0$10">Limitations</h2>
      <ul class="fz$14 c$muted lh$1.8 m$0">${limitationItems}</ul>
    </section>

    <footer class="p$24$0$8 c$muted fz$13 bb$1$s$border">
      <div class="d$flex justify$sb gap$12 wrap$wrap">
        <span>Laibery v${esc(version)} — MIT licensed.</span>
        <span class="ff$mono">docs/index.html · classes.json · llms.txt</span>
      </div>
    </footer>
  </main>
</div>

<script>
(function () {
  var input = document.getElementById('property-search');
  var sideInput = document.getElementById('side-search');
  var category = document.getElementById('property-category');
  var count = document.getElementById('property-count');
  var rows = Array.prototype.slice.call(document.querySelectorAll('#property-rows tr'));
  var curatedInput = document.getElementById('curated-search');
  var curatedCount = document.getElementById('curated-count');
  var curatedRows = Array.prototype.slice.call(document.querySelectorAll('#curated-rows tr'));

  function matches(row, query) {
    if (!query) return true;
    var dollar = query.indexOf('$');
    if (dollar !== -1) {
      var head = query.slice(0, dollar);
      var aliases = (row.getAttribute('data-aliases') || '').split(/\\s+/);
      return aliases.indexOf(head) !== -1;
    }
    return (row.getAttribute('data-search') || '').indexOf(query) !== -1;
  }

  function filter() {
    var query = (input.value || '').trim().toLowerCase();
    var selected = category.value;
    var shown = 0;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var matchQuery = matches(row, query);
      var matchCategory = selected === 'all' || row.getAttribute('data-category') === selected;
      var visible = matchQuery && matchCategory;
      row.hidden = !visible;
      if (visible) shown++;
    }
    count.textContent = String(shown);
  }

  input.addEventListener('input', filter);
  category.addEventListener('change', filter);
  curatedInput.addEventListener('input', function () {
    var query = (curatedInput.value || '').trim().toLowerCase();
    var shown = 0;
    for (var i = 0; i < curatedRows.length; i++) {
      var row = curatedRows[i];
      var visible = matches(row, query);
      row.hidden = !visible;
      if (visible) shown++;
    }
    curatedCount.textContent = String(shown);
  });
  sideInput.addEventListener('input', function () {
    input.value = sideInput.value;
    curatedInput.value = sideInput.value;
    filter();
    curatedInput.dispatchEvent(new Event('input', { bubbles: true }));
    var target = Number(count.textContent) === 0 && Number(curatedCount.textContent) > 0
      ? document.getElementById('curated')
      : document.getElementById('properties');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-example]');
    if (!button) return;
    var text = button.getAttribute('data-example');
    var done = function () {
      var old = button.textContent;
      button.textContent = 'Copied';
      setTimeout(function () { button.textContent = old; }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    }
  });
})();
</script>
</body>
</html>`;
}

/* ============================================================
 * Write files
 * ============================================================ */

const aliases = buildAliasesMarkdown();
const classes = buildClassesJson();
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

fs.writeFileSync(path.join(docsDir, 'aliases.md'), aliases, 'utf8');
fs.writeFileSync(path.join(docsDir, 'classes.json'), JSON.stringify(classes, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(docsDir, 'llms.txt'), buildLlmsTxt(), 'utf8');
fs.writeFileSync(path.join(docsDir, 'llms-full.txt'), buildLlmsFull(readme, aliases), 'utf8');
fs.writeFileSync(path.join(docsDir, 'index.html'), buildIndexHtml(), 'utf8');

console.log('Built docs:');
console.log('  docs/index.html      ' + fs.statSync(path.join(docsDir, 'index.html')).size + ' bytes');
console.log('  docs/classes.json    ' + fs.statSync(path.join(docsDir, 'classes.json')).size + ' bytes');
console.log('  docs/aliases.md      ' + fs.statSync(path.join(docsDir, 'aliases.md')).size + ' bytes');
console.log('  docs/llms.txt        ' + fs.statSync(path.join(docsDir, 'llms.txt')).size + ' bytes');
console.log('  docs/llms-full.txt   ' + fs.statSync(path.join(docsDir, 'llms-full.txt')).size + ' bytes');
console.log('  properties: ' + classes.properties.length + ', curated groups: ' + curatedGroups.length);
