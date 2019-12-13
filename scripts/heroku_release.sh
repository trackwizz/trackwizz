#!/bin/bash

# install heroku CLI
wget -qO- https://toolbelt.heroku.com/install.sh | sh

# login to heroku
touch ~/.netrc
echo "machine api.heroku.com
  login ${HEROKU_USERNAME}
  password ${HEROKU_AUTH_TOKEN}
machine git.heroku.com
  login ${HEROKU_USERNAME}
  password ${HEROKU_AUTH_TOKEN}
" >> ~/.netrc

# release application
heroku container:release web -a $1
