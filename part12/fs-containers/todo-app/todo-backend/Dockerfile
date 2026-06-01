# 1. Use a modern, stable Node version that supports your new packages
FROM node:20

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy over the file you just showed me
COPY package*.json ./

# 4. Install the dependencies
RUN npm install

# 5. Copy the rest of the backend code
COPY . .

# 6. Express defaults to port 3000, so we expose it
ENV PORT=3000
EXPOSE 3000

# 7. The exact script from your package.json
CMD ["npm", "start"]