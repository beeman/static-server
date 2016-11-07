# Base image.
FROM mhart/alpine-node:7.0.0

# Set /srv as working directory.
WORKDIR /srv

# Expose build args.
COPY package.json /srv/
RUN npm install && npm cache clean
COPY . /srv

# Run application.
CMD ["node", "index.js"]
