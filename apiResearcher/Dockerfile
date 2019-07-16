FROM python:3

RUN \
  apt-get update && \
  apt-get install -yqq apt-transport-https
RUN \
  echo "deb https://deb.nodesource.com/node_10.x stretch main" > /etc/apt/sources.list.d/nodesource.list && \
  wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
  wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  apt-get update && \
  apt-get install -yqq nodejs yarn && \
  pip install -U pip && pip install pipenv && \
  npm i -g npm@^6 && \
  rm -rf /var/lib/apt/lists/*

RUN python -m pip install --user numpy scipy matplotlib ipython jupyter pandas sympy nose requests
RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY ./controller /usr/src/api/controller
COPY ./model /usr/src/api/model
COPY ./routes /usr/src/api/routes
COPY ./statisticalModule /usr/src/api/statisticalModule
COPY package.json /usr/src/api/
COPY server.js /usr/src/api/
# COPY server.cert /usr/src/api
# COPY server.key /usr/src/api

RUN npm install 

EXPOSE 3000
CMD npm run api
