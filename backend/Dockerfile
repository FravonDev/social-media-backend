FROM node:18.17.1-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install

ADD . .

CMD ["npm", "run", "start:dev"]