# Laibery

**Write the style inside the class name.**

Laibery is a tiny runtime utility CSS engine. A class like `b$2$s$red` is parsed in the browser and turned into real CSS:

```css
[class~="b$2$s$red"] {
  border-width: 2px !important;
  border-style: solid !important;
  border-color: red !important;
}
```

No build step, no config file, no stylesheet to maintain. Include one script, then type utilities directly in your HTML — including HTML that is added later.

- Zero dependencies, single file
- Works on any website, including pages you do not control
- **Overrides CSS the site wrote earlier** (`!important` + stylesheet kept last)
- 520 CSS properties from the full property map, plus short curated aliases
- Works with static and dynamically-created elements
- Deterministic cascade (no "which rule came first?" surprises)
- Themeable through CSS variables
- ~54 KB uncompressed, ~14 KB gzipped
- MIT licensed

## Quick start

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="laibery.js"></script>
</head>
<body class="bg$light c$text ff$sans m$0">

  <div class="maxw$960 mx$auto p$24">
    <h1 class="fz$28 fw$bold lh$1.2 m$0$0$12">Hello, Laibery</h1>

    <div class="bg$surface b$1$s$border r$12 p$20 sh$sm">
      <p class="c$muted lh$1.6 m$0">A card, styled entirely from class names.</p>
      <button class="d$inline-flex items$c p$10$18 r$8 bg$primary c$white fw$semibold cur$p b$0 hover:bg$primary-dark">
        Click me
      </button>
    </div>
  </div>

</body>
</html>
```

The script auto-starts when the DOM is ready. Open `demo/index.html` for a full page that uses the library to style itself.

## Documentation

**[Open the documentation route → docs/index.html](docs/index.html)** — a searchable guide to every class, with a shareable anchor per class and filterable categories.

- [docs/index.html](docs/index.html) — tutorial, curated aliases, all 520 properties, values, variants, theme, override behavior and the JavaScript API
- [docs/aliases.md](docs/aliases.md) — plain Markdown property reference
- [docs/classes.json](docs/classes.json) — structured data for tools and AI
- [docs/llms.txt](docs/llms.txt) and [docs/llms-full.txt](docs/llms-full.txt) — short and full AI-readable documentation

The docs are generated from the same source map as the library. Run `npm run docs` after changing it.

## Use on any website

You only need to load one JavaScript file. There is no build step and no separate CSS file.

### 1. Put `laibery.js` somewhere the page can load

Download or copy `laibery.js` and place it:

- next to the site's HTML, e.g. `/laibery.js`
- on a static host, GitHub Pages, S3, or a CDN
- or anywhere else that serves a `.js` file

If you publish the file on a CDN, the tag looks like this (replace the URL with your own):

```html
<script src="https://your-cdn.example/laibery.js"></script>
```

### 2. Add one script tag

Before `</body>`:

```html
<script src="/laibery.js"></script>
```

or in `<head>` with `defer`:

```html
<script defer src="/laibery.js"></script>
```

Both work. The library scans the current DOM, then watches for new elements and changed `class` attributes with a `MutationObserver`. You do **not** need to call `Laibery.start()` yourself.

### 3. Add Laibery classes to the page

```html
<div class="card b$3$s$primary bg$surface p$20 r$12">
  This box wins over the site's earlier `.card` rule.
</div>
```

Classes without `$` are ignored, so Laibery can live next to the site's existing classes without conflicts.

### Verify it loaded

Open DevTools on the page and check:

```js
Laibery.version;
// "0.2.0"

document.getElementById('laibery-styles');
// <style id="laibery-styles" data-laibery="0.2.0">…</style>

