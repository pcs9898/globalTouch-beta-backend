FROM node:16

COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
WORKDIR /myfolder/
RUN yarn install

COPY . /myfolder/

RUN npm rebuild bcrypt --build-from-source
RUN yarn build


CMD yarn start:prod:docker