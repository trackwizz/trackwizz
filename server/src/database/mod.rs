use postgres::{Connection, TlsMode, Error, types, rows};
use std::borrow::Borrow;
use std::fs;
use std::{thread, time};
use crate::DB;
use crate::utils::get_env_variable;

/// Try n-times to get a new connection to a Postgres database.
fn try_connection(params: &String, tries: u8) -> Result<Connection, Error> {
    match Connection::connect(params.borrow(), TlsMode::None) {
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

/// Read a sql file in that should be in the "/queries" folder
fn read_sql_file(filename: String) -> String {
    match fs::read_to_string(filename) {
        Ok(content) => content,
        Err(error) => {
            println!("SQL file not found: \n\t{}", error);
            "".to_string()
        }
    }
}

/// Returns the global DB variable
fn get_db_conn() -> &'static Option<Connection> {
    let db: &Option<Connection>;
    unsafe {
        db = &DB;
    }
    db
}

/// Executes a SQL statement located in a file.
pub fn execute(filename: &str, params: &[&dyn types::ToSql]) {
    let sql:String = read_sql_file(filename.to_string());
    if sql.len() == 0 { // dont execute empty sql
        return;
    }

    match get_db_conn() {
        Some(conn) => {
            match conn.execute(sql.as_str(), params) {
                Err(e) => println!("SQL Error {}\n\r", e),
                _ => {},
            }
        },
        None => {
            println!("Db is None!");
        },
    }
}

/// Executes a SQL query located in a file, returning the resulting rows.
pub fn query(filename: &str, params: &[&dyn types::ToSql]) -> Option<rows::Rows> {
    let sql:String = read_sql_file(filename.to_string());
    if sql.len() == 0 { // dont execute empty sql
        return None;
    }

    match get_db_conn() {
        Some(conn) => {
            match conn.query(sql.as_str(), params) {
                Ok(rows) => Some(rows),
                Err(e) => {
                    println!("SQL Error {}\n\r", e);
                    None
                },
            }
        },
        None => {
            println!("Db is None!");
            None
        },
    }
}

/// Insert a new row and returns the inserted id.
pub fn insert(filename: &str, params: &[&dyn types::ToSql]) -> Option<i32> {
    let sql:String = read_sql_file(filename.to_string());
    if sql.len() == 0 { // dont execute empty sql
        return None;
    }

    match get_db_conn() {
        Some(conn) => {
            match conn.prepare(sql.as_str()) {
                Ok(statement) => {
                    match statement.query(params) {
                        Ok(rows) => {
                            if !rows.is_empty() {
                                return rows.get(0).get(0)
                            }
                            None
                        }
                        _ => None
                    }
                },
                _ => None
            }
        },
        None => {
            println!("Db is None!");
            None
        },
    }
}

/// Executes the migrations
pub fn migrate() {
    execute("queries/create/create_users.sql", &[]);
    execute("queries/create/create_playlists.sql", &[]);
    execute("queries/create/create_genres.sql", &[]);
    execute("queries/create/create_tracks.sql", &[]);
}
