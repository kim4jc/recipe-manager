# Use an official Node.js image as the base image.
FROM node:22

# Create and change to the app directory.
WORKDIR /app

# Declare default build arguments
ARG NODE_ENV=production

# Set environment variables in the container based on the build arguments
ENV NODE_ENV=${NODE_ENV}

# Copy package.json and package-lock.json (if available) and install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of your application code.
COPY . .

# Expose the port that your app runs on.
EXPOSE 3001

# Start the application.
CMD ["node", "index.js"]