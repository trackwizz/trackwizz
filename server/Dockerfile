FROM rust:1.39-slim

RUN apt-get update
RUN apt-get install -y libssl-dev pkg-config

# create a new empty shell project
RUN USER=root cargo new --bin server
WORKDIR /server

RUN cargo install cargo-watch

# copy over manifests
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./src ./src

# this build step will cache dependencies
RUN cargo build
# RUN rm src/*.rs

COPY ./queries ./queries

EXPOSE 5000

CMD cargo watch -x run
