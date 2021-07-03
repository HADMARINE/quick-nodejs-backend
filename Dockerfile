FROM ubuntu:20.04

ENV port=61000
ENV TIMEZONE=GMT
# ENV DEBIAN_FRONTEND=noninteractive 

LABEL maintainer="contact@hadmarine.com"

WORKDIR /usr/src/app

RUN ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && echo ${TIMEZONE} > /etc/timezone

RUN apt -y update
RUN apt -y install build-essential curl gnupg 
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt -y install nodejs
RUN npm i -g yarn
RUN yarn global add pm2
RUN yarn set version berry

COPY package.json .
COPY .yarnrc.yml .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn install
RUN yarn quickcert.js decrypt

EXPOSE ${port}

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://localhost:${port}/status || exit 1

CMD yarn dev
