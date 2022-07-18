FROM node:16-bullseye-slim AS build
WORKDIR /source
COPY src/ ./src
COPY package.json ./
COPY puppeteer/ ./puppeteer
RUN npm i
RUN npm install --global npm-run-all
RUN npm run build-all
WORKDIR /source/puppeteer
RUN npm i
RUN node thumbnails.js
#FROM nginx
#COPY public_html /usr/share/nginx/html
