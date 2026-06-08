# Stage 1: Build the React application
FROM node:22-alpine AS build-stage

WORKDIR /usr/src/app

# Copy dependency files and install ALL dependencies (including Vite)
COPY package*.json ./
RUN npm ci

# Copy the source code and run the Vite build command
COPY . .
RUN npm run build

# Stage 2: Serve the static files
FROM nginx:1.25-alpine

# Copy the compiled static files from the build stage into Nginx's serving directory
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Expose Nginx's internal port
EXPOSE 80