# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the service port
EXPOSE 5000

#RUN this command
RUN npx prisma generate

# Start the service with nodemon (for development)
CMD ["npm", "run", "dev"]