Laibery.preview('b$2$s$red');
// [class~="b$2$s$red"]{border-width:2px!important;…}
```

If `Laibery` is undefined, the script URL is wrong, the request was blocked, or the file was not served as JavaScript. If the `<style>` element is missing, call `Laibery.start()` or check for an exception in the console.

### Loading it after the page has already rendered

If you inject the script later (bookmarklet, browser extension, CMS widget, or a tag manager), it still works:

- it scans everything already on the page, and
- it catches elements added later through the `MutationObserver`.

For a quick test in DevTools, paste the script contents into the console (or add a script tag), then add a class such as `b$2$s$red` to an element.

A bookmarklet can inject a hosted copy into the current page:

```js
javascript:(function(){var s=document.createElement('script');s.src='https://your-cdn.example/laibery.js';document.body.appendChild(s);})();
```

Replace the URL with your hosted file. The page's CSP may block injected scripts or inline styles; see the next section.

### CSP and nonces

Some sites use a Content Security Policy that blocks inline styles or external scripts. If `style-src` does not allow `'unsafe-inline'`, give the generated `<style>` element the page's nonce.

Set the config **before** loading Laibery:

```html
<script nonce="abc123">
  window.__LAIBERY_CONFIG__ = { nonce: 'abc123' };
</script>
<script nonce="abc123" src="/laibery.js"></script>
```

The script tag also needs a nonce when `script-src` requires one. The generated stylesheet is created with:

```html
<style id="laibery-styles" nonce="abc123" data-laibery="0.2.0">…</style>
```

You can also set it from JavaScript before the first scan:

```js
Laibery.config({ nonce: 'abc123' });
```

For CSP, prefer setting `window.__LAIBERY_CONFIG__` before loading the file, because the style element is created during auto-start. If the page blocks inline scripts entirely, put the config in an allowed external script that runs before `laibery.js`.

## Overriding earlier site CSS

This is the part that makes Laibery usable on pages you do not own. Suppose the site already has:

```html
<style>
  .card {
    border: 1px dashed #94a3b8;
    background: #ffe4e6;
  }
</style>

<div class="card">Site styling</div>
```

Add Laibery classes to the same element:

```html
<div class="card b$3$s$primary bg$surface">
  Laibery styling
</div>
```

Laibery generates:

```css
[class~="b$3$s$primary"] {
  border-width: 3px !important;
  border-style: solid !important;
  border-color: var(--lb-primary) !important;
}
[class~="bg$surface"] {
  background-color: var(--lb-surface) !important;
}
```

The `!important` declarations beat the site's normal `.card` declarations even though `.card` and `[class~="…"]` have the same specificity. Laibery also keeps its `<style id="laibery-styles">` element after the site's own styles, so when both sides use `!important` at the same specificity, Laibery wins on document order. A site `!important` rule with higher specificity (for example `#app .card`) still wins.

What the runtime does to keep that guarantee:

1. Appends the generated stylesheet at the end of `<body>` (or `<head>`/`<html>` if there is no body).
2. Watches for new `<style>` and `<link>` elements and moves the Laibery sheet after them.
3. Recreates the sheet if a script or framework removes it.
4. Reuses the same `<style id="laibery-styles">` element instead of creating a new one on every update.

Turn the override behavior off when you do not want `!important` declarations:

```js
Laibery.config({ important: false });
```

That removes `!important` from every generated declaration, so a site rule with higher specificity can win again. The generated sheet still stays last, so a same-specificity tie still goes to Laibery.

### Override caveats

- A site's **inline** `style="... !important"` still wins over a stylesheet `!important`. Nothing in a stylesheet can beat that.
- A site `!important` rule with higher specificity than Laibery's `[class~="…"]` selector (for example `#app .card`) still wins, even if Laibery's sheet is later. Keep that site rule class-level or remove it if you need to beat it.
- A site stylesheet that also uses `!important` **and** is inserted after Laibery is handled by moving the Laibery sheet last, but a page can still deliberately re-insert CSS later; Laibery will move itself again on the next mutation.
- If the page uses a strict CSP, configure the nonce as described above, otherwise the browser will block the generated stylesheet.
- Laibery only observes the normal document. It does not scan inside Shadow DOM roots.
- CSS cascade layers can change `!important` ordering. Most sites do not use them; if the site does, test its layered rules specifically.
- `!important` affects only declarations generated by Laibery. It does not touch the site's stylesheet.

