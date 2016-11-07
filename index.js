'use strict'

const superstatic = require('superstatic/lib/server')

// Start with a default object of env vars
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
}

// We only pick up env vars with this prefix
const envPrefix = process.env.ENV_PREFIX || 'ENV_'

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
  port: process.env.PORT || 9876,
  config: {
    public: process.env.ROOT || './app'
  },
  cwd: __dirname,
  errorPage: __dirname + '/error.html',
  gzip: process.env.GZIP || true,
  debug: process.env.DEBUG || false,
  env,
}

const app = superstatic(options)

app.listen((err) => {
  if (err) { console.log(err) }
  console.log(`Static server listening on port ${options.port} ...`)
})
