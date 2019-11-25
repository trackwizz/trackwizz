FROM rust:1.39-slim

WORKDIR /usr/src/trackwizz
COPY src ./src
COPY Cargo.toml .

RUN cargo install cargo-watch

EXPOSE 5000

CMD ["cargo", "watch", "-x run"]