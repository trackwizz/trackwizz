use serde::{Deserialize, Serialize};
use postgres::rows::Row;
use super::genre_model::Genre;
use crate::database::{query, insert, execute};
use crate::utils::errors::AppError;

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase", deserialize = "camelCase"))]
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
    #[serde(skip_serializing_if = "Option::is_none")]
    pub genre: Option<Genre>,
    #[serde(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub track_index: Option<i32>,
}

impl Track {
    pub fn new_from_row(row: Row) -> Track {
        Track{
            id: row.get(0),
            spotify_id: row.get(1),
            title: row.get(2),
            length: row.get(3),
            id_genre: row.get(4),
            genre: Some(Genre{
                id: row.get(4),
                name: row.get(5),
            }),
            track_index: None,
        }
    }

    pub fn get_all() -> Vec<Track> {
        let mut tracks: Vec<Track> = vec![];

        match query("queries/track/getAll.sql", &[]) {
            Some(rows) => {
                for row in rows.iter() {
                    tracks.push(Track::new_from_row(row));
                }
            }
            _ => {}
        }

        tracks
    }

    pub fn get_one_by_id(id: i32) -> Option<Track> {
        let mut track: Option<Track> = None;

        match query("queries/track/getOne.sql", &[&id]) {
            Some(rows) => {
                if !rows.is_empty() {
                    let row = rows.get(0);
                    track = Some(Track::new_from_row(row));
                }
            }
            _ => {}
        }

        track
    }

    pub fn create(&mut self) -> Result<(), AppError> {
        match insert("queries/track/insert.sql", &[&self.spotify_id, &self.title, &self.length, &self.id_genre]) {
            Ok(id) => {
                self.id = id;
                Ok(())
            }
            Err(e) => Err(e)
        }
    }

    pub fn update(&mut self) -> Result<(), AppError> {
        execute("queries/track/update.sql", &[&self.id, &self.spotify_id, &self.title, &self.length, &self.id_genre])
    }

    pub fn delete(id: i32) -> Result<(), AppError> {
        execute("queries/track/delete.sql", &[&id])
    }
}
