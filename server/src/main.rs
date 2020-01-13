extern crate actix_web;
extern crate dotenv;
extern crate postgres;

static mut DB: Option<Connection> = None;

mod controllers;
mod database;
mod models;
mod server;
mod tests;
mod utils;

use database::{connect_to_database, migrate};
use postgres::Connection;

fn main() {
    let conn: Connection = match connect_to_database() {
        Ok(conn) => conn,
        Err(error) => panic!("Could not connect to database: \n\t{}", error),
    };
    unsafe {
        DB = Some(conn);
    }
    migrate(); // create all the tables.
    server::start();
}
