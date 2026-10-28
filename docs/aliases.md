# Laibery — full CSS property reference

This page lists every CSS property from the alias map Laibery ships with: **520 properties**.
Every property is available by full name or map alias, except the three deliberate conflicts below.

Canonical documentation: [docs/](index.html) · Machine-readable: [classes.json](classes.json) · AI index: [llms.txt](llms.txt)

```html
<!-- full property name -->
<div class="background-color$primary border-width$2">...</div>

<!-- map alias -->
<div class="a-i$center b-t$1px$solid$red">...</div>
```

## Read this first

### Value rules

- `$` separates the property from its values; use another `$` for each value of a shorthand.
- Bare numbers become **px** for length properties: `margin$16` → `16px`.
- `pct` becomes `%`: `width$50pct` → `50%`.
- Palette names become theme variables: `color$primary` → `var(--lb-primary)`.
- Hex colors may omit `#`: `color$ff0000` → `#ff0000`.
- People often use a short curated alias instead: `p$16`, `bg$surface`, `b$2$s$red`.
- Every row includes a working example. Very new or form-specific properties may accept additional values; treat the example as a starting point.
- Values cannot contain spaces, `;`, `{`, `}`, `<`, `>`, or `\`. `$` separates values; colons and quotes are allowed, so URLs work:
  `background-image$url(https://example.com/a.png)`.

### Override behavior

Generated declarations include `!important` by default, and the stylesheet is kept after the
site's own CSS. That means Laibery classes beat normal CSS the page wrote earlier. Turn it off with:

```js
Laibery.config({ important: false });
```

That removes `!important` from generated declarations. The sheet still stays last, so same-specificity ties still favor Laibery; higher-specificity site rules win.

A site `!important` rule with higher specificity (for example `#app .card`) still wins. Laibery's `!important` beats normal declarations and wins later-order ties at the same specificity.

### Deliberate naming conflicts

| Map alias | Map property | Laibery uses | Use this instead |
| --- | --- | --- | --- |
| `d` | SVG `d` | `d` = `display` | `svg-d$M0,0L10,10` |
| `r` | SVG `r` | `r` = `border-radius` | `svg-r$10` |
| `z` | `zoom` | `z` = `z-index` | `zoom$1.5` |

The full property names `zoom`, `z-index`, and the extra aliases `svg-d` / `svg-r` are all available.

### Curated aliases that differ from the map

These are hand-tuned Laibery shortcuts. They take priority over the map alias of the same name.

| Curated | CSS property | Example |
| --- | --- | --- |
| `d` | display | `d$flex` |
| `pos` | position | `pos$sticky` |
| `top` `right` `bottom` `left` | top / right / bottom / left | `top$0` |
| `z` | z-index | `z$10` |
| `float` | float | `float$left` |
| `ar` | aspect-ratio | `ar$16$9` |
| `ov` `ovx` `ovy` | overflow / overflow-x / overflow-y | `ov$hidden` |
| `flex` | flex | `flex$1` |
| `grow` `shrink` | flex-grow / flex-shrink | `grow$1` |
| `order` | order | `order$2` |
| `fd` | flex-direction | `fd$col` |
| `wrap` | flex-wrap | `wrap$wrap` |
| `justify` | justify-content | `justify$sb` |
| `items` | align-items | `items$c` |
| `self` | align-self | `self$e` |
| `gap` | gap | `gap$16` |
| `gapx` `gapy` | column-gap / row-gap | `gapx$24` |
| `cols` `rows` | grid-template-columns / grid-template-rows | `cols$3` |
| `w` `h` | width / height | `w$full` |
| `minw` `maxw` | min-width / max-width | `maxw$960` |
| `minh` `maxh` | min-height / max-height | `maxh$80vh` |
| `p` `px` `py` `pt` `pr` `pb` `pl` | padding | `p$8$16` |
| `m` `mx` `my` `mt` `mr` `mb` `ml` | margin | `m$16` |
| `fz` | font-size | `fz$16` |
| `fw` | font-weight | `fw$bold` |
| `ff` | font-family | `ff$sans` |
| `fi` | font-style | `fi$italic` |
| `lh` | line-height | `lh$1.5` |
| `ls` | letter-spacing | `ls$1` |
| `ta` | text-align | `ta$c` |
| `td` | text-decoration | `td$u` |
| `tt` | text-transform | `tt$u` |
| `ws` | white-space | `ws$nowrap` |
| `c` | color | `c$primary` |
| `bg` | background-color | `bg$surface` |
| `b` | border | `b$2$s$red` |
| `bx` `by` | left+right / top+bottom border | `bx$1$d$primary` |
| `bt` `bb` `bl` `br` | border-top / bottom / left / right | `bt$1$s$border` |
| `bw` `bst` `bc` | border-width / border-style / border-color | `bc$primary` |
| `r` | border-radius | `r$12` |
| `r-tl` `r-tr` `r-br` `r-bl` | one border-radius corner | `r-tl$0` |
| `op` | opacity | `op$50` |
| `sh` | box-shadow | `sh$md` |
| `tr` | transition | `tr$200` |
| `cur` | cursor | `cur$p` |
| `pe` | pointer-events | `pe$none` |
| `sel` | user-select | `sel$none` |

## All 520 properties

| Alias | CSS property | Example |
| --- | --- | --- |
| `accent-color` | `accent-color` | `accent-color$primary` |
| `align-content` | `align-content` | `align-content$center` |
| `a-i` | `align-items` | `a-i$center` |
| `align-self` | `align-self` | `align-self$center` |
| `a-b` | `alignment-baseline` | `a-b$middle` |
| `all` | `all` | `all$unset` |
| `anchor-name` | `anchor-name` | `anchor-name$--my-anchor` |
| `anchor-scope` | `anchor-scope` | `anchor-scope$all` |
| `animation` | `animation` | `animation$fade$1s` |
| `animation-composition` | `animation-composition` | `animation-composition$replace` |
| `animation-delay` | `animation-delay` | `animation-delay$100ms` |
| `animation-direction` | `animation-direction` | `animation-direction$alternate` |
| `animation-duration` | `animation-duration` | `animation-duration$1s` |
| `a-f-m` | `animation-fill-mode` | `a-f-m$both` |
| `a-i-c` | `animation-iteration-count` | `a-i-c$infinite` |
| `animation-name` | `animation-name` | `animation-name$fade` |
| `a-p-s` | `animation-play-state` | `a-p-s$paused` |
| `animation-range` | `animation-range` | `animation-range$entry$50pct$exit$50pct` |
| `a-r-e` | `animation-range-end` | `a-r-e$exit$50pct` |
| `a-r-s` | `animation-range-start` | `a-r-s$entry$50pct` |
| `a-t` | `animation-timeline` | `a-t$scroll()` |
| `a-t-f` | `animation-timing-function` | `a-t-f$ease-in-out` |
| `appearance` | `appearance` | `appearance$none` |
| `aspect-ratio` | `aspect-ratio` | `aspect-ratio$16$9` |
| `b-f` | `backdrop-filter` | `b-f$blur(8px)` |
| `b-v` | `backface-visibility` | `b-v$hidden` |
| `background` | `background` | `background$primary` |
| `background-attachment` | `background-attachment` | `background-attachment$fixed` |
| `b-b-m` | `background-blend-mode` | `b-b-m$multiply` |
| `background-clip` | `background-clip` | `background-clip$padding-box` |
| `background-color` | `background-color` | `background-color$primary` |
| `background-image` | `background-image` | `background-image$url(https://example.com/a.png)` |
| `b-o` | `background-origin` | `b-o$content-box` |
| `b-p` | `background-position` | `b-p$16` |
| `b-p-x` | `background-position-x` | `b-p-x$center` |
| `b-p-y` | `background-position-y` | `b-p-y$center` |
| `background-repeat` | `background-repeat` | `background-repeat$no-repeat` |
| `b-r-x` | `background-repeat-x` | `b-r-x$no-repeat` |
| `b-r-y` | `background-repeat-y` | `b-r-y$no-repeat` |
| `background-size` | `background-size` | `background-size$16` |
| `baseline-shift` | `baseline-shift` | `baseline-shift$sub` |
| `baseline-source` | `baseline-source` | `baseline-source$first` |
| `block-size` | `block-size` | `block-size$16` |
| `border` | `border` | `border$1px$solid$red` |
| `border-block` | `border-block` | `border-block$1px$solid$red` |
| `border-block-color` | `border-block-color` | `border-block-color$primary` |
| `b-b-e` | `border-block-end` | `b-b-e$1px$solid$red` |
| `b-b-e-c` | `border-block-end-color` | `b-b-e-c$primary` |
| `b-b-e-s` | `border-block-end-style` | `b-b-e-s$solid` |
| `b-b-e-w` | `border-block-end-width` | `b-b-e-w$16` |
| `border-block-start` | `border-block-start` | `border-block-start$1px$solid$red` |
| `b-b-s-c` | `border-block-start-color` | `b-b-s-c$primary` |
| `b-b-s-s` | `border-block-start-style` | `b-b-s-s$solid` |
| `b-b-s-w` | `border-block-start-width` | `b-b-s-w$16` |
| `border-block-style` | `border-block-style` | `border-block-style$solid` |
| `border-block-width` | `border-block-width` | `border-block-width$16` |
| `border-bottom` | `border-bottom` | `border-bottom$1px$solid$red` |
| `border-bottom-color` | `border-bottom-color` | `border-bottom-color$primary` |
| `b-b-l-r` | `border-bottom-left-radius` | `b-b-l-r$16` |
| `b-b-r-r` | `border-bottom-right-radius` | `b-b-r-r$16` |
| `border-bottom-style` | `border-bottom-style` | `border-bottom-style$solid` |
| `border-bottom-width` | `border-bottom-width` | `border-bottom-width$16` |
| `border-collapse` | `border-collapse` | `border-collapse$collapse` |
| `border-color` | `border-color` | `border-color$primary` |
| `b-e-e-r` | `border-end-end-radius` | `b-e-e-r$16` |
| `b-e-s-r` | `border-end-start-radius` | `b-e-s-r$16` |
| `border-image` | `border-image` | `border-image$none` |
| `b-i-o` | `border-image-outset` | `b-i-o$4px` |
| `b-i-r` | `border-image-repeat` | `b-i-r$round` |
| `border-image-slice` | `border-image-slice` | `border-image-slice$30` |
| `border-image-source` | `border-image-source` | `border-image-source$none` |
| `border-image-width` | `border-image-width` | `border-image-width$16` |
| `border-inline` | `border-inline` | `border-inline$1px$solid$red` |
| `b-i-c` | `border-inline-color` | `b-i-c$primary` |
| `b-i-e` | `border-inline-end` | `b-i-e$1px$solid$red` |
| `b-i-e-c` | `border-inline-end-color` | `b-i-e-c$primary` |
| `b-i-e-s` | `border-inline-end-style` | `b-i-e-s$solid` |
| `b-i-e-w` | `border-inline-end-width` | `b-i-e-w$16` |
| `border-inline-start` | `border-inline-start` | `border-inline-start$1px$solid$red` |
| `b-i-s-c` | `border-inline-start-color` | `b-i-s-c$primary` |
| `b-i-s-s` | `border-inline-start-style` | `b-i-s-s$solid` |
| `b-i-s-w` | `border-inline-start-width` | `b-i-s-w$16` |
| `border-inline-style` | `border-inline-style` | `border-inline-style$solid` |
| `border-inline-width` | `border-inline-width` | `border-inline-width$16` |
| `b-l` | `border-left` | `b-l$1px$solid$red` |
| `b-l-c` | `border-left-color` | `b-l-c$primary` |
| `b-l-s` | `border-left-style` | `b-l-s$solid` |
| `b-l-w` | `border-left-width` | `b-l-w$16` |
| `border-radius` | `border-radius` | `border-radius$16` |
| `border-right` | `border-right` | `border-right$1px$solid$red` |
| `b-r-c` | `border-right-color` | `b-r-c$primary` |
| `b-r-s` | `border-right-style` | `b-r-s$solid` |
| `b-r-w` | `border-right-width` | `b-r-w$16` |
| `border-shape` | `border-shape` | `border-shape$circle(50%)` |
| `border-spacing` | `border-spacing` | `border-spacing$16` |
| `b-s-e-r` | `border-start-end-radius` | `b-s-e-r$16` |
| `b-s-s-r` | `border-start-start-radius` | `b-s-s-r$16` |
| `border-style` | `border-style` | `border-style$solid` |
| `b-t` | `border-top` | `b-t$1px$solid$red` |
| `b-t-c` | `border-top-color` | `b-t-c$primary` |
| `b-t-l-r` | `border-top-left-radius` | `b-t-l-r$16` |
| `b-t-r-r` | `border-top-right-radius` | `b-t-r-r$16` |
| `b-t-s` | `border-top-style` | `b-t-s$solid` |
| `b-t-w` | `border-top-width` | `b-t-w$16` |
| `b-w` | `border-width` | `b-w$16` |
| `bottom` | `bottom` | `bottom$16` |
| `b-d-b` | `box-decoration-break` | `b-d-b$clone` |
| `box-shadow` | `box-shadow` | `box-shadow$0$0$10px$primary` |
| `box-sizing` | `box-sizing` | `box-sizing$border-box` |
| `break-after` | `break-after` | `break-after$page` |
| `break-before` | `break-before` | `break-before$page` |
| `break-inside` | `break-inside` | `break-inside$avoid` |
| `caption-side` | `caption-side` | `caption-side$bottom` |
| `caret` | `caret` | `caret$primary$bar` |
| `c-a` | `caret-animation` | `c-a$auto` |
| `caret-color` | `caret-color` | `caret-color$primary` |
| `caret-shape` | `caret-shape` | `caret-shape$bar` |
| `clear` | `clear` | `clear$both` |
| `clip` | `clip` | `clip$rect(0,0,10px,10px)` |
| `c-p` | `clip-path` | `c-p$circle(50%)` |
| `clip-rule` | `clip-rule` | `clip-rule$evenodd` |
| `color` | `color` | `color$primary` |
| `color-interpolation` | `color-interpolation` | `color-interpolation$sRGB` |
| `c-i-f` | `color-interpolation-filters` | `c-i-f$sRGB` |
| `color-scheme` | `color-scheme` | `color-scheme$dark` |
| `column-count` | `column-count` | `column-count$2` |
| `c-f` | `column-fill` | `c-f$balance` |
| `c-g` | `column-gap` | `c-g$16` |
| `c-h` | `column-height` | `c-h$200px` |
| `column-rule` | `column-rule` | `column-rule$1px$solid$red` |
| `c-r-c` | `column-rule-color` | `c-r-c$primary` |
| `column-rule-style` | `column-rule-style` | `column-rule-style$solid` |
| `c-r-w` | `column-rule-width` | `c-r-w$16` |
| `column-span` | `column-span` | `column-span$all` |
| `column-width` | `column-width` | `column-width$16` |
| `column-wrap` | `column-wrap` | `column-wrap$wrap` |
| `columns` | `columns` | `columns$2` |
| `contain` | `contain` | `contain$layout` |
| `c-i-b-s` | `contain-intrinsic-block-size` | `c-i-b-s$100px` |
| `c-i-h` | `contain-intrinsic-height` | `c-i-h$100px` |
| `c-i-i-s` | `contain-intrinsic-inline-size` | `c-i-i-s$100px` |
| `c-i-s` | `contain-intrinsic-size` | `c-i-s$100px` |
| `c-i-w` | `contain-intrinsic-width` | `c-i-w$16` |
| `container` | `container` | `container$card$inline-size` |
| `c-n` | `container-name` | `c-n$card` |
| `c-t` | `container-type` | `c-t$inline-size` |
| `content` | `content` | `content$'hello'` |
| `c-v` | `content-visibility` | `c-v$auto` |
| `c-b-e-s` | `corner-block-end-shape` | `c-b-e-s$round` |
| `c-b-s-s` | `corner-block-start-shape` | `c-b-s-s$round` |
| `c-b-l-s` | `corner-bottom-left-shape` | `c-b-l-s$round` |
| `c-b-r-s` | `corner-bottom-right-shape` | `c-b-r-s$round` |
| `c-b-s` | `corner-bottom-shape` | `c-b-s$round` |
| `c-e-e-s` | `corner-end-end-shape` | `c-e-e-s$round` |
| `c-e-s-s` | `corner-end-start-shape` | `c-e-s-s$round` |
| `c-i-e-s` | `corner-inline-end-shape` | `c-i-e-s$round` |
| `c-i-s-s` | `corner-inline-start-shape` | `c-i-s-s$round` |
| `c-l-s` | `corner-left-shape` | `c-l-s$round` |
| `corner-right-shape` | `corner-right-shape` | `corner-right-shape$round` |
| `corner-shape` | `corner-shape` | `corner-shape$round` |
| `c-s-e-s` | `corner-start-end-shape` | `c-s-e-s$round` |
| `c-s-s-s` | `corner-start-start-shape` | `c-s-s-s$round` |
| `c-t-l-s` | `corner-top-left-shape` | `c-t-l-s$round` |
| `c-t-r-s` | `corner-top-right-shape` | `c-t-r-s$round` |
| `c-t-s` | `corner-top-shape` | `c-t-s$round` |
| `counter-increment` | `counter-increment` | `counter-increment$item` |
| `counter-reset` | `counter-reset` | `counter-reset$item` |
| `counter-set` | `counter-set` | `counter-set$item$1` |
| `cursor` | `cursor` | `cursor$pointer` |
| `cx` | `cx` | `cx$16` |
| `cy` | `cy` | `cy$16` |
| `d` | `d` **Laibery `d` is display; use `svg-d` for the map meaning.** | `svg-d$M0,0L10,10` |
| `direction` | `direction` | `direction$ltr` |
| `display` | `display` | `display$flex` |
| `d-b` | `dominant-baseline` | `d-b$middle` |
| `d-r-l` | `dynamic-range-limit` | `d-r-l$standard` |
| `e-c` | `empty-cells` | `e-c$hide` |
| `field-sizing` | `field-sizing` | `field-sizing$content` |
| `fill` | `fill` | `fill$primary` |
| `fill-opacity` | `fill-opacity` | `fill-opacity$0.5` |
| `f-r` | `fill-rule` | `f-r$evenodd` |
| `filter` | `filter` | `filter$blur(4px)` |
| `flex` | `flex` | `flex$1` |
| `f-b` | `flex-basis` | `f-b$16` |
| `f-d` | `flex-direction` | `f-d$column` |
| `flex-flow` | `flex-flow` | `flex-flow$row$wrap` |
| `f-g` | `flex-grow` | `f-g$1` |
| `flex-shrink` | `flex-shrink` | `flex-shrink$0` |
| `flex-wrap` | `flex-wrap` | `flex-wrap$wrap` |
| `float` | `float` | `float$left` |
| `f-c` | `flood-color` | `f-c$primary` |
| `flood-opacity` | `flood-opacity` | `flood-opacity$0.5` |
| `font` | `font` | `font$16px$sans-serif` |
| `font-family` | `font-family` | `font-family$sans-serif` |
| `f-f-s` | `font-feature-settings` | `f-f-s$'liga'$1` |
| `f-k` | `font-kerning` | `f-k$normal` |
| `f-l-o` | `font-language-override` | `f-l-o$'ENG'` |
| `f-o-s` | `font-optical-sizing` | `f-o-s$none` |
| `f-p` | `font-palette` | `f-p$dark` |
| `font-size` | `font-size` | `font-size$16` |
| `f-s-a` | `font-size-adjust` | `f-s-a$0.5` |
| `font-stretch` | `font-stretch` | `font-stretch$condensed` |
| `font-style` | `font-style` | `font-style$italic` |
| `font-synthesis` | `font-synthesis` | `font-synthesis$none` |
| `f-s-p` | `font-synthesis-position` | `f-s-p$none` |
| `f-s-s-c` | `font-synthesis-small-caps` | `f-s-s-c$none` |
| `f-s-s` | `font-synthesis-style` | `f-s-s$none` |
| `f-s-w` | `font-synthesis-weight` | `f-s-w$none` |
| `f-v` | `font-variant` | `f-v$small-caps` |
| `f-v-a` | `font-variant-alternates` | `f-v-a$historical-forms` |
| `f-v-c` | `font-variant-caps` | `f-v-c$small-caps` |
| `f-v-e-a` | `font-variant-east-asian` | `f-v-e-a$ruby` |
| `f-v-e` | `font-variant-emoji` | `f-v-e$emoji` |
| `f-v-l` | `font-variant-ligatures` | `f-v-l$none` |
| `f-v-n` | `font-variant-numeric` | `f-v-n$tabular-nums` |
| `f-v-p` | `font-variant-position` | `f-v-p$super` |
| `f-v-s` | `font-variation-settings` | `f-v-s$'wght'$700` |
| `font-weight` | `font-weight` | `font-weight$bold` |
| `font-width` | `font-width` | `font-width$16` |
| `f-c-a` | `forced-color-adjust` | `f-c-a$none` |
| `gap` | `gap` | `gap$16` |
| `grid` | `grid` | `grid$none` |
| `g-a` | `grid-area` | `g-a$1/2/3/4` |
| `g-a-c` | `grid-auto-columns` | `g-a-c$1fr` |
| `g-a-f` | `grid-auto-flow` | `g-a-f$row` |
| `g-a-r` | `grid-auto-rows` | `g-a-r$auto` |
| `g-c` | `grid-column` | `g-c$1/3` |
| `g-c-e` | `grid-column-end` | `g-c-e$3` |
| `g-c-s` | `grid-column-start` | `g-c-s$1` |
| `g-r` | `grid-row` | `g-r$1/3` |
| `g-r-e` | `grid-row-end` | `g-r-e$3` |
| `g-r-s` | `grid-row-start` | `g-r-s$1` |
| `g-t` | `grid-template` | `g-t$1fr$/$1fr` |
| `g-t-a` | `grid-template-areas` | `g-t-a$none` |
| `g-t-c` | `grid-template-columns` | `g-t-c$3` |
| `g-t-r` | `grid-template-rows` | `g-t-r$3` |
| `h-p` | `hanging-punctuation` | `h-p$first` |
| `height` | `height` | `height$16` |
| `h-c` | `hyphenate-character` | `h-c$'-'` |
| `h-l-c` | `hyphenate-limit-chars` | `h-l-c$5` |
| `hyphens` | `hyphens` | `hyphens$auto` |
| `i-o` | `image-orientation` | `i-o$from-image` |
| `image-rendering` | `image-rendering` | `image-rendering$pixelated` |
| `image-resolution` | `image-resolution` | `image-resolution$2dppx` |
| `i-l` | `initial-letter` | `i-l$3` |
| `inline-size` | `inline-size` | `inline-size$16` |
| `inset` | `inset` | `inset$16` |
| `i-b` | `inset-block` | `i-b$16` |
| `i-b-e` | `inset-block-end` | `i-b-e$16` |
| `i-b-s` | `inset-block-start` | `i-b-s$16` |
| `i-i` | `inset-inline` | `i-i$16` |
| `i-i-e` | `inset-inline-end` | `i-i-e$16` |
| `i-i-s` | `inset-inline-start` | `i-i-s$16` |
| `interactivity` | `interactivity` | `interactivity$inert` |
| `i-d` | `interest-delay` | `i-d$200ms` |
| `i-d-e` | `interest-delay-end` | `i-d-e$200ms` |
| `i-d-s` | `interest-delay-start` | `i-d-s$200ms` |
| `interpolate-size` | `interpolate-size` | `interpolate-size$allow-keywords` |
| `isolation` | `isolation` | `isolation$isolate` |
| `j-c` | `justify-content` | `j-c$center` |
| `j-i` | `justify-items` | `j-i$center` |
| `j-s` | `justify-self` | `j-s$center` |
| `l` | `left` | `l$16` |
| `letter-spacing` | `letter-spacing` | `letter-spacing$16` |
| `lighting-color` | `lighting-color` | `lighting-color$primary` |
| `l-b` | `line-break` | `l-b$strict` |
| `line-clamp` | `line-clamp` | `line-clamp$2` |
| `l-h` | `line-height` | `l-h$1.5` |
| `l-h-s` | `line-height-step` | `l-h-s$24px` |
| `list-style` | `list-style` | `list-style$none` |
| `l-s-i` | `list-style-image` | `l-s-i$url(https://example.com/a.png)` |
| `l-s-p` | `list-style-position` | `l-s-p$inside` |
| `l-s-t` | `list-style-type` | `l-s-t$none` |
| `margin` | `margin` | `margin$16` |
| `margin-block` | `margin-block` | `margin-block$16` |
| `m-b-e` | `margin-block-end` | `m-b-e$16` |
| `margin-block-start` | `margin-block-start` | `margin-block-start$16` |
| `margin-bottom` | `margin-bottom` | `margin-bottom$16` |
| `margin-inline` | `margin-inline` | `margin-inline$16` |
| `m-i-e` | `margin-inline-end` | `m-i-e$16` |
| `margin-inline-start` | `margin-inline-start` | `margin-inline-start$16` |
| `m-l` | `margin-left` | `m-l$16` |
| `margin-right` | `margin-right` | `margin-right$16` |
| `margin-top` | `margin-top` | `margin-top$16` |
| `margin-trim` | `margin-trim` | `margin-trim$16` |
| `marker` | `marker` | `marker$url(#arrow)` |
| `m-e` | `marker-end` | `m-e$url(#arrow)` |
| `marker-mid` | `marker-mid` | `marker-mid$url(#arrow)` |
| `marker-start` | `marker-start` | `marker-start$url(#arrow)` |
| `mask` | `mask` | `mask$url(https://example.com/mask.svg)` |
| `mask-border` | `mask-border` | `mask-border$url(https://example.com/mask.png)$30` |
| `mask-border-mode` | `mask-border-mode` | `mask-border-mode$luminance` |
| `m-b-o` | `mask-border-outset` | `m-b-o$4px` |
| `m-b-r` | `mask-border-repeat` | `m-b-r$round` |
| `mask-border-slice` | `mask-border-slice` | `mask-border-slice$30` |
| `mask-border-source` | `mask-border-source` | `mask-border-source$url(https://example.com/mask.png)` |
| `m-b-w` | `mask-border-width` | `m-b-w$16` |
| `mask-clip` | `mask-clip` | `mask-clip$border-box` |
| `mask-composite` | `mask-composite` | `mask-composite$intersect` |
| `mask-image` | `mask-image` | `mask-image$url(https://example.com/a.png)` |
| `mask-mode` | `mask-mode` | `mask-mode$luminance` |
| `m-o` | `mask-origin` | `m-o$content-box` |
| `m-p` | `mask-position` | `m-p$16` |
| `mask-repeat` | `mask-repeat` | `mask-repeat$no-repeat` |
| `mask-size` | `mask-size` | `mask-size$16` |
| `mask-type` | `mask-type` | `mask-type$luminance` |
| `m-d` | `math-depth` | `m-d$2` |
| `math-shift` | `math-shift` | `math-shift$compact` |
| `math-style` | `math-style` | `math-style$compact` |
| `max-block-size` | `max-block-size` | `max-block-size$16` |
| `max-height` | `max-height` | `max-height$16` |
| `max-inline-size` | `max-inline-size` | `max-inline-size$16` |
| `max-width` | `max-width` | `max-width$16` |
| `min-block-size` | `min-block-size` | `min-block-size$16` |
| `min-height` | `min-height` | `min-height$16` |
| `min-inline-size` | `min-inline-size` | `min-inline-size$16` |
| `min-width` | `min-width` | `min-width$16` |
| `mix-blend-mode` | `mix-blend-mode` | `mix-blend-mode$multiply` |
| `o-f` | `object-fit` | `o-f$cover` |
| `object-position` | `object-position` | `object-position$16` |
| `o-v-b` | `object-view-box` | `o-v-b$inset(10%)` |
| `offset` | `offset` | `offset$10px` |
| `offset-anchor` | `offset-anchor` | `offset-anchor$16` |
| `o-d` | `offset-distance` | `o-d$16` |
| `offset-path` | `offset-path` | `offset-path$circle(50%)` |
| `offset-position` | `offset-position` | `offset-position$16` |
| `o-r` | `offset-rotate` | `o-r$45deg` |
| `opacity` | `opacity` | `opacity$50` |
| `order` | `order` | `order$2` |
| `orphans` | `orphans` | `orphans$2` |
| `outline` | `outline` | `outline$1px$solid$red` |
| `o-c` | `outline-color` | `o-c$primary` |
| `o-o` | `outline-offset` | `o-o$16` |
| `o-s` | `outline-style` | `o-s$solid` |
| `outline-width` | `outline-width` | `outline-width$16` |
| `overflow` | `overflow` | `overflow$hidden` |
| `overflow-anchor` | `overflow-anchor` | `overflow-anchor$none` |
| `overflow-block` | `overflow-block` | `overflow-block$auto` |
| `o-c-m` | `overflow-clip-margin` | `o-c-m$10px` |
| `o-i` | `overflow-inline` | `o-i$auto` |
| `overflow-wrap` | `overflow-wrap` | `overflow-wrap$break-word` |
| `o-x` | `overflow-x` | `o-x$hidden` |
| `o-y` | `overflow-y` | `o-y$auto` |
| `overscroll-behavior` | `overscroll-behavior` | `overscroll-behavior$contain` |
| `o-b-b` | `overscroll-behavior-block` | `o-b-b$contain` |
| `o-b-i` | `overscroll-behavior-inline` | `o-b-i$contain` |
| `o-b-x` | `overscroll-behavior-x` | `o-b-x$contain` |
| `o-b-y` | `overscroll-behavior-y` | `o-b-y$contain` |
| `padding` | `padding` | `padding$16` |
| `padding-block` | `padding-block` | `padding-block$16` |
| `p-b-e` | `padding-block-end` | `p-b-e$16` |
| `p-b-s` | `padding-block-start` | `p-b-s$16` |
| `padding-bottom` | `padding-bottom` | `padding-bottom$16` |
| `padding-inline` | `padding-inline` | `padding-inline$16` |
| `p-i-e` | `padding-inline-end` | `p-i-e$16` |
| `p-i-s` | `padding-inline-start` | `p-i-s$16` |
| `p-l` | `padding-left` | `p-l$16` |
| `p-r` | `padding-right` | `p-r$16` |
| `padding-top` | `padding-top` | `padding-top$16` |
| `page` | `page` | `page$auto` |
| `p-b-a` | `page-break-after` | `p-b-a$always` |
| `p-b-b` | `page-break-before` | `p-b-b$always` |
| `p-b-i` | `page-break-inside` | `p-b-i$avoid` |
| `paint-order` | `paint-order` | `paint-order$stroke` |
| `perspective` | `perspective` | `perspective$16` |
| `perspective-origin` | `perspective-origin` | `perspective-origin$16` |
| `p-c` | `place-content` | `p-c$center` |
| `place-items` | `place-items` | `place-items$center` |
| `p-s` | `place-self` | `p-s$center` |
| `p-e` | `pointer-events` | `p-e$none` |
| `position` | `position` | `position$absolute` |
| `position-anchor` | `position-anchor` | `position-anchor$--my-anchor` |
| `position-area` | `position-area` | `position-area$top` |
| `position-try` | `position-try` | `position-try$--my-fallback` |
| `p-t-f` | `position-try-fallbacks` | `p-t-f$flip-block` |
| `p-t-o` | `position-try-order` | `p-t-o$most-height` |
| `p-v` | `position-visibility` | `p-v$anchors-visible` |
| `p-c-a` | `print-color-adjust` | `p-c-a$exact` |
| `q` | `quotes` | `q$none` |
| `r` | `r` **Laibery `r` is border-radius; use `svg-r` for the map meaning.** | `svg-r$10` |
| `r-f` | `reading-flow` | `r-f$flex-visual` |
| `r-o` | `reading-order` | `r-o$1` |
| `resize` | `resize` | `resize$both` |
| `right` | `right` | `right$16` |
| `rotate` | `rotate` | `rotate$45deg` |
| `r-g` | `row-gap` | `r-g$16` |
| `r-a` | `ruby-align` | `r-a$center` |
| `r-p` | `ruby-position` | `r-p$over` |
| `scale` | `scale` | `scale$1.05` |
| `s-b` | `scroll-behavior` | `s-b$smooth` |
| `scroll-initial-target` | `scroll-initial-target` | `scroll-initial-target$nearest` |
| `scroll-margin` | `scroll-margin` | `scroll-margin$16` |
| `scroll-margin-block` | `scroll-margin-block` | `scroll-margin-block$16` |
| `s-m-b-e` | `scroll-margin-block-end` | `s-m-b-e$16` |
| `s-m-b-s` | `scroll-margin-block-start` | `s-m-b-s$16` |
| `scroll-margin-bottom` | `scroll-margin-bottom` | `scroll-margin-bottom$16` |
| `s-m-i` | `scroll-margin-inline` | `s-m-i$16` |
| `s-m-i-e` | `scroll-margin-inline-end` | `s-m-i-e$16` |
| `s-m-i-s` | `scroll-margin-inline-start` | `s-m-i-s$16` |
| `s-m-l` | `scroll-margin-left` | `s-m-l$16` |
| `s-m-r` | `scroll-margin-right` | `s-m-r$16` |
| `s-m-t` | `scroll-margin-top` | `s-m-t$16` |
| `s-p` | `scroll-padding` | `s-p$16` |
| `scroll-padding-block` | `scroll-padding-block` | `scroll-padding-block$16` |
| `s-p-b-e` | `scroll-padding-block-end` | `s-p-b-e$16` |
| `s-p-b-s` | `scroll-padding-block-start` | `s-p-b-s$16` |
| `scroll-padding-bottom` | `scroll-padding-bottom` | `scroll-padding-bottom$16` |
| `s-p-i` | `scroll-padding-inline` | `s-p-i$16` |
| `s-p-i-e` | `scroll-padding-inline-end` | `s-p-i-e$16` |
| `s-p-i-s` | `scroll-padding-inline-start` | `s-p-i-s$16` |
| `s-p-l` | `scroll-padding-left` | `s-p-l$16` |
| `s-p-r` | `scroll-padding-right` | `s-p-r$16` |
| `s-p-t` | `scroll-padding-top` | `s-p-t$16` |
| `s-s-a` | `scroll-snap-align` | `s-s-a$center` |
| `s-s-s` | `scroll-snap-stop` | `s-s-s$always` |
| `s-s-t` | `scroll-snap-type` | `s-s-t$x$mandatory` |
| `s-t-g` | `scroll-target-group` | `s-t-g$auto` |
| `s-t` | `scroll-timeline` | `s-t$--my-timeline$block` |
| `s-t-a` | `scroll-timeline-axis` | `s-t-a$block` |
| `s-t-n` | `scroll-timeline-name` | `s-t-n$--my-timeline` |
| `scrollbar-color` | `scrollbar-color` | `scrollbar-color$primary` |
| `s-g` | `scrollbar-gutter` | `s-g$stable` |
| `scrollbar-width` | `scrollbar-width` | `scrollbar-width$16` |
| `shape-image-threshold` | `shape-image-threshold` | `shape-image-threshold$0.5` |
| `shape-margin` | `shape-margin` | `shape-margin$16` |
| `shape-outside` | `shape-outside` | `shape-outside$circle(50%)` |
| `s-r` | `shape-rendering` | `s-r$geometricPrecision` |
| `s-a` | `speak-as` | `s-a$spell-out` |
| `stop-color` | `stop-color` | `stop-color$primary` |
| `stop-opacity` | `stop-opacity` | `stop-opacity$0.5` |
| `stroke` | `stroke` | `stroke$primary` |
| `stroke-dasharray` | `stroke-dasharray` | `stroke-dasharray$4` |
| `stroke-dashoffset` | `stroke-dashoffset` | `stroke-dashoffset$4` |
| `stroke-linecap` | `stroke-linecap` | `stroke-linecap$round` |
| `stroke-linejoin` | `stroke-linejoin` | `stroke-linejoin$round` |
| `stroke-miterlimit` | `stroke-miterlimit` | `stroke-miterlimit$4` |
| `stroke-opacity` | `stroke-opacity` | `stroke-opacity$0.5` |
| `stroke-width` | `stroke-width` | `stroke-width$16` |
| `tab-size` | `tab-size` | `tab-size$4` |
| `t-l` | `table-layout` | `t-l$fixed` |
| `text-align` | `text-align` | `text-align$center` |
| `t-a-l` | `text-align-last` | `t-a-l$center` |
| `text-anchor` | `text-anchor` | `text-anchor$middle` |
| `text-autospace` | `text-autospace` | `text-autospace$normal` |
| `text-box` | `text-box` | `text-box$trim-both$cap$alphabetic` |
| `t-b-e` | `text-box-edge` | `t-b-e$cap$alphabetic` |
| `t-b-t` | `text-box-trim` | `t-b-t$trim-both` |
| `t-c-u` | `text-combine-upright` | `t-c-u$all` |
| `text-decoration` | `text-decoration` | `text-decoration$underline` |
| `t-d-c` | `text-decoration-color` | `t-d-c$primary` |
| `t-d-i` | `text-decoration-inset` | `t-d-i$2px` |
| `t-d-l` | `text-decoration-line` | `t-d-l$underline` |
| `text-decoration-skip` | `text-decoration-skip` | `text-decoration-skip$none` |
| `t-d-s-i` | `text-decoration-skip-ink` | `t-d-s-i$none` |
| `text-decoration-style` | `text-decoration-style` | `text-decoration-style$wavy` |
| `t-d-t` | `text-decoration-thickness` | `t-d-t$16` |
| `t-e` | `text-emphasis` | `t-e$dot$primary` |
| `t-e-c` | `text-emphasis-color` | `t-e-c$primary` |
| `t-e-p` | `text-emphasis-position` | `t-e-p$over$right` |
| `t-e-s` | `text-emphasis-style` | `t-e-s$dot` |
| `t-i` | `text-indent` | `t-i$16` |
| `t-j` | `text-justify` | `t-j$inter-word` |
| `text-orientation` | `text-orientation` | `text-orientation$mixed` |
| `text-overflow` | `text-overflow` | `text-overflow$ellipsis` |
| `t-r` | `text-rendering` | `t-r$optimizeLegibility` |
| `text-shadow` | `text-shadow` | `text-shadow$0$0$4px$primary` |
| `t-s-a` | `text-size-adjust` | `t-s-a$100pct` |
| `t-s-t` | `text-spacing-trim` | `t-s-t$trim-start` |
| `text-transform` | `text-transform` | `text-transform$uppercase` |
| `t-u-o` | `text-underline-offset` | `t-u-o$16` |
| `t-u-p` | `text-underline-position` | `t-u-p$under` |
| `t-w` | `text-wrap` | `t-w$balance` |
| `t-w-m` | `text-wrap-mode` | `t-w-m$wrap` |
| `t-w-s` | `text-wrap-style` | `t-w-s$balance` |
| `timeline-scope` | `timeline-scope` | `timeline-scope$--my-timeline` |
| `timeline-trigger` | `timeline-trigger` | `timeline-trigger$--my-trigger$--my-timeline` |
| `t-t-a-r` | `timeline-trigger-active-range` | `t-t-a-r$entry$50pct` |
| `t-t-a-r-e` | `timeline-trigger-active-range-end` | `t-t-a-r-e$exit$50pct` |
| `t-t-a-r-s` | `timeline-trigger-active-range-start` | `t-t-a-r-s$entry$50pct` |
| `t-t-n` | `timeline-trigger-name` | `t-t-n$--my-trigger` |
| `t-t-s` | `timeline-trigger-source` | `t-t-s$--my-timeline` |
| `top` | `top` | `top$16` |
| `touch-action` | `touch-action` | `touch-action$none` |
| `transform` | `transform` | `transform$rotate(45deg)` |
| `transform-box` | `transform-box` | `transform-box$fill-box` |
| `transform-origin` | `transform-origin` | `transform-origin$16` |
| `transform-style` | `transform-style` | `transform-style$preserve-3d` |
| `transition` | `transition` | `transition$opacity$200ms` |
| `transition-behavior` | `transition-behavior` | `transition-behavior$allow-discrete` |
| `transition-delay` | `transition-delay` | `transition-delay$100ms` |
| `transition-duration` | `transition-duration` | `transition-duration$200ms` |
| `t-p` | `transition-property` | `t-p$opacity` |
| `t-t-f` | `transition-timing-function` | `t-t-f$ease` |
| `translate` | `translate` | `translate$16` |
| `trigger-scope` | `trigger-scope` | `trigger-scope$--my-trigger` |
| `u-b` | `unicode-bidi` | `u-b$isolate` |
| `u-m` | `user-modify` | `u-m$read-write` |
| `u-s` | `user-select` | `u-s$none` |
| `v-e` | `vector-effect` | `v-e$non-scaling-stroke` |
| `v-a` | `vertical-align` | `v-a$middle` |
| `v-t` | `view-timeline` | `v-t$--my-view$block` |
| `v-t-a` | `view-timeline-axis` | `v-t-a$block` |
| `v-t-i` | `view-timeline-inset` | `v-t-i$10px` |
| `view-timeline-name` | `view-timeline-name` | `view-timeline-name$--my-view` |
| `v-t-c` | `view-transition-class` | `v-t-c$card` |
| `view-transition-name` | `view-transition-name` | `view-transition-name$card` |
| `v-t-s` | `view-transition-scope` | `v-t-s$card` |
| `v` | `visibility` | `v$hidden` |
| `white-space` | `white-space` | `white-space$nowrap` |
| `w-s-c` | `white-space-collapse` | `w-s-c$collapse` |
| `widows` | `widows` | `widows$2` |
| `width` | `width` | `width$16` |
| `w-c` | `will-change` | `w-c$transform` |
| `w-b` | `word-break` | `w-b$break-all` |
| `word-spacing` | `word-spacing` | `word-spacing$16` |
| `w-m` | `writing-mode` | `w-m$vertical-rl` |
| `x` | `x` | `x$16` |
| `y` | `y` | `y$16` |
| `z-i` | `z-index` | `z-i$10` |
| `z` | `zoom` **Laibery `z` is z-index; use `zoom` for the map meaning.** | `zoom$1.5` |

## Related

- [Documentation site](index.html) — tutorials, search, variants, API and all classes.
- [classes.json](classes.json) — structured data for tools and AI.
- [llms.txt](llms.txt) — short AI index; [llms-full.txt](llms-full.txt) — full AI-readable docs.
- [README](../README.md) — getting started, any-website loading, override, theme and API.
- [Demo](../demo/index.html) — self-styled page and live playground.

MIT licensed.
