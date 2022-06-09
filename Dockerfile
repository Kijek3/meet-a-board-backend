### STAGE 1: Build ###
FROM node:16.15.0-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci && npm prune
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]
