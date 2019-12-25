use actix_web::{App, HttpServer};
use actix_web::middleware::Logger;
use env_logger;

use crate::controllers::{user_controller};

pub fn start(port: &str) {
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%a \"%r\" %s %b \"%{Referer}i\" \"%{User-Agent}i\" %Dms"))
            .configure(user_controller::routes)
    })
        .bind(format!("0.0.0.0:{}", port))
        .unwrap()
        .run()
        .unwrap();
}
