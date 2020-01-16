use actix_web::client::Client;
use actix_web::{HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};

// documentation link:
// https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/

#[derive(Deserialize)]
struct SpotifyTrack {
    preview_url: String,
    id: String,
    name: String,
}

#[derive(Deserialize)]
struct SpotifyTrackItems {
    items: Vec<SpotifyTrackglobal>,
}

#[derive(Deserialize)]
struct SpotifyTrackglobal {
    track: SpotifyTrack,
}

#[derive(Serialize)]
struct NewTrack {
    id: String,
    name: String,
    preview_url: String,
}

pub async fn get_playlist_tracks(req: HttpRequest) -> HttpResponse {
    let bearer_token: Option<&str> = req
        .headers()
        .get("Authorization")
        .and_then(|t| Some(t.to_str().unwrap()));

    let mut tracks: Vec<NewTrack> = vec![];

    match bearer_token {
        Some(token) => {
            // TODO add playlist id in request parameter
            let playlist_id = "37i9dQZF1DX4sWSpwq3LiO";

            let request = Client::new()
                .get(format!(
                    "https://api.spotify.com/v1/playlists/{}/tracks",
                    &playlist_id
                ))
                .header("Authorization", token)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .send()
                .await;

            match request {
                Ok(mut body) => {
                    let success: bool = body.status().as_u16() < 400;
                    if success {
                        let resp_body: SpotifyTrackItems =
                            body.json::<SpotifyTrackItems>().await.unwrap();

                        for global_track in resp_body.items {
                            tracks.push(NewTrack {
                                preview_url: global_track.track.preview_url,
                                id: global_track.track.id,
                                name: global_track.track.name,
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

    HttpResponse::Ok().json(tracks)
}
