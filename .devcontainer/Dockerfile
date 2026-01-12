# File: Dockerfile
# This Dockerfile is for a Next.js application,
# which is a React framework for building server-rendered applications.
# It uses Node.js as the base image and installs the necessary dependencies,
# builds the application, and sets up the container to run the app in production mode.

# Use the official Node.js image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /workspace

# Install necessary dependencies for development (like ESLint, Prettier, etc.)
RUN npm install -g typescript eslint prettier

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set default command to start the app in development mode
CMD ["npm", "run", "dev"]
