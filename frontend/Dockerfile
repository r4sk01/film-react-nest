FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY . .
CMD ["npm", "run", "build"]