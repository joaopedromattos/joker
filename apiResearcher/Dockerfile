FROM node
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api
COPY ./controller /usr/src/api/controller
COPY ./model /usr/src/api/model
COPY ./routes /usr/src/api/routes
COPY ./statisticalModule /usr/src/api/statisticalModule
COPY package.json /usr/src/api
COPY server.js /usr/src/api
RUN npm install
EXPOSE 3000
CMD npm run api
