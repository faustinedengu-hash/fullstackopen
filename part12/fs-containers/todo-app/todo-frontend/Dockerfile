FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite 8 requires --host to allow external connections from Windows
CMD ["npm", "run", "dev", "--", "--host"]