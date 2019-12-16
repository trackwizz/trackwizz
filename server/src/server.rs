use actix_web::{App, HttpServer};
use crate::controllers::{test_controller};

pub fn start(port: &str) {
    HttpServer::new(|| {
        App::new()
            .configure(test_controller::routes)
    })
        .bind(format!("0.0.0.0:{}", port))
        .unwrap()
        .run()
        .unwrap();
}
