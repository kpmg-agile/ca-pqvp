FROM node:6.3.1

LABEL webstart.version="3"

WORKDIR /home

RUN mkdir -p dist
RUN mkdir -p config
RUN mkdir -p server
RUN mkdir -p raml
RUN mkdir -p node_modules

COPY package.json .
COPY dist dist/
COPY config config/
COPY server server/
COPY raml raml/
COPY node_modules node_modules/

VOLUME /home

EXPOSE 8080

CMD ["node", "server"]
