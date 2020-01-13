use actix_web::HttpResponse;
use serde::Serialize;
use serde_repr::Serialize_repr;

#[derive(Serialize_repr)]
#[repr(u8)]
pub enum ErrorCode {
    NoDb = 0,
    NoSqlFile = 1,
    PrepareError = 2,
    QueryError = 3,
    EmptyRows = 4,
}

#[derive(Serialize)]
pub struct AppError {
    pub error_code: ErrorCode,
    pub msg: String,
}

impl AppError {
    pub fn new(error_code: ErrorCode, msg: &str) -> AppError {
        AppError {
            error_code,
            msg: msg.to_string(),
        }
    }

    pub fn send(&mut self) -> HttpResponse {
        HttpResponse::InternalServerError().json(self)
    }
}
