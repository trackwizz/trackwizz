FROM rust:1.39-slim

WORKDIR /usr/src/trackwizz

RUN cargo install cargo-watch

COPY queries ./queries
COPY src ./src
COPY Cargo.toml .

RUN apt-get update
RUN apt-get install -y libssl-dev pkg-config

EXPOSE 5000

CMD cargo watch -x run