## Syntax

```
[variant: ...] property $ value [ $ value ... ]
```

Examples:

| Class | Meaning |
| --- | --- |
| `b$2$s$red` | border: width 2px, style solid, color red |
| `p$16` | padding: 16px |
| `p$8$16` | padding: 8px 16px |
| `bg$primary` | background-color: var(--lb-primary) |
| `hover:bg$primary-dark` | background on hover |
| `md:cols$3` | 3-column grid from 768px up |
| `md:hover:b$2$s$primary` | border on hover, from 768px up |
| `dark:bg$dark` | dark background inside an element with `class="dark"` |

Every utility token **must contain `$`**. Classes without `$` are ignored, so Laibery can live next to your own class names.

<details>
<summary><strong>Why <code>$</code>?</strong></summary>

`:` is already used for variants (`hover:`, `md:`), and `$` is a legal character in HTML class names. Laibery generates selectors as `[class~="b$2$s$red"]`, so neither `$` nor `:` needs escaping, and every rule has normal class-like specificity `(0,1,0)`.

</details>

The parser splits the token at the **first** `$`. That means values may contain `:` — useful for URLs:

```html
<div class="background-image$url(https://example.com/a.png)"></div>
```

Quotes are allowed too, as long as the surrounding HTML attribute uses different quotes:

```html
<div class='content$"hello"'></div>
```

## Values

Values are short by design — class names cannot contain spaces.

| You write | You get |
| --- | --- |
| `p$16`, `w$240` | bare numbers become **px** |
| `m$-8` | negative values are fine (`-8px`) |
| `w$50pct` or `w$50%` | percentages (`pct` avoids `%` in class names) |
| `fz$1.25rem`, `h$80vh` | any CSS length unit passes through |
| `w$full` | `100%` |
| `h$screen` | `100vh` (`w$screen` → `100vw`) |
| `w$fit`, `w$min`, `w$max` | `fit-content`, `min-content`, `max-content` |
| `mx$auto` | `auto` |
| `bg$ff0000` | `#ff0000` (3, 4, 6, or 8 digit hex, `#` optional) |
| `bg$primary` | `var(--lb-primary)` — palette color |
| `op$50` | `0.5` (opacity treats integers as percentages) |
| `cols$3` | `repeat(3, minmax(0, 1fr))` |
| `gap$8$16` | `8px 16px` |
| `ar$16$9` | `16 / 9` |

Supported length units: `px rem em % vh vw vmin vmax ch ex pt pc cm mm in q deg turn rad fr`, plus `pct`.
CSS functions without spaces are allowed: `var(--x)`, `calc(100%/3)`, `min(100%,30rem)`, ….

