FROM node:11-alpine as build-env

WORKDIR /build

# Expose build args.
COPY package.json package-lock.json /build/
RUN npm install
COPY . /build

FROM gcr.io/distroless/nodejs

COPY --from=build-env /build /app

WORKDIR /app

CMD ["index.js"]
