# Development-only Dockerfile for the Backend
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies, including nodemon
RUN npm install

COPY . .

# Fire up nodemon using your dev script
CMD ["npm", "run", "dev"]