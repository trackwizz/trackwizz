use serde::{Deserialize, Serialize};
use super::genre_model::Genre;
use crate::database::{query, insert, execute};

#[derive(Serialize, Deserialize)]
pub struct Track {
    #[serde(default)]
    pub id: i32,
    #[serde(default)]
    pub spotify_id: String,
    #[serde(default)]
    pub title: String,
    #[serde(default)]
    pub length: i32,
    #[serde(default)]
    pub id_genre: i32,
    #[serde(default)]
    pub genre: Option<Genre>,
}

pub fn get_all_tracks() -> Vec<Track> {
    let mut tracks: Vec<Track> = vec![];

    match query("queries/track/getAll.sql", &[]) {
        Some(rows) => {
            for row in rows.iter() {
                tracks.push(Track{
                    id: row.get(0),
                    spotify_id: row.get(1),
                    title: row.get(2),
                    length: row.get(3),
                    id_genre: row.get(4),
                    genre: Some(Genre{
                        id: row.get(4),
                        name: row.get(5),
                    }),
                });
            }
        }
        _ => {}
    }

    tracks
}

pub fn get_one_track_by_id(id: i32) -> Option<Track> {
    let mut track: Option<Track> = None;

    match query("queries/track/getOne.sql", &[&id]) {
        Some(rows) => {
            if !rows.is_empty() {
                let row = rows.get(0);
                track = Some(Track{
                    id: row.get(0),
                    spotify_id: row.get(1),
                    title: row.get(2),
                    length: row.get(3),
                    id_genre: row.get(4),
                    genre: Some(Genre{
                        id: row.get(4),
                        name: row.get(5),
                    }),
                });
            }
        }
        _ => {}
    }

    track
}

pub fn delete_track(id: i32) {
    execute("queries/track/delete.sql", &[&id]);
}

impl Track {
    pub fn create(&mut self) {
        match insert("queries/track/insert.sql", &[&self.spotify_id, &self.title, &self.length, &self.id_genre]) {
            Some(id) => {
                self.id = id;
            }
            _ => {}
        }
    }

    pub fn update(&mut self) {
        execute("queries/track/update.sql", &[&self.id, &self.spotify_id, &self.title, &self.length, &self.id_genre]);
    }
}
