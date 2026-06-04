# ==========================================
# STAGE 1: Testing
# ==========================================
FROM node:20 AS test-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN CI=true npm run test

# ==========================================
# STAGE 2: Build the static files
# ==========================================
FROM node:20 AS build-stage
WORKDIR /usr/src/app
COPY --from=test-stage /usr/src/app /usr/src/app

# We use a relative URL so it routes perfectly through the Nginx proxy!
ENV VITE_BACKEND_URL=/api

RUN npm run build

# ==========================================
# STAGE 3: Serve with Nginx
# ==========================================
FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80