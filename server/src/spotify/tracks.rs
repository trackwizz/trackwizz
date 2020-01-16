use actix_web::client::Client;
use actix_web::{HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};
use crate::utils::to_query_string;

// documentation link:
// https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/

#[derive(Deserialize)]
struct SpotifyArtist {
    name: String,
}

#[derive(Deserialize)]
struct SpotifyTrack {
    preview_url: String,
    id: String,
    name: String,
    track_number: i32,
    artists: Vec<SpotifyArtist>,
}

#[derive(Deserialize)]
struct SpotifyTrackItems {
    items: Vec<SpotifyTrackGlobal>,
}
impl SpotifyTrackItems {
    fn default() -> SpotifyTrackItems {
        SpotifyTrackItems {
            items: vec![],
        }
    }
}

#[derive(Deserialize)]
struct SpotifyTrackGlobal {
    track: SpotifyTrack,
}

#[derive(Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
struct NewTrack {
    id: String,
    name: String,
    preview_url: String,
    track_number: i32,
    artist: String,
}

#[derive(Deserialize)]
#[serde(rename_all(deserialize = "camelCase"))]
struct Payload {
    playlist_id: String,
}
impl Payload {
    fn default() -> Payload {
        Payload {
            playlist_id: String::default(),
        }
    }
}

pub async fn get_playlist_tracks(req: HttpRequest) -> HttpResponse {
    let bearer_token: Option<&str> = req
        .headers()
        .get("Authorization")
        .and_then(|t| Some(t.to_str().unwrap()));
    let spotify_playlist_id: String = serde_urlencoded::from_str::<Payload>(req.query_string()).unwrap_or(Payload::default()).playlist_id;

    let mut tracks: Vec<NewTrack> = vec![];

    if spotify_playlist_id.clone().is_empty() {
        return HttpResponse::Ok().json(tracks);
    }

    match bearer_token {
        Some(token) => {

            let query_params: String = to_query_string(&[
                ("fields", "items(track(name, id, artists, preview_url, track_number))"),
                ("market", "FR")
            ]);

            let request = Client::new()
                .get(format!(
                    "https://api.spotify.com/v1/playlists/{}/tracks?{}",
                    spotify_playlist_id, query_params
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
                        let resp_body: SpotifyTrackItems = match body.json::<SpotifyTrackItems>().await {
                            Ok(sp_ti) => {
                                sp_ti
                            },
                            Err(err) => {
                                println!("Err: {:?}", err);
                                SpotifyTrackItems::default()
                            },
                        };

                        for global_track in resp_body.items {
                            tracks.push(NewTrack {
                                preview_url: global_track.track.preview_url,
                                id: global_track.track.id,
                                name: global_track.track.name,
                                track_number: global_track.track.track_number,
                                artist: global_track.track.artists.iter().map(|artist: &SpotifyArtist| { artist.name.clone() }).collect::<Vec<String>>().join(" & "),
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
