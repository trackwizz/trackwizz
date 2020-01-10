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

#[actix_rt::main]
async fn main() {
    let conn:Connection = match connect_to_database() {
        Ok(conn) => conn,
        Err(error) => panic!("Could not connect to database: \n\t{}", error)
    };
    unsafe {
        DB = Some(conn);
    }
    migrate(); // create all the tables.
    server::start().await.unwrap();
}
