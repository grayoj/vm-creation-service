FROM node:20

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

# Build the Nest.js application
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start:prod"]
