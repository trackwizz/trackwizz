#!/bin/bash

if [ "$1" = "staging" ]; then
    DOCKER_REPO_FRONT=${STAGING_DOCKER_REPO_FRONT}
    DOCKER_REPO_BACK=${STAGING_DOCKER_REPO_BACK}
    BUILD_BACKEND=${STAGING_BUILD_BACKEND}
    BUILD_BACKEND_FULL=${STAGING_BUILD_BACKEND_FULL}
    BUILD_BACKEND_WS_FULL=${STAGING_BUILD_BACKEND_WS_FULL}
    BUILD_FRONTEND=${STAGING_BUILD_FRONTEND}
    BUILD_FRONTEND_FULL=${STAGING_BUILD_FRONTEND_FULL}
elif [ "$1" = "prod" ]; then
    DOCKER_REPO_FRONT=${PROD_DOCKER_REPO_FRONT}
    DOCKER_REPO_BACK=${PROD_DOCKER_REPO_BACK}
    BUILD_BACKEND=${PROD_BUILD_BACKEND}
    BUILD_BACKEND_FULL=${PROD_BUILD_BACKEND_FULL}
    BUILD_BACKEND_WS_FULL=${PROD_BUILD_BACKEND_WS_FULL}
    BUILD_FRONTEND=${PROD_BUILD_FRONTEND}
    BUILD_FRONTEND_FULL=${PROD_BUILD_FRONTEND_FULL}
else
    echo -e "Should specify 'staging' or 'prod'"
    exit 1
fi

# BUILD

IMAGE_FRONT="${REGISTRY_URL}/${DOCKER_REPO_FRONT}"
IMAGE_BACK="${REGISTRY_URL}/${DOCKER_REPO_BACK}"

cd "$(dirname "$0")"
cd ../frontend
docker build -f Dockerfile.prod -t ${IMAGE_FRONT} --build-arg REACT_APP_API_NAME=${BUILD_BACKEND_FULL} --build-arg REACT_APP_WS_NAME=${BUILD_BACKEND_WS_FULL} --build-arg BACKEND_NAME=${BUILD_BACKEND} --build-arg FRONTEND_NAME=${BUILD_FRONTEND} .
cd ../backend
docker build -f Dockerfile.prod -t ${IMAGE_BACK} --build-arg BACKEND_NAME_FULL=${BUILD_BACKEND_FULL} --build-arg FRONTEND_NAME_FULL=${BUILD_FRONTEND_FULL} .
cd ..

# PUSH

set -e

# init key for pass to avoid storing unencrypted password
export GPG_TTY=$(tty)
gpg2 --batch --gen-key <<-EOF
%no-protection
%echo Generating a standard key
Key-Type: 1
Key-Length: 2048
Subkey-Type: 1
Subkey-Length: 2048
Name-Real: trackwizz [travis-ci]
Name-Email: trackwizz@travis-ci
Expire-Date: 0
# Do a commit here, so that we can later print "done" :-)
%commit
%echo done
EOF

key=$(gpg2 --no-auto-check-trustdb --list-secret-keys | grep ^sec | cut -d/ -f2 | cut -d" " -f1)
pass init $key

# set helper to store docker credentials with pass
curl -fsSL https://github.com/docker/docker-credential-helpers/releases/download/v0.6.3/docker-credential-pass-v0.6.3-amd64.tar.gz | tar -xz
export PATH=$PATH:$(pwd)
chmod +x docker-credential-pass
mkdir ~/.docker
touch ~/.docker/config.json
echo '{"auths": {}, "credsStore": "pass"}' >> ~/.docker/config.json

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin ${REGISTRY_URL}
sed -ie "s/$REGISTRY_URL/https:\/\/$REGISTRY_URL/g" ~/.docker/config.json

docker push ${IMAGE_FRONT}
docker push ${IMAGE_BACK}

docker logout ${REGISTRY_URL}
