extern crate postgres;
extern crate dotenv;
extern crate actix_web;

mod database;
mod utils;
mod models;
mod controllers;
mod server;
mod tests;

use database::connect_to_database;
use postgres::Connection;
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    let port = &args[1];

    let conn:Connection = match connect_to_database() {
        Ok(conn) => conn,
        Err(error) => panic!("Could not connect to database: \n\t{}", error)
    };
    println!("Successfully Connected to db: {}", conn.is_active());

    server::start(port);
}
