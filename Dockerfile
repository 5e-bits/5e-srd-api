FROM node:14.15.0-alpine

## Add code
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/
RUN npm install

COPY . /app

# Start the main process.
CMD ["npm", "start"]
