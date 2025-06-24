# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

# Install OpenSSL and dependencies for build stage
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:22-slim

WORKDIR /app

# Only copy what's needed for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./  # Nếu bạn có file này

ENV NODE_ENV=production
ENV PORT=3500

EXPOSE 3500

CMD ["npm", "start"]
