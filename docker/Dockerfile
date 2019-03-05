FROM node:8.7.0-alpine

RUN apk update && apk add bash && apk add yarn

RUN yarn global add pm2

RUN mkdir -p /api

WORKDIR /api

COPY package.json yarn.lock  ./

RUN yarn install

# RUN npm i

COPY ./ ./

COPY ./docker/ecosystem.config.js /ecosystem.config.js

CMD ["pm2", "start", "--no-daemon", "/ecosystem.config.js"]
