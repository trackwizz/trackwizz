# trackwizz

[![Build Status](https://travis-ci.org/trackwizz/trackwizz.svg?branch=master)](https://travis-ci.org/trackwizz/trackwizz)
![coverage](./backend/badges/coverage.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Blind test application

## CI Tests

The CI pipeline is running the following command to execute tests:
`docker-compose -f docker-compose.yml -f docker-compose.test.yml run backend`

To modify the CI tests, override the default `docker-compose.yml` behavior by writting new configuration in `docker-compose.test.yml`.

### Environment variables

Environment variables are stored encrypted by Travis for the CI and Heroku for prod.

To update Travis variables:

```travis encrypt MY_SECRET_ENV=super_secret --add env.global```

To update Heroku variables:
Go on Heroku website and update the env variables in the config.

---

## Tech documentation

### Section 1: Project description

#### Problem adressed

There are a lot of blindtests out there but none of them are directly connected to your favorite music provider and to your personal playlists. Therefore, it is difficult for users to play, to interact with their friends to know who is the best music geek.

Our goal is to fill this gap by providing an application that directly use the user's musics from their provider and allows him to play with their friends in different game mods.

#### User profiles

This application is open for everyone who wants to pass a good time alone or with some friends.

### Section 2: Application global architecture

#### Frontend

For the frontend, the application has been built in React/Typescript. This choice has been made for different reasons:

* React is a very popular framework used by a lot of people and the documentation is easy to find and very complete.This addition of Typescript allows it to have a better structure and at the end, it makes it easier to developp better code with fewer knowledge.
* Most of the people of the group already knew the framework and for the little time we had allowed for the project, it was easier and faster for us to developp a good application without having many troubles.

![alt text](/ReadmeImages/ReactTypescriptLogo.png "Logo React/Typescript")

#### Backend

We started the application in Rust but after some major problems and a lot of dificulties building some features that were very easy on other frameworks, we decided to abandon that idea and to pass to Node/Typescript. We decided to go to Node/Typescript for the reasons below:

* Since our frontend is in javascript/typescript, it allowed us to stay with the same language going from one part to the application to the other.
* The points made on React/Typescript also applied here in Node/Typescript.

![alt text](/ReadmeImages/NodeTypescriptLogo.png "Logo Node/Typescript")

#### Database

Finally, our database is in postgres. This choice was easy for us because of our knowledge on SQL databases and the fact that since the beggining we planned to save the people that were playing and the score associated with their games.

![alt text](/ReadmeImages/PostgreSQLLogo.png "Logo PostgreSQL")

#### Deployment

To deploy our application we decided to use Docker. The advantages of using Docker are:

* If the application runs on someone's machine, it runs anywhere and that allows us as a team to be in the same page.
* Everyone that wants to participate in the project can be productive since day 1. There are no problems of compatibility between OS or other problems that can come out.

#### Architecture limits

### Section 3: Detailed architecture of each entity

#### Use

#### Configuration

#### Model

#### Interactions
