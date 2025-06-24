# Stage 1: Build
FROM node:22-slim AS builder


WORKDIR /app


# Install OpenSSL and other necessary packages for build stage
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*



# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3500

# # Set environment to production
# ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]