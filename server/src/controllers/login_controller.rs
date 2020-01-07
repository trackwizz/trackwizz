use actix_web::{http, web, HttpRequest, HttpResponse};
use actix_web::client::Client;

//use serde_json;

//use serde_json::json;

//const redirect_uri = "http://localhost:8888/callback";
//const front_redirect_uri = "http://localhost:3000/login?";

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/")
            .route("/login", web::get().to(login))
            .route("/callback", web::get().to(callback))
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

    let login_config = LoginConfig {
        response_type: String::from("code"),
        client_id: String::from("b40d05324ed744d0b7c593f04d6e6821"),
        scope: String::from("user-read-private user-read-email user-read-playback-state"),
        redirect_uri: String::from("http://localhost:5000/callback"),
        state: String::from("118218"),
    };

    HttpResponse::Ok().json(login_config)
    // HttpResponse::Ok().json()
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
    pub authorization: String,
}

#[derive(Serialize, Deserialize)]
pub struct TokensResponse {
    #[serde(default)]
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: String,
}

async fn callback(_req: HttpRequest) -> HttpResponse {
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

    let authOptions = AuthOptions {
        url: String::from("https://accounts.spotify.com/api/token"),
        form: Form {
            code: String::from("code"),
            redirect_uri: String::from("http://localhost:5000/callback"),
            grant_type: String::from("authorization_code"),
        },
        headers: Header {
            authorization: String::from(
                "Basic b40d05324ed744d0b7c593f04d6e6821:cfe0feb180e84c7bbc5794e276618924",
            ),
        },
        json: String::from("http://localhost:5000/callback"),
    };

    let response_result = Client::new()
        .post(&authOptions.url)
        .basic_auth(
            String::from("b40d05324ed744d0b7c593f04d6e6821"),
            Some("cfe0feb180e84c7bbc5794e276618924"),
        )
        .send_json(&authOptions)
        .await;

    match response_result {
        Ok(response) => {
            println!("Response: {:?}", response);
        },
        Err(err) => {
            println!("Error: {:?}", err);
        }
    };

    HttpResponse::new(http::StatusCode::BAD_REQUEST)
}
