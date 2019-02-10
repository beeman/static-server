# static-server

> 🐝 A static server based on superstatic

## Configuration

`PORT`

> The port on which this server listens (default: 9876)

`ROOT`

> The directory that is served (default: './app')

`GZIP`

> Toggle gzip encoding (default: true)

`DEBUG`

> Toggle debugging (default: false)

`ENV_PREFIX`

> Prefix of ENV VARS passed to the client (read below) (default: 'ENV_')

`HTTP_AUTH_USER` and `HTTP_AUTH_USER`

> Username and password to use for Basic HTTP Authentication

## Environment

The server allows making environment variables available to the static client.

It will parse all the environment variables that are prefixed with `ENV_` and make them available to the client.

The client can read the file `/__/env.js` or  `/__/env.json` to access these variables.

In case of `/__/env.js` there will be an object available on `window.__env`.

## Docker

This server is available as a Docker image.

This is an example on how to use it from a `Dockerfile`:

```Dockerfile
# Base image.
FROM beeman/static-server:latest

# Copy the app to the image
COPY dist /app/

# Expose the default port
EXPOSE 9876

# Run application.
CMD ["node", "/app/index.js"]
```

This is an example on how to use it with `docker-compose`:

```yaml
static:
  image: beeman/static-server:latest
  volumes:
    - ./app:/app
  ports:
    - 9876:9876
  environment:
    - ENV_API_URL=https://api.example.com/
```

## License

MIT - Copyright (c) 2016-2019 Bram Borggreve
