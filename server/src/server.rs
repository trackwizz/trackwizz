use actix_web::{App, HttpServer};
use crate::controllers::{test_controller};

pub fn start() {
    HttpServer::new(|| {
        App::new()
            .configure(test_controller::routes)
    })
        .bind("0.0.0.0:5000")
        .unwrap()
        .run()
        .unwrap();
}
