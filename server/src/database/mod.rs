use postgres::{Connection, TlsMode, Error};
use std::borrow::Borrow;
use std::{thread, time};
use super::utils::get_env_variable;

/// Try n-times to get a new connection to a Postgres database.
fn try_connection(params: &String, tries: u8) -> Result<Connection, Error> {
    match Connection::connect((*params).borrow(), TlsMode::None) {
        Ok(conn) => Ok(conn),
        Err(error) => {
            match tries {
                0 => Err(error),
                _ => {
                    println!("Could not connect to database... Retry in 10s!");
                    thread::sleep(time::Duration::from_secs(10));
                    try_connection(params, tries - 1)
                }
            }
        }
    }
}

/// Creates a new connection to a Postgres database.
pub fn connect_to_database() -> Result<Connection, Error> {
    let db_host: String = get_env_variable("DB_HOST", "localhost");
    let db_user: String = get_env_variable("DB_USER", "trackwizz");
    let db_password: String = get_env_variable("DB_PASS", "password");
    let db_port: String = get_env_variable("DB_PORT", "5432");
    let db_library: String = get_env_variable("DB_LIBRARY", "main");

    // Will try to connect 10 times before aborting.
    let params: String = format!("postgresql://{}:{}@{}:{}/{}", db_user, db_password, db_host, db_port, db_library);
    try_connection(&params, 10)
}
