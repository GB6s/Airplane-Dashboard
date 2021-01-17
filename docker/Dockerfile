FROM node:12.18.4

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

CMD ["yarn", "start"]
