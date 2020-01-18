use crate::models::score_model::Score;
use actix_web::{guard, http, web, HttpRequest, HttpResponse};

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/scores")
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
            .route("/{id}", web::delete().to(delete))
            .route("/game/{id_game}", web::get().to(get_all_from_game)),
    );
}

fn get_all(_req: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().json(Score::get_all(None))
}

fn get_all_from_game(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id_game").unwrap().parse::<i32>() {
        Ok(id_game) => HttpResponse::Ok().json(Score::get_all(Some(id_game))),
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}

fn get_one(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match Score::get_one_by_id(id) {
            Some(score) => HttpResponse::Ok().json(score),
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND),
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}

fn create(_req: HttpRequest, new_score: web::Json<Score>) -> HttpResponse {
    let mut score = Score {
        id: 0,
        id_game: new_score.id_game,
        id_user: new_score.id_user,
        spotify_track_id: new_score.spotify_track_id.to_string(),
        timestamp: new_score.timestamp,
        is_correct: new_score.is_correct,
        reaction_time_ms: new_score.reaction_time_ms,
    };
    match score.create() {
        Err(mut e) => e.send(),
        _ => HttpResponse::Ok().json(score),
    }
}

fn edit(req: HttpRequest, updated_score: web::Json<Score>) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match Score::get_one_by_id(id) {
            Some(mut score) => {
                if updated_score.id_game > 0 {
                    score.id_game = updated_score.id_game
                }
                if updated_score.id_user > 0 {
                    score.id_user = updated_score.id_user
                }
                if updated_score.spotify_track_id.len() > 0 {
                    score.spotify_track_id = updated_score.spotify_track_id.to_string();
                }
                if updated_score.timestamp > 0 {
                    score.timestamp = updated_score.timestamp
                }
                if updated_score.reaction_time_ms > 0 {
                    score.reaction_time_ms = updated_score.reaction_time_ms
                }
                score.is_correct = updated_score.is_correct;
                match score.update() {
                    Err(mut e) => e.send(),
                    _ => HttpResponse::Ok().json(score),
                }
            }
            _ => HttpResponse::new(http::StatusCode::NOT_FOUND),
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}

fn delete(req: HttpRequest) -> HttpResponse {
    match req.match_info().get("id").unwrap().parse::<i32>() {
        Ok(id) => match Score::delete(id) {
            Err(mut e) => e.send(),
            _ => HttpResponse::new(http::StatusCode::NO_CONTENT),
        },
        Err(_) => HttpResponse::new(http::StatusCode::NOT_FOUND),
    }
}
