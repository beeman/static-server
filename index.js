'use strict'

const superstatic = require('superstatic/lib/server')
const {
  DEBUG,
  ENV_PREFIX,
  GZIP,
  HTTP_AUTH_PASS,
  HTTP_AUTH_USER,
  PORT,
  ROOT,
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
  if (envKey.substr(0, envPrefix.length) === envPrefix) {
    const shortKey = envKey.replace(envPrefix, '')
    env[shortKey] = process.env[envKey]
  }
})

// This is the configuration of the server
const options = {
  port: PORT || 9876,
  config: {
    public: ROOT || './app',
  },
  cwd: __dirname,
  errorPage: __dirname + '/error.html',
  gzip: GZIP || true,
  debug: DEBUG || false,
  env,
}

if (HTTP_AUTH_USER && HTTP_AUTH_PASS) {
  options.protect = [HTTP_AUTH_USER, HTTP_AUTH_PASS].join(':')
}

const app = superstatic(options)

app.listen(err => {
  if (err) {
    console.log(err)
  }
  console.log(`Static server listening on http://0.0.0.0:${options.port} ...`)
})
