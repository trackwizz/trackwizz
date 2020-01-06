pub mod errors;

/// Return the desired environment variable value or a default value if not found.
pub fn get_env_variable(key: &str, default_value: &str) -> String {
    dotenv::dotenv().ok(); // get all environment variables
    match dotenv::var(key) {
        Ok(value) => value,
        Err(_) => default_value.to_string()
    }
}
