use actix_web::{guard, http, web, HttpRequest, HttpResponse};

use crate::models::test_model::TestObj;
use serde_json::json;

//const redirect_uri = "http://localhost:8888/callback";
//const front_redirect_uri = "http://localhost:3000/login?";

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/")
            .route("/login", web::get().to(login))
            .route("/callback", web::get().to(callback))
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
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct LoginConfig {
    #[serde(default)]
    pub response_type: String,
    pub client_id: String,
    pub scope: String,
    pub redirect_uri: String,
    pub state: String,
}



//#TODO do not hardcode client_id,
//#TODO generate state randomly.

fn login(_req: HttpRequest) -> HttpResponse {
    println!("goooooood on est là!");
    HttpResponse::Ok().json(json!({
        "response_type": String::from("code"),
        "client_id": String::from("b40d05324ed744d0b7c593f04d6e6821"),
        "scope": String::from("user-read-private user-read-email user-read-playback-state"),
        "redirect_uri": String::from("http://localhost:5000/callback"),
        "state": String::from("118218")
    }))
}

#[derive(Serialize, Deserialize)]
pub struct AuthOptions {
    #[serde(default)]
    pub url: String,
    pub form: Form,
    pub headers: Header,
    pub json: String,
}

#[derive(Serialize, Deserialize)]
pub struct Form {
    #[serde(default)]
    pub code: String,
    pub redirect_uri: String,
    pub grant_type: String,
}

#[derive(Serialize, Deserialize)]
pub struct Header {
    #[serde(default)]
    pub Authorization: String,
}

fn callback(_req: HttpRequest) -> HttpResponse {

    //let code = String::from(_req.query().get("code"));
    //let state = String::from(_req.query().get("state"));

    //const authOptions = {
    //    url: 'https://accounts.spotify.com/api/token',
    //    form: {
    //        code,
    //        redirect_uri,
    //        grant_type: 'authorization_code'
    //    },
    //    headers: {
    //        Authorization: `Basic ${new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
    //    },
    //    json: true
    //};

    println!("coucou on est là!");

    HttpResponse::Ok().json(LoginConfig {
        response_type: String::from("code"),
        client_id: String::from("b40d05324ed744d0b7c593f04d6e6821"),
        scope: String::from("user-read-private user-read-email user-read-playback-state"),
        redirect_uri: String::from("http://localhost:5000/callback"),
        state: String::from("118218"),
    })
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
