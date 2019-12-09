use actix_web::{guard, http, web, HttpRequest, HttpResponse};

use crate::models::test_model::TestObj;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/test")
            .route("", web::get().to(get_all))
            .route(
                "",
                web::post()
                    .guard(guard::Header("content-type", "application/json"))
                    .to(create),
            )
            .route(
                "/{id}",
                web::put()
                    .guard(guard::Header("content-type", "application/json"))
                    .to(edit),
            )
            .route("/{id}", web::get().to(get_one))
            .route("/{id}", web::delete().to(delete)),
    );
}

fn get_all(_req: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().json(vec![TestObj {
        id: 0,
        name: "Get all".parse().unwrap(),
    }])
}

fn get_one(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<u32>() {
        Ok(id) => HttpResponse::Ok().json(TestObj {
            id,
            name: "Get one".parse().unwrap(),
        }),
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}

fn create(_req: HttpRequest, new_test_obj: web::Json<TestObj>) -> HttpResponse {
    HttpResponse::Ok().json(TestObj {
        id: 1,
        name: new_test_obj.name.to_string(),
    })
}

fn edit(req: HttpRequest, updated_test_obj: web::Json<TestObj>) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<u32>() {
        Ok(id) => HttpResponse::Ok().json(TestObj {
            id,
            name: updated_test_obj.name.to_string(),
        }),
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<u32>() {
        Ok(_) => HttpResponse::new(http::StatusCode::NO_CONTENT),
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}
