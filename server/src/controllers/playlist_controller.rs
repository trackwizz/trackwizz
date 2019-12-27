use actix_web::{web, http, HttpResponse, HttpRequest, guard};
use super::playlist_tracks_controller;
use crate::models::playlist_model::Playlist;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/playlists")
        .service(web::scope("/{id}")
            .configure(playlist_tracks_controller::routes)
            .route("", web::put()
                .guard(guard::Header("content-type", "application/json"))
                .to(edit))
            .route("", web::get().to(get_one))
            .route("", web::delete().to(delete)))
        .route("", web::get().to(get_all))
        .route("", web::post()
            .guard(guard::Header("content-type", "application/json"))
            .to(create))
    );
}

fn get_all(_req: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().json(Playlist::get_all())
}

fn get_one(req: HttpRequest) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match Playlist::get_one_by_id(id) {
            Some(mut playlist) => {
                playlist.get_tracks();
                HttpResponse::Ok().json(playlist)
            },
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn create(_req: HttpRequest, new_playlist: web::Json<Playlist>) -> HttpResponse  {
    let mut playlist = Playlist::new(0, new_playlist.title.to_string());
    playlist.create();
    HttpResponse::Ok().json(playlist)
}

fn edit(req: HttpRequest, updated_playlist: web::Json<Playlist>) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            let mut playlist = Playlist::new(id, updated_playlist.title.to_string());
            match playlist.update() {
                Err(mut e) => e.send(),
                _ => HttpResponse::Ok().json(playlist),
            }
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            match Playlist::delete(id) {
                Err(mut e) => e.send(),
                _ => HttpResponse::new(http::StatusCode::NO_CONTENT),
            }
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}