Each individual value must not contain whitespace, `;`, `{`, `}`, `<`, `>`, or `\`. `$` separates values. Colons, quotes, `/`, and parentheses are allowed, so URLs and functions work:

```html
<div class="background-image$url(https://example.com/a.png)"></div>
<div class="transform$rotate(45deg)"></div>
```

## Property reference

### Curated short aliases

These are the hand-tuned Laibery shortcuts. They stay short and are the recommended API for everyday use. Full CSS property names also work.

#### Layout

| Key | Example | CSS |
| --- | --- | --- |
| `d` | `d$flex`, `d$grid`, `d$none` | `display` |
| `pos` | `pos$sticky`, `pos$absolute` | `position` |
| `top` `right` `bottom` `left` | `top$0`, `left$24` | inset properties |
| `z` | `z$10` | `z-index` |
| `float` | `float$left` | `float` |
| `ar` | `ar$16$9` | `aspect-ratio` |
| `ov` `ovx` `ovy` | `ov$hidden`, `ovx$auto` | `overflow` / `overflow-x` / `overflow-y` |

Display aliases: `f` flex, `g` grid, `b` block, `ib` inline-block, `i` inline, `n` none, `if` inline-flex, `ig` inline-grid, `t` table, `tc` table-cell, `li` list-item, `c` contents, `fr` flow-root. Full words also work.

#### Flex and grid

| Key | Example | CSS |
| --- | --- | --- |
| `flex` | `flex$1` | `flex` |
| `grow` / `shrink` | `grow$1`, `shrink$0` | `flex-grow` / `flex-shrink` |
| `order` | `order$2` | `order` |
| `fd` | `fd$col` | `flex-direction` (`r`, `c`, `rr`, `cr`) |
| `wrap` | `wrap$wrap`, `wrap$nowrap` | `flex-wrap` |
| `justify` | `justify$sb`, `justify$c` | `justify-content` |
| `items` | `items$c`, `items$fs` | `align-items` |
| `self` | `self$e` | `align-self` |
| `gap` | `gap$16`, `gap$8$16` | `gap` |
| `gapx` / `gapy` | `gapx$24` | `column-gap` / `row-gap` |
| `cols` / `rows` | `cols$3`, `rows$2` | `grid-template-columns` / `-rows` |

Alignment aliases: `c` center, `s` start, `e` end, `fs` flex-start, `fe` flex-end, `sb` space-between, `sa` space-around, `se` space-evenly, `st` stretch, `b` baseline. Full words like `space-between` also work.

`cols$3` becomes `repeat(3, minmax(0, 1fr))`. Multiple values are literal tracks: `cols$200px$1fr` → `200px 1fr`, `cols$1$2` → `1fr 2fr`.

#### Size and spacing

| Key | Example | CSS |
| --- | --- | --- |
| `w` `h` | `w$full`, `h$screen` | `width` / `height` |
| `minw` `maxw` | `minw$320`, `maxw$960` | min/max width |
| `minh` `maxh` | `minh$100pct`, `maxh$80vh` | min/max height |
| `p` `px` `py` `pt` `pr` `pb` `pl` | `p$16`, `p$8$16`, `px$24` | padding |
| `m` `mx` `my` `mt` `mr` `mb` `ml` | `m$16`, `mx$auto`, `m$-8` | margin |

`p` and `m` accept 1–4 values like CSS shorthands. `mx`/`my` set both sides.

#### Typography

| Key | Example | CSS |
| --- | --- | --- |
| `fz` | `fz$16` | `font-size` |
| `fw` | `fw$bold`, `fw$600` | `font-weight` |
| `ff` | `ff$sans`, `ff$mono` | `font-family` |
| `fi` | `fi$italic` | `font-style` |
| `lh` | `lh$1.5`, `lh$24` | `line-height` (`24` → `24px`, `1.5` → unitless) |
| `ls` | `ls$1` | `letter-spacing` |
| `ta` | `ta$c` | `text-align` |
| `td` | `td$u`, `td$n` | `text-decoration` |
| `tt` | `tt$u` | `text-transform` |
| `ws` | `ws$nowrap` | `white-space` |
| `c` | `c$primary`, `c$ff0000` | `color` |
| `bg` | `bg$surface`, `bg$primary` | `background-color` |

Weight aliases: `thin` 100, `extralight` 200, `light` 300, `normal`/`n` 400, `medium`/`m` 500, `semibold`/`sb` 600, `bold`/`b` 700, `extrabold`/`eb` 800, `black` 900.

#### Borders and radius

| Key | Example | CSS |
| --- | --- | --- |
| `b` | `b$2$s$red` | all four sides |
| `bx` / `by` | `bx$1$d$primary` | left+right / top+bottom |
| `bt` `bb` `bl` `br` | `bt$1$s$border` | one side (`br` = **border-right**) |
| `bw` | `bw$2` | `border-width` |
| `bst` | `bst$dashed` | `border-style` |
| `bc` | `bc$primary` | `border-color` |
| `r` | `r$12`, `r$full`, `r$8$8$0$0` | `border-radius` |
| `r-tl` `r-tr` `r-br` `r-bl` | `r-tl$8` | one corner |

Border values are classified by type, in any order:

- a number or length → width (`2` → `2px`, also `thin`, `medium`, `thick`)
- a style keyword → style (`s` solid, `d` dashed, `dt` dotted, `db` double, `g` groove, `r` ridge, `i` inset, `o` outset, `n` none, `h` hidden)
- anything else → color

So `b$2$s$red`, `b$red$2$s`, and `b$s$red$2` are equivalent. Remember that a visible border needs a style — use `b$2$s$red`, not just `b$2$red`.

> **`br` is border-right.** Radius uses `r`. This avoids the classic border/radius naming clash.

#### Effects and misc

| Key | Example | CSS |
| --- | --- | --- |
| `op` | `op$50` | `opacity` (`50` → `0.5`) |
| `sh` | `sh$sm`, `sh$md`, `sh$lg`, `sh$xl` | `box-shadow` |
| `tr` | `tr$200`, `tr$300$inout`, `tr$none` | `transition` |
| `cur` | `cur$p` | `cursor` |
| `pe` | `pe$none` | `pointer-events` |
| `sel` | `sel$none` | `user-select` |

Cursor aliases: `p` pointer, `d` default, `t` text, `na` not-allowed, `m` move, `g` grab, `gr` grabbing, `h` help, `w` wait, `c` crosshair, `z` zoom-in, `cp` copy.

### Full CSS property map

Laibery also recognizes all **520** properties from the CSS property alias map, using either the full property name or the map's short alias:

```html
<!-- full property name -->
<div class="background-color$primary border-width$2 a-i$center">...</div>

