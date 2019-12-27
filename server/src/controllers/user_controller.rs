use actix_web::{web, http, HttpResponse, HttpRequest, guard};

use crate::models::user_model::User;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/users")
        .route("", web::get().to(get_all))
        .route("", web::post()
            .guard(guard::Header("content-type", "application/json"))
            .to(create))
        .route("/{id}", web::put()
            .guard(guard::Header("content-type", "application/json"))
            .to(edit))
        .route("/{id}", web::get().to(get_one))
        .route("/{id}", web::delete().to(delete))
    );
}

fn get_all(_req: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().json(User::get_all())
}

fn get_one(req: HttpRequest) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match User::get_one_by_id(id) {
            Some(user) =>   HttpResponse::Ok().json(user),
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn create(_req: HttpRequest, new_user: web::Json<User>) -> HttpResponse  {
    let mut user = User{
        id: 0,
        name: new_user.name.to_string(),
    };
    user.create();
    HttpResponse::Ok().json(user)
}

fn edit(req: HttpRequest, updated_user: web::Json<User>) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            let mut user = User{
                id,
                name: updated_user.name.to_string(),
            };
            match user.update() {
                Err(mut e) => e.send(),
                _ => HttpResponse::Ok().json(user),
            }
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            let mut user = User{
                id,
                name: "".to_string(),
            };
            match user.delete() {
                Err(mut e) => e.send(),
                _ => HttpResponse::new(http::StatusCode::NO_CONTENT),
            }
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}
