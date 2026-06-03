# Development-only Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_BACKEND_URL=http://localhost:3000

# We inject the --host flag here so Vite is accessible from your Windows browser
CMD ["npm", "run", "dev", "--", "--host"]