use actix_web::{App, HttpServer};
use crate::controllers::{user_controller};

pub fn start(port: &str) {
    HttpServer::new(|| {
        App::new()
            .configure(user_controller::routes)
    })
        .bind(format!("0.0.0.0:{}", port))
        .unwrap()
        .run()
        .unwrap();
}
