use actix_web::{web, http, HttpResponse, HttpRequest, guard};
use crate::models::playlist_model::{Playlist, get_all_playlists, get_one_playlist_by_id};

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/playlists")
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
    HttpResponse::Ok().json(get_all_playlists())
}

fn get_one(req: HttpRequest) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match get_one_playlist_by_id(id) {
            Some(playlist) =>   HttpResponse::Ok().json(playlist),
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn create(_req: HttpRequest, new_playlist: web::Json<Playlist>) -> HttpResponse  {
    let mut playlist = Playlist{
        id: 0,
        title: new_playlist.title.to_string(),
    };
    playlist.create();
    HttpResponse::Ok().json(playlist)
}

fn edit(req: HttpRequest, updated_playlist: web::Json<Playlist>) -> HttpResponse  {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            let mut playlist = Playlist{
                id,
                title: updated_playlist.title.to_string(),
            };
            playlist.update();
            HttpResponse::Ok().json(playlist)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => {
            let mut playlist = Playlist{
                id,
                title: "".to_string(),
            };
            playlist.delete();
            HttpResponse::new(http::StatusCode::NO_CONTENT)
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND)
    }
}
