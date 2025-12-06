# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM node:20-alpine AS backend
WORKDIR /app/backend

# Copy dependency manifests first for better caching
COPY backend/package*.json ./

# Copy Prisma schema where backend scripts expect it (../prisma from WORKDIR)
COPY prisma ../prisma

RUN npm install

# Copy the backend source
COPY backend/ .

# Copy built frontend assets into the backend's public directory
COPY --from=frontend-builder /app/frontend/dist ./public
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
