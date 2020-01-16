# trackwizz
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