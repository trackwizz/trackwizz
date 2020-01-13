use std::time::{SystemTime, Duration};
use actix_web::{web, HttpRequest, HttpResponse};
use actix_web::client::{Client, ClientRequest};
use serde::{Deserialize, Serialize};

use crate::utils::{get_env_variable, redirect_to, to_query_string, get_random_string};

static REDIRECT_URI: &str = "http://localhost:5000/callback";
static FRONT_REDIRECT_URI: &str = "http://localhost:3000/login?";

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/")
            .route("/login", web::get().to(login))
            .route("/callback", web::get().to(callback))
            .route("/refresh_token", web::get().to(refresh_token))
    );
}

fn get_expires_at(expires_in: u128) -> u128 {
    let current_timestamp: u128 = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap_or(Duration::default())
        .as_millis();
    return current_timestamp + expires_in * 1000 - 120 * 1000;
}

fn make_spotify_request() -> ClientRequest {
    return Client::new()
        .post("https://accounts.spotify.com/api/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .basic_auth(
            get_env_variable("CLIENT_ID", ""),
            Some(get_env_variable("CLIENT_SECRET", "").as_ref()),
        );
}

///------------ Login ----------
#[derive(Serialize)]
struct LoginConfig {
    #[serde(default)]
    response_type: String,
    client_id: String,
    scope: String,
    redirect_uri: String,
    state: String,
}

fn login(_req: HttpRequest) -> HttpResponse {
    let login_config = LoginConfig {
        response_type: String::from("code"),
        client_id: get_env_variable("CLIENT_ID", ""),
        scope: String::from("user-read-private user-read-email user-read-playback-state"),
        redirect_uri: REDIRECT_URI.to_string().clone(),
        state: get_random_string(32),
    };

    HttpResponse::Ok().json(login_config)
}

///------------ Callback --------
#[derive(Serialize)]
struct CallbackForm {
    code: String,
    redirect_uri: String,
    grant_type: String,
}

#[derive(Deserialize)]
struct CallbackSuccess {
    #[serde(default)]
    access_token: String,
    #[serde(default)]
    refresh_token: String,
    #[serde(default)]
    expires_in: u128, // check type
}

impl CallbackSuccess {
    fn default() -> CallbackSuccess {
        CallbackSuccess {
            access_token: String::default(),
            refresh_token: String::default(),
            expires_in: 0,
        }
    }
}

#[derive(Deserialize)]
struct CallbackError {
    #[serde(default)]
    error: String,
    #[serde(default)]
    error_description: String,
}

impl CallbackError {
    fn default() -> CallbackError {
        CallbackError {
            error: String::default(),
            error_description: String::default(),
        }
    }
}

#[derive(Deserialize)]
struct CallbackInfo {
    #[serde(default)]
    code: Option<String>,
    #[serde(default)]
    state: Option<String>,
}

async fn callback(_req: HttpRequest, info: web::Query<CallbackInfo>) -> HttpResponse {
    let code: String = info.code.as_ref().unwrap_or(&String::default()).parse().unwrap();
    let state: Option<&String> = info.state.as_ref();

    if state.is_none() || state.unwrap().len() == 0 {
        let query_params: String = to_query_string(&[("error", true)]);
        return redirect_to(format!("{}{}", FRONT_REDIRECT_URI, query_params).as_str())
    }

    let form: CallbackForm = CallbackForm {
        code,
        redirect_uri: REDIRECT_URI.to_string().clone(),
        grant_type: String::from("authorization_code"),
    };

    let request = make_spotify_request()
        .send_form(&form)
        .await;

    match request {
        Ok(mut body) => {
            let success: bool = body.status().as_u16() < 400;
            if success {
                let callback_success: CallbackSuccess = body.json::<CallbackSuccess>().await.unwrap_or(CallbackSuccess::default());

                let query_params: String = to_query_string(&[
                    ("access_token", callback_success.access_token),
                    ("refresh_token", callback_success.refresh_token),
                    ("expires_at", get_expires_at(callback_success.expires_in).to_string()),
                ]);
                return redirect_to(format!("{}{}", FRONT_REDIRECT_URI, query_params).as_str());
            } else { // Error
                let callback_error: CallbackError = body.json::<CallbackError>().await.unwrap_or(CallbackError::default());
                println!("{}: {}", callback_error.error, callback_error.error_description);
            }
        },
        Err(err) => {
            println!("Error on Spotify response: {:?}", err);
        },
    };

    let query_params: String = to_query_string(&[("error", true)]);
    redirect_to(format!("{}{}", FRONT_REDIRECT_URI, query_params).as_str())
}

///------------ Refresh token --------

#[derive(Serialize)]
struct RefreshTokenForm {
    grant_type: String,
    refresh_token: String,
}

#[derive(Deserialize)]
struct RefreshTokenSpotifyResponse {
    #[serde(default)]
    access_token: String,
    #[serde(default)]
    expires_in: u128, // check type
}

#[derive(Deserialize)]
struct RefreshTokenQuery {
    #[serde(default)]
    refresh_token: Option<String>,
}

#[derive(Serialize)]
struct RefreshTokenErrorResponse {
    error: String,
}

#[derive(Serialize)]
struct RefreshTokenResponse {
    access_token: String,
    expires_at: String,
}

async fn refresh_token(_req: HttpRequest, query: web::Query<RefreshTokenQuery>) -> HttpResponse {
    let refresh_token: Option<&String> = query.refresh_token.as_ref();

    if refresh_token.is_none() || refresh_token.unwrap().len() == 0 {
        let error: RefreshTokenErrorResponse = RefreshTokenErrorResponse {
            error: String::from("Missing refresh token in querystring"),
        };
        return HttpResponse::BadRequest().json(error);
    }

    let refresh_token_string: String = refresh_token.unwrap_or(&String::default()).parse().unwrap();

    let form: RefreshTokenForm = RefreshTokenForm {
        grant_type: String::from("refresh_token"),
        refresh_token: refresh_token_string,
    };

    let request = make_spotify_request()
        .send_form(&form)
        .await;

    let error: RefreshTokenErrorResponse = RefreshTokenErrorResponse {
        error: String::from("Spotify returned an error."),
    };

    return match request {
        Ok(mut body) => {
            let success: bool = body.status().as_u16() < 400;
            if success {
                let res_body: RefreshTokenSpotifyResponse = body.json::<RefreshTokenSpotifyResponse>().await.unwrap();

                let response: RefreshTokenResponse = RefreshTokenResponse {
                    access_token: res_body.access_token,
                    expires_at: get_expires_at(res_body.expires_in).to_string(),
                };

                HttpResponse::Ok().json(response)
            } else {
                HttpResponse::BadRequest().json(error)
            }
        },
        Err(_err) => {
            HttpResponse::BadRequest().json(error)
        },
    };
}