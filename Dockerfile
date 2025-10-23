FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY eslint.config.js ./
COPY index.html ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY vite.config.js ./
COPY .env ./

RUN npm run build && npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
