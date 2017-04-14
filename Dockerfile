FROM nodejs:7.9

ADD: . /opt/web-server
WORKDIR: /opt/web-server
RUN npm install
