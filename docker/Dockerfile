FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY app/*.js .
COPY app/contracts/*.json ./contracts/
COPY app/package*.json .
COPY app/client/build ./client/build

RUN npm ci --only=production

EXPOSE 8080

CMD [ "node", "index.js" ]