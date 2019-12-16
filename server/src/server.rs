use actix_web::{App, HttpServer};
use crate::controllers::{test_controller};
use crate::utils::get_env_variable;

pub fn start() {
    let port: String = get_env_variable("PORT", "8080");
    HttpServer::new(|| {
        App::new()
            .configure(test_controller::routes)
    })
        .bind(format!("0.0.0.0:{}", &port))
        .unwrap()
        .run()
        .unwrap();
}
