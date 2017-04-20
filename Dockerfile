FROM node:boron

COPY . /opt/web-server
WORKDIR /opt/web-server
RUN npm install
