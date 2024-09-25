FROM node:20.10.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY tsconfig.json ./
RUN npm run build
EXPOSE 5000
USER node
CMD ["node", "./dist-server/index.js"] 