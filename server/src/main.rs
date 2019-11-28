extern crate postgres;
extern crate dotenv;
mod database;
mod utils;

use database::connect_to_database;
use postgres::{Connection};

fn main() {
    let conn:Connection = match connect_to_database() {
        Ok(conn) => conn,
        Err(error) => panic!("Could not connect to database: \n\t{}", error)
    };
    println!("Successfully Connected to db: {}", conn.is_active());
}
