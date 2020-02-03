#!/bin/bash

# BUILD

IMAGE_FRONT="${REGISTRY_URL}/${DOCKER_REPO_FRONT}"
IMAGE_BACK="${REGISTRY_URL}/${DOCKER_REPO_BACK}"

cd "$(dirname "$0")"
cd ../frontend
docker build -f Dockerfile.prod -t ${IMAGE_FRONT} --build-arg BACKEND_NAME=${BUILD_BACKEND} .
cd ../backend
docker build -f Dockerfile.prod -t ${IMAGE_BACK} .
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
