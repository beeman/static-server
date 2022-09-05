FROM node:18.8-alpine as build-env

WORKDIR /workspace

COPY package.json yarn.lock /workspace/

RUN yarn install

COPY . .

FROM gcr.io/distroless/nodejs

WORKDIR /workspace

COPY --from=build-env /workspace /workspace

CMD ["index.js"]
