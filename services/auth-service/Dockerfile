# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Install nodemon globally for watching
RUN npm install -g nodemon

# Expose the application port
EXPOSE 4000

# Default command for development
CMD ["nodemon", "src/index.js"]

# Add this to the Dockerfile
RUN npm ci
