# Build docker image and run app build within image

FROM node:6.3.1

LABEL webstart.version="3"

WORKDIR /home

RUN mkdir config server raml client web_loaders

COPY .babelrc .
COPY .eslintignore .
COPY .eslintrc .
COPY .nvmrc .
COPY package.json .

COPY config config/
COPY server server/
COPY client client/
COPY raml raml/
COPY web_loaders web_loaders/

RUN sed -i 's/localhost/pqvp-stack_db/g' ./config/.dbconfig

RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["node", "server/index.js"]
