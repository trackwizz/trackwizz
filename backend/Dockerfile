# DEV Dockerfile
FROM node:12.13-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install

# Bundle app source
COPY tsconfig.json .
COPY .eslintignore .
COPY .eslintrc.js .
COPY nodemon.json .

COPY src src

EXPOSE 5000
CMD [ "yarn", "start" ]
