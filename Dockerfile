FROM node:14-alpine AS BUILDER
WORKDIR /app
COPY ./package*.json ./
RUN npm install

FROM node:14-alpine AS APP
WORKDIR /app
COPY . .
COPY --from=BUILDER /app/node_modules node_modules
ENTRYPOINT ["node", "src/index.js"]
