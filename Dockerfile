# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:22-slim 

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3500
ENV NODE_ENV=production
ENV PORT=3500

CMD ["npm", "start"]