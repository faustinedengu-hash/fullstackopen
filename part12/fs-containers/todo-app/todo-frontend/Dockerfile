# ==========================================
# STAGE 1: Testing
# ==========================================
FROM node:20 AS test-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# We run the tests in CI mode so it doesn't hang waiting for user input
RUN CI=true npm run test

# ==========================================
# STAGE 2: Build the static files
# ==========================================
FROM node:20 AS build-stage
WORKDIR /usr/src/app
# We only proceed to this stage if the tests passed! We copy the code over.
COPY --from=test-stage /usr/src/app /usr/src/app
ENV VITE_BACKEND_URL=http://localhost:3000
RUN npm run build

# ==========================================
# STAGE 3: Serve with Nginx
# ==========================================
FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80