FROM node:16 AS build
WORKDIR /build
COPY package.json .
COPY src/ ./src
COPY public_html/thumbnails.js public_html/thumbnails.js 
RUN npm install
RUN npm run build-all

FROM nginx
COPY --from=build /build/public_html /usr/share/nginx/html
