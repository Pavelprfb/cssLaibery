/*!
 * Laibery v0.2.0
 * CSS from class names, generated at runtime.
 *
 *   <div class="b$2$s$red p$16"> ... </div>
 *   ->  border-width: 2px; border-style: solid; border-color: red;
 *       padding: 16px;
 *
 * No build step, no config. Just include this file.
 * MIT License.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Laibery = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '0.2.0';
  var STYLE_ID = 'laibery-styles';

  var settings = {
    important: true,
    nonce: '',
    manual: false
  };

  function readGlobalConfig() {
    if (settings.manual) return;
    if (typeof window === 'undefined' || !window.__LAIBERY_CONFIG__) return;
    var c = window.__LAIBERY_CONFIG__;
    if (!c || typeof c !== 'object') return;
    if (Object.prototype.hasOwnProperty.call(c, 'important')) {
      settings.important = !!c.important;
    }
    if (typeof c.nonce === 'string') settings.nonce = c.nonce;
  }

  readGlobalConfig();

  /* ============================================================
   * Theme
   * ============================================================ */

  var palette = {
    primary: '#3b82f6',
    'primary-dark': '#1d4ed8',
    secondary: '#64748b',
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#d97706',
    info: '#0891b2',
    light: '#f8fafc',
    dark: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    surface: '#ffffff',
    text: '#0f172a'
  };

  var shadows = {
    sm: '0 1px 2px 0 rgb(15 23 42 / 0.06)',
    md: '0 4px 6px -1px rgb(15 23 42 / 0.10), 0 2px 4px -2px rgb(15 23 42 / 0.08)',
    lg: '0 10px 15px -3px rgb(15 23 42 / 0.10), 0 4px 6px -4px rgb(15 23 42 / 0.08)',
    xl: '0 20px 25px -5px rgb(15 23 42 / 0.12), 0 8px 10px -6px rgb(15 23 42 / 0.08)'
  };

  var fontStacks = {
    sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
  };

  var breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  var breakpointTier = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5
  };

  var pseudoVariants = {
    hover: ':hover',
    focus: ':focus',
    'focus-visible': ':focus-visible',
    'focus-within': ':focus-within',
    active: ':active',
    visited: ':visited',
    disabled: ':disabled',
    checked: ':checked',
    required: ':required',
    invalid: ':invalid',
    empty: ':empty',
    first: ':first-child',
    last: ':last-child',
    only: ':only-child',
    odd: ':nth-child(odd)',
    even: ':nth-child(even)'
  };

  // Ancestor-based variants: "dark:bg$dark" needs an element with class="dark".
  var scopeVariants = {
    dark: '.dark'
  };

  /* ============================================================
   * Value helpers
   * ============================================================ */

  var NUMBER_RE = /^-?(?:\d+|\d*\.\d+)$/;
  var LENGTH_RE = /^-?(?:\d+|\d*\.\d+)(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|pt|pc|cm|mm|in|q|deg|turn|rad|fr)$/i;
  var CSS_FN_RE = /^(calc|min|max|clamp|var)\([^;{}"']*\)$/i;
  var KEYWORD_RE = /^[a-z][a-z-]*$/;

  function one(prop, value) {
    return value == null ? null : [[prop, value]];
  }

  function lengthValue(value) {
    if (value == null) return null;
    var s = String(value);
    if (s === '') return null;
    if (s === '0') return '0';
    if (NUMBER_RE.test(s)) return s + 'px';
    if (s.slice(-3) === 'pct') {
      var n = s.slice(0, -3);
      if (NUMBER_RE.test(n)) return n + '%';
    }
    if (LENGTH_RE.test(s)) return s;
    if (/^(auto|inherit|initial|unset)$/i.test(s)) return s;
    if (CSS_FN_RE.test(s)) return s;
    return null;
  }

  function borderWidthValue(value) {
    var s = String(value);
    if (s === 'thin' || s === 'medium' || s === 'thick') return s;
    if (NUMBER_RE.test(s)) return s === '0' ? '0' : s + 'px';
    if (LENGTH_RE.test(s)) return s;
    return null;
  }

  function colorValue(value) {
    if (value == null) return null;
    var s = String(value);
    var key = s.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(palette, key)) return 'var(--lb-' + key + ')';
    if (/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s)) {
      return s.charAt(0) === '#' ? s : '#' + s;
    }
    if (/^(transparent|currentcolor|inherit|initial|unset|none|white|black)$/i.test(s)) return s;
    if (KEYWORD_RE.test(key)) return key;
    if (/^var\(--[a-z0-9-]+\)$/i.test(s)) return s;
    if (/^(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\([^;{}"']*\)$/i.test(s)) return s;
    return null;
  }

  function intValue(value) {
    var s = String(value);
    return /^-?\d+$/.test(s) ? s : null;
  }

  function aliasValue(map, value) {
    var s = String(value).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(map, s)) return map[s];
    if (KEYWORD_RE.test(s)) return s;
    return null;
  }

  function sizeValue(value, axis) {
    var s = String(value);
    if (s === 'full') return '100%';
    if (s === 'screen') return axis === 'w' ? '100vw' : '100vh';
    if (s === 'fit') return 'fit-content';
    if (s === 'min') return 'min-content';
    if (s === 'max') return 'max-content';
    if (s === 'none') return 'none';
    return lengthValue(s);
  }

  function ratioValue(values) {
    if (values.length === 1) {
      var v = values[0];
      if (v === 'auto' || NUMBER_RE.test(v) || /^\d+\/\d+$/.test(v)) return v;
      return null;
    }
    if (values.length === 2 && NUMBER_RE.test(values[0]) && NUMBER_RE.test(values[1])) {
      return values[0] + ' / ' + values[1];
    }
    return null;
  }

  function trackValue(values) {
    if (values.length === 1) {
      var v = values[0];
      if (/^\d+$/.test(v)) {
        if (parseInt(v, 10) < 1) return null;
        return 'repeat(' + v + ',minmax(0,1fr))';
      }
      if (v === 'none') return 'none';
      if (/^(auto|min-content|max-content)$/.test(v)) return v;
      return lengthValue(v);
    }
    var out = [];
    for (var i = 0; i < values.length; i++) {
      var item = values[i];
      if (/^\d+$/.test(item)) {
        out.push(item + 'fr');
      } else {
        var len = lengthValue(item);
        if (len == null) return null;
        out.push(len);
      }
    }
    return out.join(' ');
  }

  function spacingFor(prop, values, allowAuto) {
    if (values.length < 1 || values.length > 4) return null;
    var out = [];
    for (var i = 0; i < values.length; i++) {
      var v = lengthValue(values[i]);
      if (v == null) return null;
      if (!allowAuto && v === 'auto') return null;
      out.push(v);
    }
    return [[prop, out.join(' ')]];
  }

  function dualSpacing(propA, propB, values, allowAuto) {
    if (values.length !== 1) return null;
    var v = lengthValue(values[0]);
    if (v == null) return null;
    if (!allowAuto && v === 'auto') return null;
    return [[propA, v], [propB, v]];
  }

  function gapValue(values) {
    if (values.length < 1 || values.length > 2) return null;
    var out = [];
    for (var i = 0; i < values.length; i++) {
      var v = lengthValue(values[i]);
      if (v == null || v === 'auto') return null;
      out.push(v);
    }
    return out.join(' ');
  }

  function radiusValue(value) {
    var s = String(value);
    if (s === 'full') return '9999px';
    return lengthValue(s);
  }

  function fontWeightValue(value) {
    var s = String(value).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(FONT_WEIGHTS, s)) return FONT_WEIGHTS[s];
    if (/^[1-9]00$/.test(s)) return s;
    if (/^(normal|bold|bolder|lighter)$/.test(s)) return s;
    return null;
  }

  function fontValue(value) {
    var s = String(value).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(fontStacks, s)) return 'var(--lb-font-' + s + ')';
    if (/^var\(--[a-z0-9-]+\)$/i.test(s)) return s;
    return null;
  }

  function lineHeightValue(value) {
    var s = String(value);
    if (s === 'normal') return 'normal';
    if (NUMBER_RE.test(s)) return s.indexOf('.') === -1 ? s + 'px' : s;
    return lengthValue(s);
  }

  function opacityValue(value) {
    var s = String(value);
    if (s === 'full') return '1';
    if (/^\d+$/.test(s)) {
      var n = parseInt(s, 10);
      if (n >= 0 && n <= 100) return String(n / 100);
    }
    if (NUMBER_RE.test(s)) return s;
    return null;
  }

  function shadowValue(value) {
    var s = String(value).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(shadows, s)) return 'var(--lb-shadow-' + s + ')';
    if (s === 'none') return 'none';
    return null;
  }

  var EASING = {
    linear: 'linear',
    ease: 'ease',
    in: 'ease-in',
    out: 'ease-out',
    inout: 'ease-in-out'
  };

  function transitionValue(values) {
    var first = values[0];
    var duration;
    if (first === 'none') return 'none';
    if (NUMBER_RE.test(first)) duration = first === '0' ? '0ms' : first + 'ms';
    else if (/^\d+(ms|s)$/.test(first)) duration = first;
    else return null;

    var ease = 'ease';
    if (values.length > 1) {
      var e = EASING[String(values[1]).toLowerCase()];
      if (!e) return null;
      ease = e;
    }
    return 'all ' + duration + ' ' + ease;
  }

  function borderStyleValue(value) {
    var s = String(value).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(BORDER_STYLE, s)) return BORDER_STYLE[s];
    if (BORDER_STYLE_SET[s]) return s;
    return null;
  }

  function classifyBorder(value) {
    var s = String(value);
    var style = borderStyleValue(s);
    if (style) return ['style', style];
    if (s === 'thin' || s === 'medium' || s === 'thick') return ['width', s];
    if (NUMBER_RE.test(s)) return ['width', s === '0' ? '0' : s + 'px'];
    if (LENGTH_RE.test(s)) return ['width', s];
    var color = colorValue(s);
    if (color) return ['color', color];
    return null;
  }

  function borderFor(sides, values) {
    if (!values.length) return null;
    var found = {};
    for (var i = 0; i < values.length; i++) {
      var item = classifyBorder(values[i]);
      if (!item) return null;
      if (found[item[0]] != null) return null;
      found[item[0]] = item[1];
    }
    var decls = [];
    for (var s = 0; s < sides.length; s++) {
      var side = sides[s];
      if (found.width != null) decls.push([side + '-width', found.width]);
      if (found.style != null) decls.push([side + '-style', found.style]);
      if (found.color != null) decls.push([side + '-color', found.color]);
    }
    return decls.length ? decls : null;
  }

  function cornerFor(prop, values) {
    if (values.length !== 1) return null;
    var v = radiusValue(values[0]);
    return v == null ? null : [[prop, v]];
  }

  /* ============================================================
   * Property registry
   * ============================================================ */

  var PROPERTY_DEFS = Object.create(null);

  function def(key, priority, build) {
    PROPERTY_DEFS[key] = { priority: priority, build: build };
  }

  var DISPLAY = {
    f: 'flex',
    g: 'grid',
    b: 'block',
    ib: 'inline-block',
    i: 'inline',
    n: 'none',
    if: 'inline-flex',
    ig: 'inline-grid',
    t: 'table',
    tc: 'table-cell',
    li: 'list-item',
    c: 'contents',
    fr: 'flow-root'
  };

  var POSITION = {
    r: 'relative',
    a: 'absolute',
    f: 'fixed',
    s: 'static',
    st: 'sticky',
    rel: 'relative',
    abs: 'absolute',
    fix: 'fixed',
    stat: 'static'
  };

  var OVERFLOW = {
    h: 'hidden',
    a: 'auto',
    s: 'scroll',
    v: 'visible',
    c: 'clip'
  };

  var ALIGN = {
    c: 'center',
    s: 'start',
    e: 'end',
    fs: 'flex-start',
    fe: 'flex-end',
    sb: 'space-between',
    sa: 'space-around',
    se: 'space-evenly',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
    st: 'stretch',
    b: 'baseline',
    n: 'normal',
    auto: 'auto'
  };

  var DIRECTION = {
    r: 'row',
    c: 'column',
    rr: 'row-reverse',
    cr: 'column-reverse',
    row: 'row',
    col: 'column',
    column: 'column',
    reverse: 'row-reverse'
  };

  var FLEX_WRAP = {
    w: 'wrap',
    n: 'nowrap',
    r: 'wrap-reverse',
    wrap: 'wrap',
    nowrap: 'nowrap',
    reverse: 'wrap-reverse'
  };

  var FLOAT = { l: 'left', r: 'right', n: 'none' };

  var TEXT_ALIGN = { l: 'left', r: 'right', c: 'center', j: 'justify', start: 'start', end: 'end' };

  var TEXT_DECORATION = { n: 'none', u: 'underline', l: 'line-through', o: 'overline' };

  var TEXT_TRANSFORM = { n: 'none', u: 'uppercase', l: 'lowercase', c: 'capitalize' };

  var WHITE_SPACE = { n: 'normal', nw: 'nowrap', p: 'pre', pw: 'pre-wrap', pl: 'pre-line' };

  var FONT_STYLE = { i: 'italic', n: 'normal', o: 'oblique' };

  var CURSOR = {
    p: 'pointer',
    d: 'default',
    t: 'text',
    na: 'not-allowed',
    m: 'move',
    g: 'grab',
    gr: 'grabbing',
    h: 'help',
    w: 'wait',
    c: 'crosshair',
    z: 'zoom-in',
    cp: 'copy'
  };

  var POINTER_EVENTS = { n: 'none', a: 'auto' };

  var USER_SELECT = { n: 'none', t: 'text', a: 'all', auto: 'auto' };

  var FONT_WEIGHTS = {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
    t: '100',
    el: '200',
    l: '300',
    n: '400',
    m: '500',
    sb: '600',
    b: '700',
    eb: '800',
    bl: '900'
  };

  var BORDER_STYLE = {
    s: 'solid',
    d: 'dashed',
    dt: 'dotted',
    db: 'double',
    g: 'groove',
    r: 'ridge',
    i: 'inset',
    o: 'outset',
    n: 'none',
    h: 'hidden'
  };

  var BORDER_STYLE_SET = {};
  Object.keys(BORDER_STYLE).forEach(function (key) {
    BORDER_STYLE_SET[BORDER_STYLE[key]] = true;
  });

  /* ---- layout ---- */

  def('d', 10, function (v) {
    var s = String(v[0]).toLowerCase();
    return one('display', DISPLAY[s] || (KEYWORD_RE.test(s) ? s : null));
  });

  def('pos', 11, function (v) {
    return one('position', aliasValue(POSITION, v[0]));
  });

  ['top', 'right', 'bottom', 'left'].forEach(function (side) {
    def(side, 12, function (v) {
      return one(side, lengthValue(v[0]));
    });
  });

  def('z', 13, function (v) { return one('z-index', intValue(v[0])); });

  def('float', 13, function (v) {
    return one('float', aliasValue(FLOAT, v[0]));
  });

  def('ar', 14, function (v) {
    return one('aspect-ratio', ratioValue(v));
  });

  def('ov', 15, function (v) {
    return one('overflow', aliasValue(OVERFLOW, v[0]));
  });

  def('ovx', 16, function (v) {
    return one('overflow-x', aliasValue(OVERFLOW, v[0]));
  });

  def('ovy', 16, function (v) {
    return one('overflow-y', aliasValue(OVERFLOW, v[0]));
  });

  /* ---- flex + grid ---- */

  def('flex', 20, function (v) {
    if (v.length === 1) {
      var s = String(v[0]);
      if (NUMBER_RE.test(s) || /^(auto|none|initial|inherit)$/.test(s)) return [['flex', s]];
      return null;
    }
    if (v.length <= 3 && v.every(function (x) { return NUMBER_RE.test(x); })) {
      return [['flex', v.join(' ')]];
    }
    return null;
  });

  def('grow', 21, function (v) { return one('flex-grow', intValue(v[0])); });

  def('shrink', 21, function (v) { return one('flex-shrink', intValue(v[0])); });

  def('order', 22, function (v) { return one('order', intValue(v[0])); });

  def('fd', 23, function (v) {
    return one('flex-direction', aliasValue(DIRECTION, v[0]));
  });

  def('wrap', 23, function (v) {
    return one('flex-wrap', aliasValue(FLEX_WRAP, v[0]));
  });

  def('justify', 24, function (v) {
    return one('justify-content', aliasValue(ALIGN, v[0]));
  });

  def('items', 25, function (v) {
    return one('align-items', aliasValue(ALIGN, v[0]));
  });

  def('self', 26, function (v) {
    return one('align-self', aliasValue(ALIGN, v[0]));
  });

  def('gap', 27, function (v) { return one('gap', gapValue(v)); });

  def('gapx', 28, function (v) {
    var x = lengthValue(v[0]);
    return x === 'auto' ? null : one('column-gap', x);
  });

  def('gapy', 28, function (v) {
    var y = lengthValue(v[0]);
    return y === 'auto' ? null : one('row-gap', y);
  });

  def('cols', 29, function (v) {
    return one('grid-template-columns', trackValue(v));
  });

  def('rows', 29, function (v) {
    return one('grid-template-rows', trackValue(v));
  });

  /* ---- sizing ---- */

  def('w', 40, function (v) { return one('width', sizeValue(v[0], 'w')); });
  def('h', 40, function (v) { return one('height', sizeValue(v[0], 'h')); });
  def('minw', 40, function (v) { return one('min-width', sizeValue(v[0], 'w')); });
  def('maxw', 40, function (v) { return one('max-width', sizeValue(v[0], 'w')); });
  def('minh', 40, function (v) { return one('min-height', sizeValue(v[0], 'h')); });
  def('maxh', 40, function (v) { return one('max-height', sizeValue(v[0], 'h')); });

  /* ---- spacing ---- */

  def('p', 50, function (v) { return spacingFor('padding', v, false); });
  def('px', 51, function (v) { return dualSpacing('padding-left', 'padding-right', v, false); });
  def('py', 51, function (v) { return dualSpacing('padding-top', 'padding-bottom', v, false); });
  def('pt', 52, function (v) { return one('padding-top', lengthValue(v[0])); });
  def('pr', 52, function (v) { return one('padding-right', lengthValue(v[0])); });
  def('pb', 52, function (v) { return one('padding-bottom', lengthValue(v[0])); });
  def('pl', 52, function (v) { return one('padding-left', lengthValue(v[0])); });

  def('m', 54, function (v) { return spacingFor('margin', v, true); });
  def('mx', 55, function (v) { return dualSpacing('margin-left', 'margin-right', v, true); });
  def('my', 55, function (v) { return dualSpacing('margin-top', 'margin-bottom', v, true); });
  def('mt', 56, function (v) { return one('margin-top', lengthValue(v[0])); });
  def('mr', 56, function (v) { return one('margin-right', lengthValue(v[0])); });
  def('mb', 56, function (v) { return one('margin-bottom', lengthValue(v[0])); });
  def('ml', 56, function (v) { return one('margin-left', lengthValue(v[0])); });

  /* ---- typography ---- */

  def('fz', 70, function (v) { return one('font-size', lengthValue(v[0])); });
  def('fw', 71, function (v) { return one('font-weight', fontWeightValue(v[0])); });
  def('ff', 72, function (v) { return one('font-family', fontValue(v[0])); });
  def('fi', 73, function (v) { return one('font-style', aliasValue(FONT_STYLE, v[0])); });
  def('lh', 74, function (v) { return one('line-height', lineHeightValue(v[0])); });
  def('ls', 75, function (v) { return one('letter-spacing', lengthValue(v[0])); });
  def('ta', 76, function (v) { return one('text-align', aliasValue(TEXT_ALIGN, v[0])); });
  def('td', 77, function (v) { return one('text-decoration', aliasValue(TEXT_DECORATION, v[0])); });
  def('tt', 78, function (v) { return one('text-transform', aliasValue(TEXT_TRANSFORM, v[0])); });
  def('ws', 79, function (v) { return one('white-space', aliasValue(WHITE_SPACE, v[0])); });
  def('c', 80, function (v) { return one('color', colorValue(v[0])); });
  def('bg', 81, function (v) { return one('background-color', colorValue(v[0])); });

  /* ---- borders + radius ---- */

  def('b', 100, function (v) { return borderFor(['border'], v); });
  def('bx', 101, function (v) { return borderFor(['border-left', 'border-right'], v); });
  def('by', 101, function (v) { return borderFor(['border-top', 'border-bottom'], v); });
  def('bt', 102, function (v) { return borderFor(['border-top'], v); });
  def('bb', 102, function (v) { return borderFor(['border-bottom'], v); });
  def('bl', 102, function (v) { return borderFor(['border-left'], v); });
  def('br', 102, function (v) { return borderFor(['border-right'], v); });

  def('bw', 103, function (v) { return one('border-width', borderWidthValue(v[0])); });
  def('bst', 104, function (v) { return one('border-style', borderStyleValue(v[0])); });
  def('bc', 105, function (v) { return one('border-color', colorValue(v[0])); });

  def('r', 106, function (v) {
    if (v.length < 1 || v.length > 4) return null;
    var out = [];
    for (var i = 0; i < v.length; i++) {
      var x = radiusValue(v[i]);
      if (x == null) return null;
      out.push(x);
    }
    return [['border-radius', out.join(' ')]];
  });

  def('r-tl', 107, function (v) {
    return cornerFor('border-top-left-radius', v);
  });
  def('r-tr', 107, function (v) {
    return cornerFor('border-top-right-radius', v);
  });
  def('r-br', 107, function (v) {
    return cornerFor('border-bottom-right-radius', v);
  });
  def('r-bl', 107, function (v) {
    return cornerFor('border-bottom-left-radius', v);
  });

  /* ---- effects + misc ---- */

  def('op', 120, function (v) { return one('opacity', opacityValue(v[0])); });
  def('sh', 121, function (v) { return one('box-shadow', shadowValue(v[0])); });
  def('tr', 122, function (v) { return one('transition', transitionValue(v)); });
  def('cur', 123, function (v) { return one('cursor', aliasValue(CURSOR, v[0])); });
  def('pe', 124, function (v) { return one('pointer-events', aliasValue(POINTER_EVENTS, v[0])); });
  def('sel', 125, function (v) { return one('user-select', aliasValue(USER_SELECT, v[0])); });

  /* ============================================================
   * Full CSS property map
   *
   * The curated aliases above are the short, hand-tuned API. This
   * section adds the 520 properties from the CSS property alias map:
   * every full property name plus the map's initials-style aliases.
   * Curated meanings always win (d = display, r = border-radius,
   * z = z-index), so the map's SVG d/r are exposed as svg-d/svg-r
   * and the map's z = zoom is exposed as zoom.
   * ============================================================ */

  // Generated from css-property-alias-map.txt. Each entry is either
  // "property" or "alias=property".
  var MAP_DATA = [
    'accent-color', 'align-content', 'a-i=align-items', 'align-self', 'a-b=alignment-baseline',
    'all', 'anchor-name', 'anchor-scope', 'animation', 'animation-composition',
    'animation-delay', 'animation-direction', 'animation-duration', 'a-f-m=animation-fill-mode', 'a-i-c=animation-iteration-count',
    'animation-name', 'a-p-s=animation-play-state', 'animation-range', 'a-r-e=animation-range-end', 'a-r-s=animation-range-start',
    'a-t=animation-timeline', 'a-t-f=animation-timing-function', 'appearance', 'aspect-ratio', 'b-f=backdrop-filter',
    'b-v=backface-visibility', 'background', 'background-attachment', 'b-b-m=background-blend-mode', 'background-clip',
    'background-color', 'background-image', 'b-o=background-origin', 'b-p=background-position', 'b-p-x=background-position-x',
    'b-p-y=background-position-y', 'background-repeat', 'b-r-x=background-repeat-x', 'b-r-y=background-repeat-y', 'background-size',
    'baseline-shift', 'baseline-source', 'block-size', 'border', 'border-block',
    'border-block-color', 'b-b-e=border-block-end', 'b-b-e-c=border-block-end-color', 'b-b-e-s=border-block-end-style', 'b-b-e-w=border-block-end-width',
    'border-block-start', 'b-b-s-c=border-block-start-color', 'b-b-s-s=border-block-start-style', 'b-b-s-w=border-block-start-width', 'border-block-style',
    'border-block-width', 'border-bottom', 'border-bottom-color', 'b-b-l-r=border-bottom-left-radius', 'b-b-r-r=border-bottom-right-radius',
    'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'b-e-e-r=border-end-end-radius',
    'b-e-s-r=border-end-start-radius', 'border-image', 'b-i-o=border-image-outset', 'b-i-r=border-image-repeat', 'border-image-slice',
    'border-image-source', 'border-image-width', 'border-inline', 'b-i-c=border-inline-color', 'b-i-e=border-inline-end',
    'b-i-e-c=border-inline-end-color', 'b-i-e-s=border-inline-end-style', 'b-i-e-w=border-inline-end-width', 'border-inline-start', 'b-i-s-c=border-inline-start-color',
    'b-i-s-s=border-inline-start-style', 'b-i-s-w=border-inline-start-width', 'border-inline-style', 'border-inline-width', 'b-l=border-left',
    'b-l-c=border-left-color', 'b-l-s=border-left-style', 'b-l-w=border-left-width', 'border-radius', 'border-right',
    'b-r-c=border-right-color', 'b-r-s=border-right-style', 'b-r-w=border-right-width', 'border-shape', 'border-spacing',
    'b-s-e-r=border-start-end-radius', 'b-s-s-r=border-start-start-radius', 'border-style', 'b-t=border-top', 'b-t-c=border-top-color',
    'b-t-l-r=border-top-left-radius', 'b-t-r-r=border-top-right-radius', 'b-t-s=border-top-style', 'b-t-w=border-top-width', 'b-w=border-width',
    'bottom', 'b-d-b=box-decoration-break', 'box-shadow', 'box-sizing', 'break-after',
    'break-before', 'break-inside', 'caption-side', 'caret', 'c-a=caret-animation',
    'caret-color', 'caret-shape', 'clear', 'clip', 'c-p=clip-path',
    'clip-rule', 'color', 'color-interpolation', 'c-i-f=color-interpolation-filters', 'color-scheme',
    'column-count', 'c-f=column-fill', 'c-g=column-gap', 'c-h=column-height', 'column-rule',
    'c-r-c=column-rule-color', 'column-rule-style', 'c-r-w=column-rule-width', 'column-span', 'column-width',
    'column-wrap', 'columns', 'contain', 'c-i-b-s=contain-intrinsic-block-size', 'c-i-h=contain-intrinsic-height',
    'c-i-i-s=contain-intrinsic-inline-size', 'c-i-s=contain-intrinsic-size', 'c-i-w=contain-intrinsic-width', 'container', 'c-n=container-name',
    'c-t=container-type', 'content', 'c-v=content-visibility', 'c-b-e-s=corner-block-end-shape', 'c-b-s-s=corner-block-start-shape',
    'c-b-l-s=corner-bottom-left-shape', 'c-b-r-s=corner-bottom-right-shape', 'c-b-s=corner-bottom-shape', 'c-e-e-s=corner-end-end-shape', 'c-e-s-s=corner-end-start-shape',
    'c-i-e-s=corner-inline-end-shape', 'c-i-s-s=corner-inline-start-shape', 'c-l-s=corner-left-shape', 'corner-right-shape', 'corner-shape',
    'c-s-e-s=corner-start-end-shape', 'c-s-s-s=corner-start-start-shape', 'c-t-l-s=corner-top-left-shape', 'c-t-r-s=corner-top-right-shape', 'c-t-s=corner-top-shape',
    'counter-increment', 'counter-reset', 'counter-set', 'cursor', 'cx',
    'cy', 'direction', 'display', 'd-b=dominant-baseline', 'd-r-l=dynamic-range-limit',
    'e-c=empty-cells', 'field-sizing', 'fill', 'fill-opacity', 'f-r=fill-rule',
    'filter', 'flex', 'f-b=flex-basis', 'f-d=flex-direction', 'flex-flow',
    'f-g=flex-grow', 'flex-shrink', 'flex-wrap', 'float', 'f-c=flood-color',
    'flood-opacity', 'font', 'font-family', 'f-f-s=font-feature-settings', 'f-k=font-kerning',
    'f-l-o=font-language-override', 'f-o-s=font-optical-sizing', 'f-p=font-palette', 'font-size', 'f-s-a=font-size-adjust',
    'font-stretch', 'font-style', 'font-synthesis', 'f-s-p=font-synthesis-position', 'f-s-s-c=font-synthesis-small-caps',
    'f-s-s=font-synthesis-style', 'f-s-w=font-synthesis-weight', 'f-v=font-variant', 'f-v-a=font-variant-alternates', 'f-v-c=font-variant-caps',
    'f-v-e-a=font-variant-east-asian', 'f-v-e=font-variant-emoji', 'f-v-l=font-variant-ligatures', 'f-v-n=font-variant-numeric', 'f-v-p=font-variant-position',
    'f-v-s=font-variation-settings', 'font-weight', 'font-width', 'f-c-a=forced-color-adjust', 'gap',
    'grid', 'g-a=grid-area', 'g-a-c=grid-auto-columns', 'g-a-f=grid-auto-flow', 'g-a-r=grid-auto-rows',
    'g-c=grid-column', 'g-c-e=grid-column-end', 'g-c-s=grid-column-start', 'g-r=grid-row', 'g-r-e=grid-row-end',
    'g-r-s=grid-row-start', 'g-t=grid-template', 'g-t-a=grid-template-areas', 'g-t-c=grid-template-columns', 'g-t-r=grid-template-rows',
    'h-p=hanging-punctuation', 'height', 'h-c=hyphenate-character', 'h-l-c=hyphenate-limit-chars', 'hyphens',
    'i-o=image-orientation', 'image-rendering', 'image-resolution', 'i-l=initial-letter', 'inline-size',
    'inset', 'i-b=inset-block', 'i-b-e=inset-block-end', 'i-b-s=inset-block-start', 'i-i=inset-inline',
    'i-i-e=inset-inline-end', 'i-i-s=inset-inline-start', 'interactivity', 'i-d=interest-delay', 'i-d-e=interest-delay-end',
    'i-d-s=interest-delay-start', 'interpolate-size', 'isolation', 'j-c=justify-content', 'j-i=justify-items',
    'j-s=justify-self', 'l=left', 'letter-spacing', 'lighting-color', 'l-b=line-break',
    'line-clamp', 'l-h=line-height', 'l-h-s=line-height-step', 'list-style', 'l-s-i=list-style-image',
    'l-s-p=list-style-position', 'l-s-t=list-style-type', 'margin', 'margin-block', 'm-b-e=margin-block-end',
    'margin-block-start', 'margin-bottom', 'margin-inline', 'm-i-e=margin-inline-end', 'margin-inline-start',
    'm-l=margin-left', 'margin-right', 'margin-top', 'margin-trim', 'marker',
    'm-e=marker-end', 'marker-mid', 'marker-start', 'mask', 'mask-border',
    'mask-border-mode', 'm-b-o=mask-border-outset', 'm-b-r=mask-border-repeat', 'mask-border-slice', 'mask-border-source',
    'm-b-w=mask-border-width', 'mask-clip', 'mask-composite', 'mask-image', 'mask-mode',
    'm-o=mask-origin', 'm-p=mask-position', 'mask-repeat', 'mask-size', 'mask-type',
    'm-d=math-depth', 'math-shift', 'math-style', 'max-block-size', 'max-height',
    'max-inline-size', 'max-width', 'min-block-size', 'min-height', 'min-inline-size',
    'min-width', 'mix-blend-mode', 'o-f=object-fit', 'object-position', 'o-v-b=object-view-box',
    'offset', 'offset-anchor', 'o-d=offset-distance', 'offset-path', 'offset-position',
    'o-r=offset-rotate', 'opacity', 'order', 'orphans', 'outline',
    'o-c=outline-color', 'o-o=outline-offset', 'o-s=outline-style', 'outline-width', 'overflow',
    'overflow-anchor', 'overflow-block', 'o-c-m=overflow-clip-margin', 'o-i=overflow-inline', 'overflow-wrap',
    'o-x=overflow-x', 'o-y=overflow-y', 'overscroll-behavior', 'o-b-b=overscroll-behavior-block', 'o-b-i=overscroll-behavior-inline',
    'o-b-x=overscroll-behavior-x', 'o-b-y=overscroll-behavior-y', 'padding', 'padding-block', 'p-b-e=padding-block-end',
    'p-b-s=padding-block-start', 'padding-bottom', 'padding-inline', 'p-i-e=padding-inline-end', 'p-i-s=padding-inline-start',
    'p-l=padding-left', 'p-r=padding-right', 'padding-top', 'page', 'p-b-a=page-break-after',
    'p-b-b=page-break-before', 'p-b-i=page-break-inside', 'paint-order', 'perspective', 'perspective-origin',
    'p-c=place-content', 'place-items', 'p-s=place-self', 'p-e=pointer-events', 'position',
    'position-anchor', 'position-area', 'position-try', 'p-t-f=position-try-fallbacks', 'p-t-o=position-try-order',
    'p-v=position-visibility', 'p-c-a=print-color-adjust', 'q=quotes', 'r-f=reading-flow', 'r-o=reading-order',
    'resize', 'right', 'rotate', 'r-g=row-gap', 'r-a=ruby-align',
    'r-p=ruby-position', 'scale', 's-b=scroll-behavior', 'scroll-initial-target', 'scroll-margin',
    'scroll-margin-block', 's-m-b-e=scroll-margin-block-end', 's-m-b-s=scroll-margin-block-start', 'scroll-margin-bottom', 's-m-i=scroll-margin-inline',
    's-m-i-e=scroll-margin-inline-end', 's-m-i-s=scroll-margin-inline-start', 's-m-l=scroll-margin-left', 's-m-r=scroll-margin-right', 's-m-t=scroll-margin-top',
    's-p=scroll-padding', 'scroll-padding-block', 's-p-b-e=scroll-padding-block-end', 's-p-b-s=scroll-padding-block-start', 'scroll-padding-bottom',
    's-p-i=scroll-padding-inline', 's-p-i-e=scroll-padding-inline-end', 's-p-i-s=scroll-padding-inline-start', 's-p-l=scroll-padding-left', 's-p-r=scroll-padding-right',
    's-p-t=scroll-padding-top', 's-s-a=scroll-snap-align', 's-s-s=scroll-snap-stop', 's-s-t=scroll-snap-type', 's-t-g=scroll-target-group',
    's-t=scroll-timeline', 's-t-a=scroll-timeline-axis', 's-t-n=scroll-timeline-name', 'scrollbar-color', 's-g=scrollbar-gutter',
    'scrollbar-width', 'shape-image-threshold', 'shape-margin', 'shape-outside', 's-r=shape-rendering',
    's-a=speak-as', 'stop-color', 'stop-opacity', 'stroke', 'stroke-dasharray',
    'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity',
    'stroke-width', 'tab-size', 't-l=table-layout', 'text-align', 't-a-l=text-align-last',
    'text-anchor', 'text-autospace', 'text-box', 't-b-e=text-box-edge', 't-b-t=text-box-trim',
    't-c-u=text-combine-upright', 'text-decoration', 't-d-c=text-decoration-color', 't-d-i=text-decoration-inset', 't-d-l=text-decoration-line',
    'text-decoration-skip', 't-d-s-i=text-decoration-skip-ink', 'text-decoration-style', 't-d-t=text-decoration-thickness', 't-e=text-emphasis',
    't-e-c=text-emphasis-color', 't-e-p=text-emphasis-position', 't-e-s=text-emphasis-style', 't-i=text-indent', 't-j=text-justify',
    'text-orientation', 'text-overflow', 't-r=text-rendering', 'text-shadow', 't-s-a=text-size-adjust',
    't-s-t=text-spacing-trim', 'text-transform', 't-u-o=text-underline-offset', 't-u-p=text-underline-position', 't-w=text-wrap',
    't-w-m=text-wrap-mode', 't-w-s=text-wrap-style', 'timeline-scope', 'timeline-trigger', 't-t-a-r=timeline-trigger-active-range',
    't-t-a-r-e=timeline-trigger-active-range-end', 't-t-a-r-s=timeline-trigger-active-range-start', 't-t-n=timeline-trigger-name', 't-t-s=timeline-trigger-source', 'top',
    'touch-action', 'transform', 'transform-box', 'transform-origin', 'transform-style',
    'transition', 'transition-behavior', 'transition-delay', 'transition-duration', 't-p=transition-property',
    't-t-f=transition-timing-function', 'translate', 'trigger-scope', 'u-b=unicode-bidi', 'u-m=user-modify',
    'u-s=user-select', 'v-e=vector-effect', 'v-a=vertical-align', 'v-t=view-timeline', 'v-t-a=view-timeline-axis',
    'v-t-i=view-timeline-inset', 'view-timeline-name', 'v-t-c=view-transition-class', 'view-transition-name', 'v-t-s=view-transition-scope',
    'v=visibility', 'white-space', 'w-s-c=white-space-collapse', 'widows', 'width',
    'w-c=will-change', 'w-b=word-break', 'word-spacing', 'w-m=writing-mode', 'x',
    'y', 'z-i=z-index', 'zoom',
  ];

  var MAP_BORDER_SIDES = {
    border: ['border'],
    'border-top': ['border-top'],
    'border-right': ['border-right'],
    'border-bottom': ['border-bottom'],
    'border-left': ['border-left'],
    'border-block': ['border-block'],
    'border-block-start': ['border-block-start'],
    'border-block-end': ['border-block-end'],
    'border-inline': ['border-inline'],
    'border-inline-start': ['border-inline-start'],
    'border-inline-end': ['border-inline-end'],
    outline: ['outline'],
    'column-rule': ['column-rule']
  };

  var MAP_PALETTE_RAW = {
    background: 1,
    'box-shadow': 1,
    'text-shadow': 1,
    'text-decoration': 1,
    caret: 1
  };

  var MAP_ENUM_PROPS = {
    display: DISPLAY,
    position: POSITION,
    overflow: OVERFLOW,
    'overflow-x': OVERFLOW,
    'overflow-y': OVERFLOW,
    'align-content': ALIGN,
    'align-items': ALIGN,
    'align-self': ALIGN,
    'justify-content': ALIGN,
    'justify-items': ALIGN,
    'justify-self': ALIGN,
    'place-content': ALIGN,
    'place-items': ALIGN,
    'place-self': ALIGN,
    'flex-direction': DIRECTION,
    'flex-wrap': FLEX_WRAP,
    'text-align': TEXT_ALIGN,
    'text-decoration': TEXT_DECORATION,
    'text-decoration-line': TEXT_DECORATION,
    'text-transform': TEXT_TRANSFORM,
    'white-space': WHITE_SPACE,
    'font-style': FONT_STYLE,
    cursor: CURSOR,
    'pointer-events': POINTER_EVENTS,
    'user-select': USER_SELECT,
    'border-style': BORDER_STYLE
  };

  var MAP_LENGTH_PROPS = {
    width: 1, height: 1,
    'min-width': 1, 'max-width': 1, 'min-height': 1, 'max-height': 1,
    'block-size': 1, 'inline-size': 1,
    'min-block-size': 1, 'max-block-size': 1,
    'min-inline-size': 1, 'max-inline-size': 1,
    top: 1, right: 1, bottom: 1, left: 1,
    inset: 1, 'inset-block': 1, 'inset-block-start': 1, 'inset-block-end': 1,
    'inset-inline': 1, 'inset-inline-start': 1, 'inset-inline-end': 1,
    gap: 1, 'row-gap': 1, 'column-gap': 1,
    'border-width': 1, 'border-radius': 1, 'border-spacing': 1,
    'outline-width': 1, 'outline-offset': 1,
    'font-size': 1,
    'letter-spacing': 1, 'word-spacing': 1, 'line-height': 1,
    'column-width': 1, 'column-rule-width': 1,
    'text-indent': 1, 'text-underline-offset': 1, 'text-decoration-thickness': 1,
    'shape-margin': 1, 'perspective': 1, 'flex-basis': 1, 'vertical-align': 1,
    'stroke-width': 1, 'stroke-dashoffset': 1,
    cx: 1, cy: 1, x: 1, y: 1, r: 1,
    'background-position': 1, 'background-position-x': 1, 'background-position-y': 1,
    'background-size': 1,
    'object-position': 1,
    'transform-origin': 1, 'perspective-origin': 1,
    'mask-position': 1, 'mask-size': 1,
    'offset-anchor': 1, 'offset-distance': 1, 'offset-position': 1,
    translate: 1
  };

  function isMapColorProp(prop) {
    return prop === 'color' ||
      prop === 'fill' ||
      prop === 'stroke' ||
      prop === 'stop-color' ||
      prop === 'flood-color' ||
      prop === 'lighting-color' ||
      /-color$/.test(prop);
  }

  function isMapLengthProp(prop) {
    if (prop === 'margin-trim' || prop === 'border-image-width') return false;
    if (MAP_LENGTH_PROPS[prop]) return true;
    if (/^(margin|padding|inset|scroll-margin|scroll-padding)(-|$)/.test(prop)) return true;
    if (/^border(-.+)?-(width|radius)$/.test(prop)) return true;
    return false;
  }

  function safeRaw(value) {
    var s = String(value);
    if (s === '') return null;
    if (/[\s;{}<>\\]/.test(s)) return null;
    if (s.indexOf('/*') !== -1 || s.indexOf('*/') !== -1) return null;
    if (/!important/i.test(s)) return null;
    return s;
  }

  function rawJoin(values, paletteToo) {
    var out = [];
    for (var i = 0; i < values.length; i++) {
      var s = safeRaw(values[i]);
      if (s == null) return null;
      if (paletteToo) {
        var key = s.toLowerCase();
        if (Object.prototype.hasOwnProperty.call(palette, key)) {
          s = 'var(--lb-' + key + ')';
        }
      }
      out.push(s);
    }
    return out.length ? out.join(' ') : null;
  }

  function mapColorBuilder(prop) {
    return function (values) {
      var out = [];
      for (var i = 0; i < values.length; i++) {
        var c = colorValue(values[i]);
        if (c == null) return null;
        out.push(c);
      }
      return out.length ? [[prop, out.join(' ')]] : null;
    };
  }

  function mapLengthBuilder(prop) {
    return function (values) {
      var out = [];
      for (var i = 0; i < values.length; i++) {
        var s = String(values[i]);
        if (/[\s;{}<>\\]/.test(s) || /!important/i.test(s)) return null;
        var v;
        if (prop === 'line-height') {
          v = lineHeightValue(s);
        } else if (prop === 'border-radius' || /-radius$/.test(prop)) {
          v = radiusValue(s);
        } else if (prop === 'border-width' || /-width$/.test(prop)) {
          v = borderWidthValue(s);
        } else {
          v = lengthValue(s);
        }
        if (v == null) {
          if (/^[a-z][a-z-]*$/i.test(s)) v = s;
          else if (/^[a-z-]+\([^;{}"']*\)$/i.test(s)) v = s;
          else return null;
        }
        if (v === 'auto' &&
            !/^(width|height|min-|max-|block-size|inline-size|top|right|bottom|left|inset|margin|scroll-margin|flex-basis|column-width|text-underline-offset|text-decoration-thickness|background-size|mask-size)/.test(prop)) {
          return null;
        }
        out.push(v);
      }
      return out.length ? [[prop, out.join(' ')]] : null;
    };
  }

  function mapBorderBuilder(prop) {
    var sides = MAP_BORDER_SIDES[prop];
    return function (values) {
      return borderFor(sides, values);
    };
  }

  function mapEnumBuilder(prop, map) {
    return function (values) {
      if (values.length === 1) {
        var v = aliasValue(map, values[0]);
        return v == null ? null : [[prop, v]];
      }
      return mapRawBuilder(prop)(values);
    };
  }

  function mapRawBuilder(prop) {
    var paletteToo = MAP_PALETTE_RAW[prop] === 1;
    return function (values) {
      var v = rawJoin(values, paletteToo);
      return v == null ? null : [[prop, v]];
    };
  }

  function genericBuilder(prop) {
    if (MAP_BORDER_SIDES[prop]) return mapBorderBuilder(prop);
    if (MAP_ENUM_PROPS[prop]) return mapEnumBuilder(prop, MAP_ENUM_PROPS[prop]);
    if (prop === 'opacity') {
      return function (values) {
        return values.length === 1 ? one(prop, opacityValue(values[0])) : null;
      };
    }
    if (prop === 'aspect-ratio') {
      return function (values) { return one(prop, ratioValue(values)); };
    }
    if (prop === 'font-weight') {
      return function (values) {
        return values.length === 1 ? one(prop, fontWeightValue(values[0])) : null;
      };
    }
    if (prop === 'grid-template-columns' || prop === 'grid-template-rows') {
      return function (values) { return one(prop, trackValue(values)); };
    }
    if (isMapColorProp(prop)) return mapColorBuilder(prop);
    if (isMapLengthProp(prop)) return mapLengthBuilder(prop);
    return mapRawBuilder(prop);
  }

  var MAP_PRIORITY_RULES = [
    [/^all$/, 0],
    [/^display$/, 10],
    [/^position$/, 11],
    [/^(top|right|bottom|left|inset)/, 12],
    [/^z-index$/, 13],
    [/^(float|clear)$/, 13],
    [/^aspect-ratio$/, 14],
    [/^overflow$/, 15],
    [/^overflow-/, 16],
    [/^visibility$/, 17],
    [/^flex$/, 20],
    [/^flex-/, 21],
    [/^order$/, 22],
    [/^(justify-content|align-content|place-content)$/, 24],
    [/^(align-items|justify-items|place-items)$/, 25],
    [/^(align-self|justify-self|place-self)$/, 26],
    [/^gap$/, 27],
    [/^(row-gap|column-gap)$/, 28],
    [/^grid$/, 28],
    [/^grid-/, 29],
    [/^column-rule$/, 100],
    [/^column-rule-/, 103],
    [/^(columns|column-)/, 29],
    [/^(width|height|min-|max-|block-size|inline-size|box-sizing)/, 40],
    [/^padding/, 50],
    [/^scroll-padding/, 52],
    [/^margin/, 54],
    [/^scroll-margin/, 56],
    [/^font$/, 69],
    [/^font-/, 70],
    [/^line-height$/, 74],
    [/^(letter-spacing|word-spacing)$/, 75],
    [/^text-align/, 76],
    [/^text-decoration$/, 77],
    [/^text-decoration-/, 78],
    [/^(text-transform|white-space|word-break|overflow-wrap|writing-mode|direction)$/, 78],
    [/^(color|background)$/, 80],
    [/^background-/, 81],
    [/^border$/, 99],
    [/^border-(block|inline)$/, 100],
    [/^border-(top|right|bottom|left)$/, 101],
    [/^border-(block|inline)-(start|end)$/, 102],
    [/^border(-.+)?-(width|style|color)$/, 103],
    [/^border-radius$/, 106],
    [/^border-.+-radius$/, 107],
    [/^outline$/, 100],
    [/^outline-/, 103],
    [/^opacity$/, 120],
    [/^animation$/, 120],
    [/^animation-/, 121],
    [/^(box-shadow|text-shadow|filter|backdrop-filter|clip-path|mask|transform|translate|rotate|scale|perspective)/, 121],
    [/^transition$/, 122],
    [/^transition-/, 123],
    [/^(cursor|resize)$/, 123],
    [/^(pointer-events|user-select|touch-action|will-change)$/, 125]
  ];

  function genericPriority(prop) {
    for (var i = 0; i < MAP_PRIORITY_RULES.length; i++) {
      if (MAP_PRIORITY_RULES[i][0].test(prop)) return MAP_PRIORITY_RULES[i][1];
    }
    return 150;
  }

  function registerMapAlias(alias, prop) {
    if (!alias || !prop) return;
    if (alias === 'd' || alias === 'r') return;
    if (alias === 'z') {
      alias = 'zoom';
      prop = 'zoom';
    }
    if (PROPERTY_DEFS[alias]) return;
    PROPERTY_DEFS[alias] = {
      priority: genericPriority(prop),
      build: genericBuilder(prop)
    };
  }

  MAP_DATA.forEach(function (entry) {
    var eq = entry.indexOf('=');
    var alias = eq === -1 ? entry : entry.slice(0, eq);
    var prop = eq === -1 ? entry : entry.slice(eq + 1);
    registerMapAlias(alias, prop);
    if (alias !== prop) registerMapAlias(prop, prop);
  });

  // The map's d = SVG d and r = SVG r are exposed under explicit names
  // because Laibery already uses d for display and r for border-radius.
  def('svg-d', 150, genericBuilder('d'));
  def('svg-r', 40, genericBuilder('r'));

  /* ============================================================
   * Token parser
   *
   *   [variant ':']* property '$' value ('$' value)*
   *
   * Examples:
   *   b$2$s$red
   *   p$16
   *   hover:bg$primary
   *   md:cols$3
   *   md:hover:b$2$s$primary
   * ============================================================ */

  function parseToken(token) {
    if (typeof token !== 'string' || token === '') return null;
    var dollar = token.indexOf('$');
    if (dollar === -1) return null;
    if (/[\s{};<>\\]/.test(token)) return null;
    if (token.indexOf('/*') !== -1 || token.indexOf('*/') !== -1) return null;

    // Split at the first "$" only. Values may contain ":" (URLs, data
    // URIs, functions); variants are the segments before the property
    // name in the part before that first "$".
    var head = token.slice(0, dollar);
    var colon = head.lastIndexOf(':');
    var key = colon === -1 ? head : head.slice(colon + 1);
    var variantPart = colon === -1 ? '' : head.slice(0, colon);
    var parts = variantPart ? variantPart.split(':') : [];
    if (!key || !PROPERTY_DEFS[key]) return null;

    var segments = token.slice(dollar + 1).split('$');
    var values = segments.filter(function (s) { return s !== ''; });
    if (!values.length) return null;

    var decls;
    try {
      decls = PROPERTY_DEFS[key].build(values);
    } catch (err) {
      return null;
    }
    if (!decls || !decls.length) return null;

    var pseudo = '';
    var scope = '';
    var media = '';
    var tier = 0;

    for (var i = 0; i < parts.length; i++) {
      var mod = parts[i];
      if (pseudoVariants[mod]) {
        pseudo += pseudoVariants[mod];
      } else if (scopeVariants[mod]) {
        scope += scopeVariants[mod] + ' ';
      } else if (breakpoints[mod]) {
        var q = '(min-width:' + breakpoints[mod] + 'px)';
        media = media ? media + ' and ' + q : q;
        if (breakpointTier[mod] > tier) tier = breakpointTier[mod];
      } else {
        return null;
      }
    }

    return {
      token: token,
      decls: decls,
      selector: scope + '[class~="' + token.replace(/"/g, '\\"') + '"]' + pseudo,
      media: media,
      tier: tier,
      priority: PROPERTY_DEFS[key].priority
    };
  }

  function ruleCss(parsed) {
    var important = settings.important ? '!important' : '';
    var body = '';
    for (var i = 0; i < parsed.decls.length; i++) {
      body += (i ? ';' : '') + parsed.decls[i][0] + ':' + parsed.decls[i][1] + important;
    }
    var css = parsed.selector + '{' + body + '}';
    if (parsed.media) css = '@media ' + parsed.media + '{' + css + '}';
    return css;
  }

  /* ============================================================
   * Stylesheet engine
   * ============================================================ */

  var records = new Map();
  var seen = new Set();
  var dirty = false;
  var scheduled = false;
  var observer = null;
  var styleElement = null;

  function baseCss() {
    var vars = [];
    Object.keys(palette).sort().forEach(function (key) {
      vars.push('--lb-' + key + ':' + palette[key]);
    });
    Object.keys(shadows).forEach(function (key) {
      vars.push('--lb-shadow-' + key + ':' + shadows[key]);
    });
    Object.keys(fontStacks).forEach(function (key) {
      vars.push('--lb-font-' + key + ':' + fontStacks[key]);
    });
    return ':root{' + vars.join(';') + '}' +
      '*,*::before,*::after{box-sizing:border-box}';
  }

  function buildCss() {
    var list = Array.from(records.values());
    list.sort(function (a, b) {
      if (a.tier !== b.tier) return a.tier - b.tier;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.token < b.token ? -1 : a.token > b.token ? 1 : 0;
    });
    var css = baseCss();
    for (var i = 0; i < list.length; i++) {
      css += '\n' + ruleCss(list[i]);
    }
    return css;
  }

  function ensureStyle() {
    if (typeof document === 'undefined') return null;
    if (styleElement && styleElement.isConnected) {
      if (settings.nonce) styleElement.nonce = settings.nonce;
      keepLast();
      return styleElement;
    }
    styleElement = document.getElementById(STYLE_ID);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = STYLE_ID;
      styleElement.setAttribute('data-laibery', VERSION);
      if (settings.nonce) styleElement.nonce = settings.nonce;
      // Attach first, then move it last. keepLast() intentionally ignores
      // detached elements, so creation has to append here.
      var parent = document.body || document.head || document.documentElement;
      if (parent) parent.appendChild(styleElement);
    }
    keepLast();
    return styleElement;
  }

  // Put the generated sheet after every site stylesheet so !important
  // ties are won by document order as well as by specificity.
  function keepLast() {
    if (!styleElement || !styleElement.isConnected) return;
    var parent = document.body || document.head || document.documentElement;
    if (!parent) return;
    if (styleElement.parentNode !== parent || parent.lastElementChild !== styleElement) {
      parent.appendChild(styleElement);
    }
  }

  function flushNow() {
    scheduled = false;
    if (!dirty) return;
    var el = ensureStyle();
    if (!el) return;
    el.textContent = buildCss();
    dirty = false;
  }

  var schedule = typeof queueMicrotask === 'function'
    ? function (fn) { queueMicrotask(fn); }
    : function (fn) { Promise.resolve().then(fn); };

  function registerToken(token) {
    if (seen.has(token)) return;
    seen.add(token);
    var parsed = parseToken(token);
    if (!parsed) return;
    records.set(token, parsed);
    dirty = true;
    if (!scheduled) {
      scheduled = true;
      schedule(function () { flushNow(); });
    }
  }

  function registerClasses(el) {
    var list = el.classList;
    if (!list) return;
    for (var i = 0; i < list.length; i++) {
      if (list[i].indexOf('$') !== -1) registerToken(list[i]);
    }
  }

  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    registerClasses(node);
    var els = node.querySelectorAll('[class]');
    for (var i = 0; i < els.length; i++) registerClasses(els[i]);
  }

  function handleMutations(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.target === styleElement) continue;
      if (m.type === 'childList') {
        for (var r = 0; r < m.removedNodes.length; r++) {
          if (m.removedNodes[r] === styleElement && !styleElement.isConnected) {
            // A framework or script removed the sheet. Rebuild it.
            styleElement = null;
            dirty = true;
            if (!scheduled) {
              scheduled = true;
              schedule(function () { flushNow(); });
            }
          }
        }
        if (styleElement) {
          for (var a = 0; a < m.addedNodes.length; a++) {
            var added = m.addedNodes[a];
            if (added !== styleElement && added.nodeType === 1 &&
                (added.tagName === 'STYLE' || added.tagName === 'LINK')) {
              keepLast();
              break;
            }
          }
        }
      }
      if (m.type === 'attributes') {
        registerClasses(m.target);
        continue;
      }
      for (var j = 0; j < m.addedNodes.length; j++) {
        var node = m.addedNodes[j];
        if (node.nodeType === 1) scan(node);
      }
    }
  }

  /* ============================================================
   * Public API
   * ============================================================ */

  function start() {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return api;
    readGlobalConfig();
    ensureStyle();
    scan(document.documentElement);
    if (!observer) {
      observer = new MutationObserver(handleMutations);
      observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
    flushNow();
    return api;
  }

  function stop() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    return api;
  }

  function add() {
    var tokens = [];
    for (var i = 0; i < arguments.length; i++) {
      String(arguments[i]).split(/\s+/).forEach(function (part) {
        if (part) tokens.push(part);
      });
    }
    tokens.forEach(registerToken);
    flushNow();
    return api;
  }

  function theme(overrides) {
    if (!overrides) return api;
    Object.keys(overrides).forEach(function (key) {
      var name = String(key).toLowerCase();
      if (!/^[a-z][a-z0-9-]*$/.test(name)) return;
      var value = String(overrides[key]);
      if (/[;{}]/.test(value)) return;
      palette[name] = value;
    });
    dirty = true;
    flushNow();
    return api;
  }

  function preview(token) {
    var parsed = parseToken(String(token).trim());
    return parsed ? ruleCss(parsed) : null;
  }

  function define(key, priority, build) {
    if (!/^[a-z][a-z0-9-]*$/.test(key) || typeof build !== 'function') return api;
    PROPERTY_DEFS[key] = {
      priority: typeof priority === 'number' ? priority : 200,
      build: build
    };
    // Retry tokens that were ignored before this definition existed.
    var retry = [];
    seen.forEach(function (token) {
      var dollar = token.indexOf('$');
      if (dollar === -1) return;
      var head = token.slice(0, dollar);
      var colon = head.lastIndexOf(':');
      var utilKey = colon === -1 ? head : head.slice(colon + 1);
      if (utilKey === key) retry.push(token);
    });
    retry.forEach(function (token) {
      seen.delete(token);
      registerToken(token);
    });
    dirty = true;
    flushNow();
    return api;
  }

  function config(options) {
    if (!options || typeof options !== 'object') {
      return { important: settings.important, nonce: settings.nonce };
    }
    settings.manual = true;
    if (Object.prototype.hasOwnProperty.call(options, 'important')) {
      settings.important = !!options.important;
    }
    if (typeof options.nonce === 'string') {
      settings.nonce = options.nonce;
      if (styleElement) styleElement.nonce = settings.nonce;
    }
    dirty = true;
    flushNow();
    return api;
  }

  function css() {
    return buildCss();
  }

  var api = {
    version: VERSION,
    start: start,
    stop: stop,
    add: add,
    theme: theme,
    define: define,
    config: config,
    preview: preview,
    css: css
  };

  if (typeof document !== 'undefined' &&
      !(typeof window !== 'undefined' && window.__LAIBERY_MANUAL__)) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { start(); }, { once: true });
    } else {
      start();
    }
  }

  return api;
});
