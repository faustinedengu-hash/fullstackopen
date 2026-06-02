# ==========================================
# STAGE 1: Build the static files
# ==========================================
FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# We must inject the URL here so Vite can bake it into the static HTML/JS files during the build!
ENV VITE_BACKEND_URL=http://localhost:3000

# This compiles your React code and spits it into a 'dist' folder
RUN npm run build


# ==========================================
# STAGE 2: Serve with Nginx
# ==========================================
FROM nginx:1.25-alpine

# We grab ONLY the 'dist' folder from Stage 1 and throw everything else away
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Nginx serves on port 80 by default
EXPOSE 80