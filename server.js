'use strict';

/*
 * Zero-dependency production server for Laibery.
 *
 * It serves the static demo and docs, adds a health endpoint for Render, and
 * injects the deployed site's name into HTML pages. The name is taken from
 * SITE_NAME, then Render's RENDER_SERVICE_NAME, then the request hostname,
 * with audio-auto-play as the local/default fallback.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number.parseInt(process.env.PORT || '10000', 10);
const BRAND_NAME = 'Laibery';
const DEFAULT_SITE_NAME = 'audio-auto-play';

let version = '0.0.0';
try {
  version = require('./package.json').version;
} catch {
  // package.json is optional at runtime; the server still works without it.
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function requestHost(req) {
  const forwarded = clean(req.headers['x-forwarded-host']).split(',')[0];
  const host = clean(forwarded) || clean(req.headers.host);
  return host.replace(/:\d+$/, '').replace(/^\[|\]$/g, '').toLowerCase();
}

function isLocalHost(host) {
  return !host ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local');
}

function detectSiteName(req) {
  const explicit = clean(process.env.SITE_NAME) || clean(process.env.LAIBERY_SITE_NAME);
  if (explicit) return explicit.slice(0, 120);

  const renderService = clean(process.env.RENDER_SERVICE_NAME);
  if (renderService) return renderService.slice(0, 120);

  const host = clean(process.env.RENDER_EXTERNAL_HOSTNAME) || requestHost(req || { headers: {} });
  if (!isLocalHost(host)) {
    return host.replace(/^www\./i, '').replace(/\.onrender\.com$/i, '').slice(0, 120);
  }

  return DEFAULT_SITE_NAME;
}

function siteInfo(req) {
  const host = clean(process.env.RENDER_EXTERNAL_HOSTNAME) || requestHost(req || { headers: {} });
  return {
    name: detectSiteName(req),
    host,
    url: clean(process.env.RENDER_EXTERNAL_URL) || (host && !isLocalHost(host) ? 'https://' + host : '')
  };
}

function siteScript(info) {
  const json = JSON.stringify(info)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return '<script>window.__LAIBERY_SITE__ = ' + json + ';</script>';
}

function injectSiteInfo(html, info) {
  const tags = [
    '<meta name="application-name" content="' + escapeHtml(info.name) + '">',
    '<meta property="og:site_name" content="' + escapeHtml(info.name) + '">',
    siteScript(info)
  ].join('\n');

  let output = html.replace('</head>', tags + '\n</head>');

  if (info.name && info.name !== BRAND_NAME) {
    output = output.replace(/<title>Laibery(?=[\s\u2014\u2013-]|<\/title>)/, function () {
      return '<title>' + escapeHtml(info.name);
    });
  }

  return output;
}

function contentType(file) {
  return MIME_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

function cacheControl(file) {
  const extension = path.extname(file).toLowerCase();
  if (extension === '.html') return 'no-cache';
  if (extension === '.js' || extension === '.css') return 'public, max-age=3600';
  if (extension === '.json' || extension === '.md' || extension === '.txt') return 'public, max-age=300';
  return 'public, max-age=86400';
}

function sendJson(res, status, value) {
  const body = Buffer.from(JSON.stringify(value));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function sendText(res, status, text) {
  const body = Buffer.from(text, 'utf8');
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function resolveFile(pathname) {
  if (pathname === '/') pathname = '/demo/index.html';
  if (pathname.endsWith('/')) pathname += 'index.html';

  const file = path.resolve(ROOT, '.' + pathname);
  const relative = path.relative(ROOT, file);

  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  if (relative.split(path.sep).some((segment) => segment.startsWith('.'))) return null;

  return file;
}

function handleRequest(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return sendText(res, 405, 'Method not allowed');
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return sendText(res, 400, 'Bad request');
  }

  if (pathname === '/healthz' || pathname === '/health') {
    return sendJson(res, 200, {
      ok: true,
      name: siteInfo(req).name,
      version,
      uptime: Math.round(process.uptime())
    });
  }

  if (pathname === '/site.json') {
    return sendJson(res, 200, siteInfo(req));
  }

  if (pathname === '/favicon.ico') {
    res.writeHead(204, { 'Cache-Control': 'public, max-age=86400' });
    return res.end();
  }

  if (pathname === '/docs') {
    res.writeHead(301, { Location: '/docs/' });
    return res.end();
  }

  if (pathname === '/demo') {
    res.writeHead(301, { Location: '/demo/' });
    return res.end();
  }

  const file = resolveFile(pathname);

  if (!file) {
    return sendText(res, 404, 'Not found');
  }

  let stat;
  try {
    stat = fs.statSync(file);
    if (stat.isDirectory()) {
      res.writeHead(301, { Location: pathname + '/' });
      return res.end();
    }
  } catch {
    return sendText(res, 404, 'Not found');
  }

  let data;
  try {
    data = fs.readFileSync(file);
  } catch {
    return sendText(res, 500, 'Could not read file');
  }

  const extension = path.extname(file).toLowerCase();
  const isHtml = extension === '.html';

  if (isHtml) {
    data = Buffer.from(injectSiteInfo(data.toString('utf8'), siteInfo(req)), 'utf8');
  }

  res.writeHead(200, {
    'Content-Type': contentType(file),
    'Content-Length': data.length,
    'Cache-Control': cacheControl(file),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN'
  });

  if (req.method === 'HEAD') {
    return res.end();
  }

  res.end(data);
}

const server = http.createServer((req, res) => {
  try {
    handleRequest(req, res);
  } catch (error) {
    console.error('Request failed:', error);
    if (!res.headersSent) sendText(res, 500, 'Internal server error');
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  const name = detectSiteName({ headers: {} });
  console.log('Laibery v' + version + ' listening on http://' + HOST + ':' + PORT);
  console.log('Site name: ' + name + ' (auto-detected; override with SITE_NAME)');
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
