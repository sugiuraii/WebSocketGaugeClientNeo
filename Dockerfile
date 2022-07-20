# Application build container (public_html)
FROM node:16-bullseye-slim AS build
WORKDIR /source
COPY src/ ./src
COPY package.json ./
RUN npm i
RUN npm install --global npm-run-all
RUN npm run build-all

# Build thumbnail by playwright
FROM mcr.microsoft.com/playwright AS thumbnails
ENV PWUSER pwuser

RUN apt-get update && apt-get install -y sudo bash-completion less nano wget curl\
 && usermod -aG sudo $PWUSER\
 && echo '%sudo ALL=(ALL) NOPASSWD:ALL' | tee -a /etc/sudoers\
 && npm i -g npm

USER $PWUSER

WORKDIR /home/$PWUSER/playwright
COPY playwright/thumbnails.js ./
COPY public_html/ ../public_html/
RUN sudo chown -R $PWUSER:$PWUSER /home/$PWUSER
# COPY --chown=$PWUSER:$PWUSER . .

RUN npm init -y\
 && npm i -D playwright @playwright/test dotenv express

RUN node thumbnails.js

FROM nginx
COPY --from=thumbnails /home/pwuser/public_html /usr/share/nginx/html
