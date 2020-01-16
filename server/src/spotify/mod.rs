use actix_web::{web};
pub mod login;
mod playlists;
mod tracks;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/spotify")
            .route("/playlists", web::get().to(playlists::get_spotify_playlists))
            .route("/tracks", web::get().to(tracks::get_playlist_tracks))
    );
}
