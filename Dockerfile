FROM node:20.10.0-alpine as build-env

RUN corepack enable && corepack prepare pnpm@8.12.1 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml /workspace/

RUN pnpm install --no-frozen-lockfile

COPY . .

FROM gcr.io/distroless/nodejs

WORKDIR /workspace

COPY --from=build-env /workspace /workspace

CMD ["index.js"]
