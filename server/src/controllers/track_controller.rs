use actix_web::{web, http, HttpResponse, HttpRequest, guard};
use crate::models::track_model::Track;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/tracks")
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
    HttpResponse::Ok().json(Track::get_all())
}

fn get_one(req: HttpRequest) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match Track::get_one_by_id(id) {
            Some(track) =>   HttpResponse::Ok().json(track),
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn create(_req: HttpRequest, new_track: web::Json<Track>) -> HttpResponse  {
    let mut track = Track{
        id: 0,
        spotify_id: new_track.spotify_id.to_string(),
        title: new_track.title.to_string(),
        length: new_track.length,
        id_genre: new_track.id_genre,
        genre: None,
        track_index: None,
    };
    match track.create() {
        Err(mut e) => e.send(),
        _ => HttpResponse::Ok().json(track),
    }
}

fn edit(req: HttpRequest, updated_track: web::Json<Track>) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match  Track::get_one_by_id(id) {
            Some(mut track) => {
                if updated_track.spotify_id.len() > 0 {
                    track.spotify_id = updated_track.spotify_id.to_string();
                }
                if updated_track.title.len() > 0 {
                    track.title = updated_track.title.to_string();
                }
                if updated_track.length != 0 {
                    track.length = updated_track.length;
                }
                if updated_track.id_genre != 0 {
                    track.id_genre = updated_track.id_genre;
                    track.genre = None;
                }
                match track.update() {
                    Err(mut e) => e.send(),
                    _ => HttpResponse::Ok().json(track),
                }
            },
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            match Track::delete(id) {
                Err(mut e) => e.send(),
                _ => HttpResponse::new(http::StatusCode::NO_CONTENT),
            }
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}
