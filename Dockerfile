# Use the official Node.js image as the base image
FROM node:14-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the app code to the working directory
COPY . .

# Install app dependencies
RUN npm install express mongoose

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
