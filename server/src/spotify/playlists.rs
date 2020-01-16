use actix_web::client::Client;
use actix_web::{HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct SpotifyImage {
    url: String,
}
#[derive(Deserialize)]
struct SpotifyPlaylist {
    description: String,
    id: String,
    images: Vec<SpotifyImage>,
    name: String,
}
#[derive(Deserialize)]
struct SpotifyPlaylistItems {
    items: Vec<SpotifyPlaylist>,
}
#[derive(Deserialize)]
struct SpotifyPlaylists {
    playlists: SpotifyPlaylistItems,
}

#[derive(Serialize)]
struct NewPlaylist {
    description: String,
    id: String,
    name: String,
    image: Option<String>,
}

pub async fn get_spotify_playlists(req: HttpRequest) -> HttpResponse {
    let bearer_token: Option<&str> = req
        .headers()
        .get("Authorization")
        .and_then(|t| Some(t.to_str().unwrap()));

    let mut playlists: Vec<NewPlaylist> = vec![];

    match bearer_token {
        Some(token) => {
            let request = Client::new()
                .get("https://api.spotify.com/v1/browse/featured-playlists?country=FR")
                .header("Authorization", token)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .send()
                .await;

            match request {
                Ok(mut body) => {
                    let success: bool = body.status().as_u16() < 400;
                    if success {
                        let resp_body: SpotifyPlaylists =
                            body.json::<SpotifyPlaylists>().await.unwrap();
                        for playlist in resp_body.playlists.items {
                            playlists.push(NewPlaylist {
                                description: playlist.description,
                                id: playlist.id,
                                name: playlist.name,
                                image: playlist
                                    .images
                                    .get(0)
                                    .and_then(|i: &SpotifyImage| Some(i.url.clone())),
                            });
                        }
                    } else {
                        // Error
                        println!("response: {:?}", body);
                    }
                }
                Err(err) => {
                    println!("Error on Spotify response: {:?}", err);
                }
            };
        }
        None => {}
    };

    HttpResponse::Ok().json(playlists)
}
