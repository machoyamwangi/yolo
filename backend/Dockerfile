# ---- Build Stage ----
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# ---- Runtime Stage ----
FROM node:18-alpine

WORKDIR /app

# Copy built node_modules and application files
COPY --from=build /app /app

ENV NODE_ENV=production \
    PORT=5000

EXPOSE 5000

CMD ["npm", "start"]



