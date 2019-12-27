use serde::{Deserialize, Serialize};
use actix_web::{web, http, HttpResponse, HttpRequest, guard};
use crate::models::playlist_model::Playlist;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/tracks")
        .route("", web::get().to(get_all))
        .route("", web::post()
            .guard(guard::Header("content-type", "application/json"))
            .to(create))
        .route("/{id_track}", web::put()
            .guard(guard::Header("content-type", "application/json"))
            .to(edit))
        .route("/{id_track}", web::get().to(get_one))
        .route("/{id_track}", web::delete().to(delete))
    );
}

fn get_id(key: &str, req: &HttpRequest) -> i32 {
    match req.match_info().get(key).unwrap().parse::<i32>() {
        Ok(id) => id,
        Err(_) => 0
    }
}

fn get_all(req: HttpRequest) -> HttpResponse {
    let id_playlist: i32 = get_id("id", &req);
    match Playlist::get_one_by_id(id_playlist) {
        Some(mut playlist) => HttpResponse::Ok().json(playlist.get_tracks()),
        _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn get_one(req: HttpRequest) -> HttpResponse  {
    let id_playlist: i32 = get_id("id", &req);
    let id_track: i32 = get_id("id_track", &req);
    match Playlist::get_one_by_id(id_playlist) {
        Some(mut playlist) => {
            match playlist.get_track(id_track) {
                Some(track) => HttpResponse::Ok().json(track),
                _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
            }
        },
        _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

#[derive(Serialize, Deserialize)]
struct RelPlaylistTracks {
    #[serde(default)]
    #[serde(skip_serializing)]
    id_track: i32,
    #[serde(default)]
    track_index: i32,
}

fn create(req: HttpRequest, new_rel: web::Json<RelPlaylistTracks>) -> HttpResponse  {
    let id_playlist: i32 = get_id("id", &req);
    match Playlist::get_one_by_id(id_playlist) {
        Some(mut playlist) => {
            match playlist.add_track(new_rel.id_track) {
                Ok(track_index) => HttpResponse::Ok().json(RelPlaylistTracks{
                    id_track: new_rel.id_track,
                    track_index,
                }),
                Err(mut e) => e.send()
            }
        },
        _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn edit(req: HttpRequest, update_rel: web::Json<RelPlaylistTracks>) -> HttpResponse  {
    let id_playlist: i32 = get_id("id", &req);
    let id_track: i32 = get_id("id_track", &req);
    match Playlist::get_one_by_id(id_playlist) {
        Some(mut playlist) => {
            match playlist.update_track_index(id_track, update_rel.track_index) {
                Err(mut e) => e.send(),
                _ => HttpResponse::Ok().json(RelPlaylistTracks{
                    id_track,
                    track_index: update_rel.track_index,
                }),
            }
        },
        _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    let id_playlist: i32 = get_id("id", &req);
    let id_track: i32 = get_id("id_track", &req);
    match Playlist::get_one_by_id(id_playlist) {
        Some(mut playlist) => {
            match playlist.delete_track(id_track) {
                Err(mut e) => e.send(),
                _ => HttpResponse::new(http::StatusCode::NO_CONTENT),
            }
        },
        _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}
