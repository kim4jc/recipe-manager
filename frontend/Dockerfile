# Stage 1: Build the React app
FROM node:22 as builder
WORKDIR /app

ARG REACT_APP_BACKEND_API_URL
ENV REACT_APP_BACKEND_API_URL=${REACT_APP_BACKEND_API_URL}

COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:latest
# Remove the default Nginx configuration file (optional)
RUN rm /etc/nginx/conf.d/default.conf
# Copy your custom Nginx configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]