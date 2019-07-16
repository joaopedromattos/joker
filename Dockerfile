FROM node:11.5.0
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./src /usr/src/app/src
COPY .babelrc /usr/src/app
COPY .env /usr/src/app
COPY .eslintrc.js /usr/src/app
COPY .gitignore /usr/src/app
COPY package.json /usr/src/app
COPY webpack.config.client.js /usr/src/app
COPY webpack.config.server.js /usr/src/app
COPY webpack.config.js /usr/src/app
COPY server.cert /usr/src/app
COPY server.key /usr/src/app

RUN npm install
RUN npm run build:prod

EXPOSE 1337
CMD npm run serve:prod