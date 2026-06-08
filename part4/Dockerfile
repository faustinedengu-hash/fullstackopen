FROM node:22-alpine

WORKDIR /usr/src/app

# Copy dependency files first
COPY package*.json ./

# Install ONLY production dependencies (ignores nodemon, supertest, etc.)
RUN npm ci --omit=dev

# Copy the actual backend code
COPY . .

# Switch to a non-root user for production security
USER node

# Expose the API port
EXPOSE 3003

# Run the standard node command (no nodemon!)
CMD ["npm", "start"]