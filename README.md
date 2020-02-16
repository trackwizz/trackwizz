# Trackwizz

Real-time, multiplayer blind test application.

[![Build Status](https://travis-ci.org/trackwizz/trackwizz.svg?branch=master)](https://travis-ci.org/trackwizz/trackwizz)
![coverage](./backend/badges/coverage.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Project description

Trackwizz is a real-time multiplayer blindtest application. You can play with your friends to know who is the best music geek. It is connecting to your favorite music provider, to your personal playlists and has different game modes, such as Battle Royale.

Play now at <https://trackwizz.herokuapp.com>

## Technical documentation

### Application global architecture

#### Frontend

For the frontend, the application has been built in React/Typescript. This choice has been made for different reasons:

* React is a very popular framework used by a lot of people. The documentation is easy to find and very complete.
* Typescript adds typing and allows to have a better structure. It makes it easier to develop better code with fewer knowledge of the codebase.
* Both allowed fast development and efficient performances.

![](/ReadmeImages/ReactTypescriptLogo.png =250px)

#### Backend

We started to build the application in Rust. But we met difficulties learning the language and we felt like it wasn't mature enough to efficiently build a web application.
We finally decided to move on and build the backend in NodeJS and Typescript.

* NodeJS is performant enough for our requirements.
* It allowed us to use the same language and network libraries across the application.
* We already had a template of NodeJS backend that we used at the early prototyping phase.

![](/ReadmeImages/NodeTypescriptLogo.png =250px)

#### Database

We planned to save the players, the scores and the games in a relational database. We chose PostgreSQL, which is an open-source relational database. It has proven performances, an active community, a good documentation. It is also supported by many libraries in different languages.

![](/ReadmeImages/PostgreSQLLogo.png =250px)

#### Deployment

We deploy our application with CI/CD. We decided to use Docker, TravisCI and Heroku. The advantages are:

* Consistent development environment for all contributors. Everyone that wants to participate in the project can be productive since day 1. There are no problems of compatibility between OS or other problems that can come out.
* Enable useful developement tools such has hot reloading (automatically reload the app on code changes)
* Pushing and merging code on the Github repository automatically triggers tests and deployment.
* Hosting the application on Heroku is free.

#### Architecture limits

During the creation of our application we needed to make certain choices to make sure we had a MVP for the presentation while also making sure we tested the critical points of the application.
That's why there are some points that need to be imporve if the application wants to be used as a final product.

* First there are a lot of tests that need to be implemented to make sure every method do what it is supposed to do.
* Second, since the application is an MVP, the architecture has not been though to be easely sustainable and scalable.
* Finally, our application only works if you have a Spotify's account. To achieve the goal of becoming the number one blind test, we need to implement a way of adding more music providers and people who do not have any music provider account so they can also play.

### Detailed architecture

#### Backend

The backend uses *express* to set up network communications and *typeORM* to write and read from the database.
There are two main communication streams: one for processing HTTP requests and the second for websockets. They have their own logic but both use the same *typeORM* entities to change data in the database.

![alt text](https://i.imgur.com/R0j8A8R.png "Backend architecture")

#### Database

The database is in PostgreSQL. It stores data about players, games, score and music provider songs.
Here is a schema of the tables and their relations:

![alt text](https://i.imgur.com/rXLFFts.png "Database")

#### Network communication

The application is using HTTP requests to login the user with the music provider OAuth, get the leaderboard and create or join a game.
The ingame messages are sent using websockets, as illustrated in the diagram below:

![alt text](https://i.imgur.com/9Q33OJ7.png "Network communication")

### Configuration

#### Pre-requirements

Make sure you have a .env file in the /backend directory:

/trackwizz/backend/.env should be:

```bash
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=trackwizz
DB_PASS=password
DB_LIBRARY=main
CLIENT_ID=<string>
CLIENT_SECRET=<string>
```

Client_id and client_secret are the application password to connect to spotify.

#### Running locally with docker

This project runs on docker ! :whale:

Requirements:

* `docker`

To start it just do in the root directory (/trackwizz):

```bash=
docker-compose up
```

* The frontend is available at: [localhost:3000](http://localhost:3000)
* The backend is available at: [localhost:5000](http://localhost:5000)

-> There is a swagger doc-api available at [localhost:5000/api-docs](http://localhost:5000/api-docs)

#### Running locally with yarn or npm

Requirements:

* `docker`
* `yarn`

First, run the database with docker (/trackwizz):

```bash=
docker run -d \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_USER=trackwizz \
    -e POSTGRES_DB=main \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v :.psql/data/pgdata:/var/lib/postgresql/data/pgdata \
    postgres:11.6-alpine
```

Then go to the backend server and run it with *yarn* or *npm* (/trackwizz/backend):

```bash=
yarn && yarn start
```

or

```bash=
npm install && npm run start
```

* The backend is available at: [localhost:5000](http://localhost:5000)

-> There is a swagger doc-api available at [localhost:5000/api-docs](http://localhost:5000/api-docs)

Finally go to the frontend server and run it with *yarn* or *npm* as well (/trackwizz/frontend):

```bash=
yarn && yarn start
```

or

```bash=
npm install && npm run start
```

* The frontend is available at: [localhost:3000](http://localhost:3000)

#### CI Tests

There is a CI pipeline that runs at each push to git with TravisCI. It runs the following commands:

(/trackwizz)

```bash=
docker-compose -f docker-compose.yml -f docker-compose.test.yml build backend
```

and then (/trackwizz):

```bash=
docker-compose -f docker-compose.yml -f docker-compose.test.yml run backend
```

To modify the CI tests, override the default `docker-compose.yml` behavior by writting new configuration in `docker-compose.test.yml`.

##### Environment variables

Environment variables are stored encrypted by Travis for the CI and Heroku for prod.

To update Travis variables:

```travis encrypt MY_SECRET_ENV=super_secret --add env.global```

To update Heroku variables:
Go on Heroku website and update the env variables in the config.
