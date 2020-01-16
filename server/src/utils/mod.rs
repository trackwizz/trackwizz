use actix_web::{http, HttpResponse};
use rand::Rng;

pub mod errors;

/// Return the desired environment variable value or a default value if not found.
pub fn get_env_variable(key: &str, default_value: &str) -> String {
    dotenv::dotenv().ok(); // get all environment variables
    match dotenv::var(key) {
        Ok(value) => value,
        Err(_) => default_value.to_string(),
    }
}

pub fn redirect_to(url: &str) -> HttpResponse {
    HttpResponse::Ok()
        .status(http::StatusCode::FOUND)
        .header("location", url)
        .body(format!("Found. Redirecting to {}", url))
}

pub fn to_query_string<T: serde::Serialize>(data: T) -> String {
    serde_urlencoded::to_string(data).unwrap_or(String::default())
}

pub fn get_random_string(i: usize) -> String {
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ\
                            abcdefghijklmnopqrstuvwxyz\
                            0123456789";
    let mut rng = rand::thread_rng();
    (0..i)
        .map(|_| {
            let idx = rng.gen_range(0, CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}
