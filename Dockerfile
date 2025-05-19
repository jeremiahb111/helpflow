FROM node:23-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
EXPOSE 5000
CMD ["npm", "run", "dev"]

FROM node:23-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
EXPOSE 5173
CMD ["npm", "run", "dev"]