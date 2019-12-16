FROM rust:1.39-slim

WORKDIR /usr/src/trackwizz

RUN cargo install cargo-watch

COPY src ./src
COPY Cargo.toml .

RUN sudo apt install pkg-config

EXPOSE 5000

CMD ["cargo", "watch", "-x run"]
