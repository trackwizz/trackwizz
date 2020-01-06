use crate::controllers::login_controller;
use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{http, App, HttpServer};
use env_logger;

use crate::controllers::genre_controller;
use crate::controllers::playlist_controller;
use crate::controllers::track_controller;
use crate::controllers::user_controller;
use crate::utils::get_env_variable;

pub fn start() {
    let port: String = get_env_variable("PORT", "8080");
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
    println!("Server listening on port {}!", port);

    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::new() // <- Construct CORS middleware builder
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .max_age(3600),
                Logger::new("%a \"%r\" %s %b \"%{Referer}i\" \"%{User-Agent}i\" %Dms"),
            )
            .configure(login_controller::routes)
            .configure(user_controller::routes)
            .configure(genre_controller::routes)
            .configure(playlist_controller::routes)
            .configure(track_controller::routes)
    })
    .bind(format!("0.0.0.0:{}", &port))
    .unwrap()
    .run()
    .unwrap();
}
