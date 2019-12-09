# trackwizz
Blind test application

## CI Tests

The CI pipeline is running the following command to execute tests:
`docker-compose -f docker-compose.yml -f docker-compose.test.yml up`

To modify the CI tests, override the default `docker-compose.yml` behavior by writting new configuration in `docker-compose.test.yml`.