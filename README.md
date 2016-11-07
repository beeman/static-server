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
COPY dist /srv/app/

# Expose the default port
EXPOSE 9876

# Run application.
CMD ["node", "/srv/index.js"]
```

This is an example on how to use it with `docker-compose`:

```yaml
static:
  image: beeman/static-server:latest
  volumes:
    - ./app:/srv/app
  ports:
    - 9876:9876
  environment:
    - ENV_API_BASE_URL=https://my-api.now.sh/
    - ENV_API_VERSION=api/v1
```

## License

MIT - Copyright (c) 2016 Bram Borggreve
