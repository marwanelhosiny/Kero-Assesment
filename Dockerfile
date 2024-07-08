# Use the official Node.js image as the base image
FROM node:18-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the app code and .env file to the working directory
COPY . .

# Copy the .env file from the config folder to the working directory
COPY config/dev.config.env .env 

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
