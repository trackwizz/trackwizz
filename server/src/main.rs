extern crate postgres;
extern crate dotenv;
extern crate actix_web;

static mut DB: Option<Connection> = None;

mod database;
mod utils;
mod models;
mod controllers;
mod server;
mod tests;

use database::{connect_to_database, migrate};
use postgres::Connection;
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    let port = &args[1];

    let conn:Connection = match connect_to_database() {
        Ok(conn) => conn,
        Err(error) => panic!("Could not connect to database: \n\t{}", error)
    };
    unsafe {
        DB = Some(conn);
    }

    migrate(); // create all the tables.
    println!("Server listening on port {}!", port);
    server::start(port);
}
