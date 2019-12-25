use actix_web::{web, http, HttpResponse, HttpRequest, guard};

use crate::models::genre_model::{Genre, get_all_genres, get_one_genre_by_id};

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/genres")
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
    HttpResponse::Ok().json(get_all_genres())
}

fn get_one(req: HttpRequest) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match get_one_genre_by_id(id) {
            Some(genre) =>   HttpResponse::Ok().json(genre),
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn create(_req: HttpRequest, new_genre: web::Json<Genre>) -> HttpResponse  {
    let mut genre = Genre{
        id: 0,
        name: new_genre.name.to_string(),
    };
    genre.create();
    HttpResponse::Ok().json(genre)
}

fn edit(req: HttpRequest, updated_genre: web::Json<Genre>) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            let mut genre = Genre{
                id,
                name: updated_genre.name.to_string(),
            };
            genre.update();
            HttpResponse::Ok().json(genre)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            let mut genre = Genre{
                id,
                name: "".to_string(),
            };
            genre.delete();
            HttpResponse::new(http::StatusCode::NO_CONTENT)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}
