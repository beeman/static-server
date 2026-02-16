'use strict'

const http = require('http')
const {
  REDIRECT_URL,
} = process.env

// Redirect mode: if REDIRECT_URL is set, redirect all requests and skip everything else
if (REDIRECT_URL) {
  // Validate REDIRECT_URL is a valid absolute URL
  try {
    new URL(REDIRECT_URL)
  } catch {
    console.error(`Error: Invalid REDIRECT_URL "${REDIRECT_URL}". Must be an absolute URL (e.g. https://example.com).`)
    process.exit(1)
  }

  const port = process.env.PORT || 9876
  const statusCode = process.env.REDIRECT_STATUS === '302' ? 302 : 301
  // Strip trailing slash from target to avoid double slashes
  const target = REDIRECT_URL.replace(/\/+$/, '')

  const server = http.createServer((req, res) => {
    // Health endpoint still works in redirect mode
    if (req.url === '/__/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'ok', mode: 'redirect' }))
      return
    }
    // Safely parse the request URL to prevent open redirect via protocol-relative paths
    let location
    try {
      const { pathname, search } = new URL(req.url, 'http://dummy.base')
      location = `${target}${pathname}${search}`
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('Bad Request')
      return
    }
    res.writeHead(statusCode, { Location: location })
    res.end()
  })

  server.listen(port, () => {
    console.log(`Redirect server listening on http://0.0.0.0:${port} → ${target} [${statusCode}]`)
  })
  return
}

const superstatic = require('superstatic/lib/server')
const zlib = require('zlib')
const {
  COMPRESSION,
  DEBUG,
  ENV_PREFIX,
  HTTP_AUTH_PASS,
  HTTP_AUTH_USER,
  PORT,
  ROOT,
  SPA,
} = process.env

// Start with an empty object of env vars
const env = {}

// We only pick up env vars with this prefix
const envPrefix = ENV_PREFIX || 'ENV_'

// Get all the keys of process.env
const envKeys = Object.keys(process.env)

// Loop through all of them to see if we need to add the prefixed ones.
envKeys.forEach(envKey => {
  // If the env var key matches the prefix, add it to the object
  if (envKey.startsWith(envPrefix)) {
    const shortKey = envKey.replace(envPrefix, '')
    env[shortKey] = process.env[envKey]
  }
})

// Build superstatic config
const config = {
  public: ROOT || './app',
}

// SPA mode (default: true): rewrite all routes to index.html for client-side routing
const spaEnabled = SPA !== 'false'
if (spaEnabled) {
  config.rewrites = [{ source: '**', destination: '/index.html' }]
}

const compressionEnabled = COMPRESSION !== 'false'

// This is the configuration of the server
const options = {
  port: PORT || 9876,
  config,
  cwd: __dirname,
  errorPage: __dirname + '/error.html',
  compression: false, // We handle compression ourselves for brotli support
  debug: DEBUG === 'true',
  env,
}

if (HTTP_AUTH_USER && HTTP_AUTH_PASS) {
  options.protect = [HTTP_AUTH_USER, HTTP_AUTH_PASS].join(':')
}

const app = superstatic(options)

// Health endpoint — added before superstatic middleware (runs first in connect stack)
app.use((req, res, next) => {
  if (req.url === '/__/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }
  next()
})

// Compression middleware with brotli + gzip + deflate support
if (compressionEnabled) {
  app.use((req, res, next) => {
    const accept = req.headers['accept-encoding'] || ''

    let encoding = null
    if (accept.includes('br')) encoding = 'br'
    else if (accept.includes('gzip')) encoding = 'gzip'
    else if (accept.includes('deflate')) encoding = 'deflate'

    if (!encoding) return next()

    const origWrite = res.write.bind(res)
    const origEnd = res.end.bind(res)
    const chunks = []

    res.write = function (chunk) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      return true
    }

    res.end = function (chunk) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      const body = Buffer.concat(chunks)

      // Skip compression for small responses (<1KB)
      if (body.length < 1024) {
        origWrite(body)
        return origEnd()
      }

      let compress
      if (encoding === 'br') compress = zlib.brotliCompressSync
      else if (encoding === 'gzip') compress = zlib.gzipSync
      else compress = zlib.deflateSync

      const compressed = compress(body)
      res.setHeader('Content-Encoding', encoding)
      res.removeHeader('Content-Length')
      origWrite(compressed)
      origEnd()
    }

    next()
  })
}

app.listen(err => {
  if (err) {
    console.log(err)
  }
  const features = [
    spaEnabled ? 'SPA' : null,
    compressionEnabled ? 'brotli+gzip' : null,
  ].filter(Boolean).join(', ')
  console.log(`Static server listening on http://0.0.0.0:${options.port} [${features}]`)
})
