FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5050

CMD ["npm", "start"]