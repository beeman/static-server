# static-server

> 🐝 A static server based on [superstatic](https://github.com/firebase/superstatic)

## Docker Image

```
beeman/static-server
```

Also available on GitHub Container Registry as `ghcr.io/beeman/static-server`.

## Usage

The easiest way to use this is with `docker-compose` — no Dockerfile needed:

```yaml
services:
  web:
    image: beeman/static-server:latest
    volumes:
      - ./dist:/app
    ports:
      - 9876:9876
    environment:
      - ENV_API_URL=https://api.example.com/
```

Or with a `Dockerfile` if you prefer baking the files into the image:

```Dockerfile
FROM beeman/static-server:latest
COPY dist /app/
```

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `9876` | Port the server listens on |
| `ROOT` | `./app` | Directory to serve |
| `COMPRESSION` | `true` | Toggle compression |
| `DEBUG` | `false` | Toggle debug logging |
| `ENV_PREFIX` | `ENV_` | Prefix for env vars passed to the client |
| `HTTP_AUTH_USER` | — | Username for Basic HTTP Authentication |
| `HTTP_AUTH_PASS` | — | Password for Basic HTTP Authentication |

## Environment Passthrough

The server makes environment variables available to the static client at runtime.

Any env var prefixed with `ENV_` (configurable via `ENV_PREFIX`) is exposed to the client via:

- `/__/env.js` — sets `window.__env` with the variables
- `/__/env.json` — JSON object of the variables

This lets you configure your SPA at deploy time without rebuilding.

## License

MIT - Copyright (c) 2016-2026 Bram Borggreve
