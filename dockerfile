FROM --platform=linux/amd64 node:20-alpine

WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json files.
COPY package*.json ./

# Install dependencies.
RUN npm ci \
    && npm install -g typescript \
    && npm install -g serve \
    && npm cache clean --force

# Copy the rest of the application code.
COPY . .

# Build the frontend application.
RUN npm run build

# Debugging step: Check if the dist directory exists and its contents
RUN echo "Contents of /usr/src/frontend:" && ls -alh /usr/src/frontend \
    && echo "Contents of /usr/src/frontend/dist:" && ls -alh /usr/src/frontend/dist

# Expose port 6489.
EXPOSE 6489

# Define the command to start the server.
CMD ["serve", "-s", "dist", "-l", "6489"]
