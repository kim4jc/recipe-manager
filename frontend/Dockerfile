# Use an official Node.js image as the base image.
FROM node:14

# Create and change to the app directory.
WORKDIR /app

# Copy package.json and package-lock.json (if available) and install dependencies.
COPY package*.json ./
RUN npm install
# Copy the rest of your application code.
COPY . .

# Expose the port that your app runs on.
EXPOSE 3000

# Start the React application.
CMD ["npm", "start"]