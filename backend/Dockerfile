# ---- Build Stage ----
FROM node:18-alpine AS build

WORKDIR /app

# Copy only the files needed for dependency installation
COPY package*.json ./

# Install dependencies efficiently while omitting dependencies on dev stage, clean cache in same layer
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY . .

# ---- Runtime Stage ----
FROM node:18-alpine

WORKDIR /app

# Copy only what’s needed from the build stage
COPY --from=build /app /app

# Combine environment setup, port expose, and cleanup
ENV NODE_ENV=production \
    PORT=5000

# Define the port to expose
EXPOSE 5000

# Command to run the program
CMD ["node", "server.js"]


