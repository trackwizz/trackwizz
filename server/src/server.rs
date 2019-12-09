use crate::controllers::login_controller;
use actix_cors::Cors;
use actix_web::{http, App, HttpServer};

pub fn start() {
    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::new() // <- Construct CORS middleware builder
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .max_age(3600),
            )
            .configure(login_controller::routes)
    })
    .bind("0.0.0.0:5000")
    .unwrap()
    .run()
    .unwrap();
}
