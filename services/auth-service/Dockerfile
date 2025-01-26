# Use the Node.js base image
FROM node:18-alpine


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application, including the `src` folder
COPY . .

# Expose the port for the application
EXPOSE 4000

# Start the application
CMD ["node", "src/index.js"]
