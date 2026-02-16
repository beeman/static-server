FROM oven/bun:latest AS build

WORKDIR /workspace

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production

COPY . .

FROM gcr.io/distroless/nodejs24-debian12

WORKDIR /workspace

COPY --from=build /workspace /workspace

EXPOSE 9876

CMD ["index.js"]
