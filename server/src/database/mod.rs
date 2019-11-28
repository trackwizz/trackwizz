extern crate dotenv;
extern crate postgres;

pub mod database {
    use postgres::{Connection, TlsMode, Error};

    fn get_env_variable(key: &str, default_value: &str) -> String {
        match dotenv::var(key) {
            Ok(value) => value,
            Err(_) => default_value.to_string()
        }
    }

    pub fn connect_to_database() -> Result<(), Error> {
        dotenv::dotenv().ok(); // get all environment variables
        let db_host = get_env_variable("DB_HOST", "localhost");
        let db_user = get_env_variable("DB_USER", "trackwizz");
        let db_password = get_env_variable("DB_PASS", "password");
        let db_port = get_env_variable("DB_PORT", "5432");
        let db_library = get_env_variable("DB_LIBRARY", "main");

        println!("postgresql://{}:{}@{}:{}/{}", db_user, db_password, db_host, db_port, db_library);
        let _conn: Connection = Connection::connect(format!("postgresql://{}:{}@{}:{}/{}", db_user, db_password, db_host, db_port, db_library), TlsMode::None)?;

        Ok(())
    }
}
