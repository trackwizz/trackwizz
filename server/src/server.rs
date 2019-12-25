use actix_web::{App, HttpServer};
use actix_web::middleware::Logger;
use env_logger;
use crate::controllers::{user_controller};
use crate::utils::get_env_variable;

pub fn start() {
    let port: String = get_env_variable("PORT", "8080");
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
    println!("Server listening on port {}!", port);
  
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%a \"%r\" %s %b \"%{Referer}i\" \"%{User-Agent}i\" %Dms"))
            .configure(user_controller::routes)
    })
        .bind(format!("0.0.0.0:{}", &port))
        .unwrap()
        .run()
        .unwrap();
}
