# static-server

> 🐝 A static server based on [superstatic](https://github.com/firebase/superstatic)

## Docker Image

```
beeman/static-server
```

Also available on GitHub Container Registry as `ghcr.io/beeman/static-server`.

Multi-arch: `linux/amd64` and `linux/arm64`.

## Usage

The easiest way to use this is with `docker-compose` — no Dockerfile needed:

```yaml
services:
  web:
    image: beeman/static-server:latest
    volumes:
      - ./dist:/workspace/app:ro
    ports:
      - 9876:9876
    environment:
      - ENV_API_URL=https://api.example.com/
```

Or with a `Dockerfile` if you prefer baking the files into the image:

```Dockerfile
FROM beeman/static-server:latest
COPY dist /workspace/app/
```

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `9876` | Port the server listens on |
| `ROOT` | `./app` | Directory to serve (relative to `/workspace`) |
| `SPA` | `true` | SPA mode — unknown routes serve `index.html` |
| `COMPRESSION` | `true` | Compression with brotli, gzip, and deflate |
| `DEBUG` | `false` | Toggle debug logging |
| `ENV_PREFIX` | `ENV_` | Prefix for env vars passed to the client |
| `HTTP_AUTH_USER` | — | Username for Basic HTTP Authentication |
| `HTTP_AUTH_PASS` | — | Password for Basic HTTP Authentication |

## Features

### SPA Mode

Enabled by default. All unknown routes serve `index.html`, allowing client-side routing to work. Static assets are still served normally.

Set `SPA=false` to disable — unknown routes will return 404 instead.

### Compression

Supports **brotli**, **gzip**, and **deflate**. The best encoding is chosen based on the client's `Accept-Encoding` header. Responses under 1KB are served uncompressed.

### Environment Passthrough

The server makes environment variables available to the static client at runtime.

Any env var prefixed with `ENV_` (configurable via `ENV_PREFIX`) is exposed to the client via:

- `/__/env.js` — sets `window.__env` with the variables
- `/__/env.json` — JSON object of the variables

This lets you configure your SPA at deploy time without rebuilding.

### Health Check

`GET /__/health` returns `{"status":"ok"}` with a 200 status code.

## License

MIT - Copyright (c) 2016-2026 Bram Borggreve
