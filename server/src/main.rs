extern crate postgres;
extern crate dotenv;
extern crate actix_web;

static mut DB: Option<Connection> = None;
static REDIRECT_URI: &str = "http://localhost:5000/callback";
static FRONT_REDIRECT_URI: &str = "http://localhost:3000/login?";

mod utils;
mod database;
mod models;
mod controllers;
mod server;
mod tests;
mod spotify;

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