<!-- map alias -->
<div class="b-t$1px$solid$red margin-left$20 z-i$10">...</div>
```

Every full property name and map alias is available, apart from the three deliberate conflicts below. For example, `align-items`, `a-i`, and the curated `items` all work. Values are validated by type where Laibery knows the property (colors, lengths, enums), and passed through as a safe raw value otherwise.

**[Browse the searchable documentation for all 520 properties →](docs/index.html)** · [Markdown table](docs/aliases.md)

#### Naming conflicts with the map

The map is a suggestion list, not a replacement for Laibery's curated API. Three names conflict deliberately:

| Map alias | Map meaning | Laibery meaning | Use this for the map meaning |
| --- | --- | --- | --- |
| `d` | SVG `d` | `display` | `svg-d$M0,0L10,10` |
| `r` | SVG `r` | `border-radius` | `svg-r$10` |
| `z` | `zoom` | `z-index` | `zoom$1.5` |

The full property names `zoom`, `z-index`, and the aliases `svg-d` / `svg-r` are all available. Curated aliases always take priority, so `d$grid` is display, not an SVG path.

## Variants

Put variants before the property, separated by `:`.

### Pseudo-classes

`hover` `focus` `focus-visible` `focus-within` `active` `visited` `disabled` `checked` `required` `invalid` `empty` `first` `last` `only` `odd` `even`

```html
<button class="bg$primary hover:bg$primary-dark focus:b$2$s$primary">Save</button>
```

### Breakpoints

| Variant | Min-width |
| --- | --- |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

```html
<div class="cols$1 md:cols$2 lg:cols$3">...</div>
```

Combine them in any order:

```html
<div class="md:hover:b$2$s$primary">...</div>
```

### Dark mode

`dark:` targets descendants of an element with `class="dark"`:

```html
<html class="dark">
  <body class="bg$light dark:bg$dark">
    <div class="bg$surface dark:bg$dark dark:c$white">...</div>
  </body>
