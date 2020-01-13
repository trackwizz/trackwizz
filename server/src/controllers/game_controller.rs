use crate::models::game_model::Game;
use actix_web::{guard, http, web, HttpRequest, HttpResponse};

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/games")
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

fn create(_req: HttpRequest, new_game: web::Json<Game>) -> HttpResponse {
    let mut game = Game {
        id: 0,
        start_date: new_game.start_date,
        is_ended: new_game.is_ended,
        score: new_game.score,
        title: new_game.title.to_string(),
        tracks_number: new_game.tracks_number,
        is_public: new_game.is_public,
        mode: new_game.mode,
    };
    match game.create() {
        Err(mut e) => e.send(),
        _ => HttpResponse::Ok().json(game),
    }
}

fn edit(req: HttpRequest, updated_game: web::Json<Game>) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match Game::get_one_by_id(id) {
            Some(mut game) => {
                if updated_game.start_date > 0 {
                    game.start_date = updated_game.start_date;
                }
                if updated_game.score > 0 {
                    game.score = updated_game.score;
                }
                if updated_game.is_ended {
                    game.is_ended = updated_game.is_ended;
                }
                if updated_game.is_public {
                    game.is_public = updated_game.is_public;
                }
                if updated_game.title.len() > 0 {
                    game.title = updated_game.title.to_string();
                }
                if updated_game.tracks_number > 0 {
                    game.tracks_number = updated_game.tracks_number;
                }
                // can't update game mode
                match game.update() {
                    Err(mut e) => e.send(),
                    _ => HttpResponse::Ok().json(game),
                }
            }
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND),
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}

fn get_one(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match Game::get_one_by_id(id) {
            Some(game) => HttpResponse::Ok().json(game),
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND),
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match Game::delete(id) {
            Err(mut e) => e.send(),
            _ => HttpResponse::new(http::StatusCode::NO_CONTENT),
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}
