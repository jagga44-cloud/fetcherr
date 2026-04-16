FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm install --production=false

COPY tsconfig.json ./
COPY src ./src

RUN mkdir -p /app/data

EXPOSE 9990

CMD ["node", "--import", "tsx/esm", "src/index.ts"]