</html>
```

Toggle the `dark` class however you like; no extra setup is needed.

## Theme

Every palette color becomes a CSS variable:

| Name | Default |
| --- | --- |
| `primary` | `#3b82f6` |
| `primary-dark` | `#1d4ed8` |
| `secondary` | `#64748b` |
| `success` | `#16a34a` |
| `danger` | `#dc2626` |
| `warning` | `#d97706` |
| `info` | `#0891b2` |
| `light` | `#f8fafc` |
| `dark` | `#0f172a` |
| `muted` | `#64748b` |
| `border` | `#e2e8f0` |
| `surface` | `#ffffff` |
| `text` | `#0f172a` |

Override them at runtime:

```js
Laibery.theme({
  primary: '#7c3aed',
  'primary-dark': '#6d28d9',
  surface: '#fffdf7'
});
```

This updates `--lb-primary`, `--lb-primary-dark`, `--lb-surface`, and every utility that references them.

You can also add new palette names — call this before the page renders so utilities generated later use the variable:

```js
Laibery.theme({ brand: '#123456' });
// now: bg$brand, c$brand, b$1$s$brand
```

Theme keys are case-insensitive.

The stylesheet also defines:

- `--lb-shadow-sm|md|lg|xl` — used by `sh$*`
- `--lb-font-sans|serif|mono` — used by `ff$sans|serif|mono`
- `box-sizing: border-box` on all elements

If you need different shadows or font stacks, override those variables in your own CSS.

## Cascade and ordering

Rules are sorted deterministically, not by the order classes appear in the DOM:

1. breakpoint tier — base, then `sm`, `md`, `lg`, `xl`, `2xl`
2. property priority — e.g. `p` before `px`/`py` before `pt`/`pr`/`pb`/`pl`
3. token name — final stable tiebreaker

That means a more specific utility always wins, regardless of markup order:

```html
<div class="pt$8 p$16">top padding is 8px, other sides 16px</div>
<div class="b$2$s$red bt$1$s$border">1px top border, 2px others</div>
<div class="r$12 r-tl$0">12px radius, square top-left corner</div>
```

Pseudo variants have higher CSS specificity, so `hover:bg$primary` beats `bg$surface` on hover without extra work. `dark:` adds an ancestor class, so it also outranks the base utility.

Laibery uses `[class~="..."]` selectors — specificity `(0,1,0)`, the same as a single class. To beat earlier site CSS, generated declarations use `!important` by default and the stylesheet is kept last:

```js
Laibery.config({ important: false }); // opt out of !important
```

Even without `!important`, the sheet stays last, so same-specificity ties still favor Laibery; higher-specificity site rules win.

## JavaScript API

The script auto-starts. To control it manually, disable auto-start before loading:

```html
<script>window.__LAIBERY_MANUAL__ = true;</script>
<script src="laibery.js"></script>
<script>Laibery.start();</script>
```

| Method | Description |
| --- | --- |
| `Laibery.start()` | Scan the document and observe changes (idempotent) |
| `Laibery.stop()` | Disconnect the MutationObserver |
| `Laibery.add(...classes)` | Register tokens immediately, even if not in the DOM |
| `Laibery.preview(token)` | Return the CSS for one token, or `null` if invalid |
| `Laibery.css()` | Return the complete generated stylesheet as a string |
| `Laibery.theme({ ... })` | Update palette colors and re-render variables |
| `Laibery.define(key, priority, build)` | Add a custom property |
| `Laibery.config(options)` | Read or set `important` / `nonce` |
| `Laibery.version` | Current version string |

### Configuration

```js
// Read current settings
Laibery.config(); // { important: true, nonce: '' }

// Override earlier site CSS (default)
Laibery.config({ important: true });

// Use normal cascade, without !important
Laibery.config({ important: false });

// CSP nonce for the generated <style> element
Laibery.config({ nonce: 'abc123' });
```

For best results with CSP, set the nonce before the library starts:

```html
<script>window.__LAIBERY_CONFIG__ = { important: true, nonce: 'abc123' };</script>
<script src="laibery.js"></script>
```

