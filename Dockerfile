# Use an official Node.js image as the base image
FROM node:19

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Nest.js application
RUN pnpm run build

EXPOSE 8000

CMD ["pnpm", "run", "start"]
