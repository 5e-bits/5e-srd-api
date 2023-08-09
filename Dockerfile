FROM node:18-alpine

## Add code
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/
RUN npm install

COPY . /app

RUN npm run build

# Start the main process.
CMD ["node", "dist/src/start.js"]