```js
// Pre-generate rules for classes you will add later
Laibery.add('p$24 b$2$s$primary md:cols$3');

// Inspect what a class produces
Laibery.preview('b$2$s$red');
// [class~="b$2$s$red"]{border-width:2px!important;border-style:solid!important;border-color:red!important}
```

### Custom properties

```js
Laibery.define('trbl', 200, function (values) {
  return [
    ['transform', 'translate(' + values[0] + 'px,' + values[1] + 'px)']
  ];
});

// <div class="trbl$10$20">
```

`define` receives the values as an array of strings and must return an array of `[cssProperty, cssValue]` pairs, or `null` for invalid input. Lower priority numbers render earlier; custom properties default to `200`. Tokens using the new key that were previously ignored are re-scanned automatically.

`define` is JavaScript code you write. Validate any untrusted value before returning it as CSS.

## How it works

1. Scans every `class` in the document for tokens containing `$`.
2. Parses `variant:property$value$value`, validates it, and produces declarations.
3. Deduplicates tokens and inserts the generated rules into a single `<style id="laibery-styles">`.
4. Appends that style element at the end of the document so it follows the site's CSS, and moves it again when the site adds new styles.
5. Watches for added elements, changed `class` attributes, and removed/replaced style elements with a `MutationObserver`.
6. Batches new rules in a microtask and rebuilds the stylesheet in sorted order.

Only tokens you actually use generate CSS. Rules for removed elements stay in memory (and in the stylesheet) until the page reloads — cheap, since each rule is tiny.

## Limitations

- Values cannot contain spaces, because they are class-name tokens. Use the built-in aliases or functions without spaces (`calc(100%/3)` works; `calc(100% - 3px)` does not).
- Runtime only: there is no static extraction, SSR stylesheet, or build-time purging yet.
- JavaScript is required; the page has no styles until Laibery runs.
- No automatic vendor prefixing.
- Override behavior relies on `!important` plus stylesheet order. A site's inline `style="... !important"` still wins, a site `!important` rule with higher specificity still wins, and a site using CSS cascade layers with `!important` should be tested. With `important: false`, same-specificity ties still favor Laibery because the sheet stays last; higher-specificity site rules win.
- Strict CSP needs a nonce as described above.
- Shadow DOM is not scanned; only the main document is observed.
- Rules accumulate until reload; there is no automatic cleanup for tokens no longer in the DOM.
- `dark:` is class-based (`.dark` ancestor), not `prefers-color-scheme`.
- Variants cover pseudo-classes, breakpoints, and `dark:`; there are no `@supports` or container-query variants yet.

## Development

```bash
npm test          # library + docs tests
npm run test:docs # docs coverage only
npm run docs      # rebuild docs/index.html, classes.json, llms.txt and llms-full.txt
```

The test suite runs in Node without a DOM and covers parsing, values, variants, sorting, theme updates, custom properties, `!important`, and config. The docs test checks that all 520 properties are documented, every example parses, every anchor exists, and the AI files are complete.

Project layout:

```
laibery.js             the library (UMD, no dependencies)
demo/index.html        self-styled demo + playground + override example
docs/index.html        searchable documentation route for every class
docs/aliases.md        all 520 CSS properties and examples
docs/classes.json      structured class data for tools and AI
docs/llms.txt          short AI-readable index
docs/llms-full.txt     full AI-readable documentation
docs/css-property-alias-map.txt  source map used to build the docs
scripts/build-docs.js  docs generator
test/laibery.test.js   runtime test suite
test/docs.test.js      documentation coverage test
package.json
README.md
LICENSE
```

To view the demo and docs, open the HTML files directly, or serve the folder:

```bash
python -m http.server 4173
# http://127.0.0.1:4173/demo/index.html
# http://127.0.0.1:4173/docs/
```

## Browser support

Modern Chrome, Edge, Firefox, and Safari. Laibery needs `MutationObserver`, CSS variables, `Element.isConnected`, and `[class~="…"]` selectors.

## License

MIT
