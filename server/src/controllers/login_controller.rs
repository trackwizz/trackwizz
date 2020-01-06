use actix_web::{guard, http, web, HttpRequest, HttpResponse};

use reqwest;
use reqwest::Client;

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

    let mut response:Result<TokensResponse, Error> = match Client::new()
        .post(&authOptions.url)
        .basic_auth(
            String::from("b40d05324ed744d0b7c593f04d6e6821"),
            Some(String::from("cfe0feb180e84c7bbc5794e276618924")),
        )
        .json(&authOptions)
        .send()?
        .json()?;

    match response
    {
        Ok(val) => val,
        Err(error) => return HttpResponse::Ok().json(authOptions),
    };

    //response.json()?

    // match response.json() {
    //     Ok(val) => return val,
    //     Err(error) => return HttpResponse::Ok().json(authOptions),
    // };

    HttpResponse::Ok().json(response)

    // let gist: Gist = response.json()?;

    // fn main() -> Result<()> {
    //     let gh_user = env::var("GH_USER")?;
    //     let gh_pass = env::var("GH_PASS")?;
    //     let gist_body = json!({
    //         "description": "the description for this gist",
    //         "public": true,
    //         "files": {
    //              "main.rs": {
    //              "content": r#"fn main() { println!("hello world!");}"#
    //             }
    //         }});
    //     let request_url = "https://api.github.com/gists";
    //     let mut response = Client::new()
    //         .post(request_url)
    //         .basic_auth(gh_user.clone(), Some(gh_pass.clone()))
    //         .json(&gist_body)
    //         .send()?;
    //     let gist: Gist = response.json()?;
    //     println!("Created {:?}", gist);
    //     let request_url = format!("{}/{}",request_url, gist.id);
    //     let response = Client::new()
    //         .delete(&request_url)
    //         .basic_auth(gh_user, Some(gh_pass))
    //         .send()?;
    //     println!("Gist {} deleted! Status code: {}",gist.id, response.status());
    //     Ok(())
    // }
}
