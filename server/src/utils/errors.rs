use actix_web::{HttpResponse};
use serde::Serialize;

#[derive(Serialize)]
pub struct AppError {
    pub error_code: i32,
    pub msg: String,
}

impl AppError {
    pub fn new(error_code: i32, msg: &str) -> AppError {
        AppError{
            error_code,
            msg: msg.to_string(),
        }
    }

    pub fn send(&mut self) -> HttpResponse  {
        HttpResponse::InternalServerError().json(self)
    }
}
