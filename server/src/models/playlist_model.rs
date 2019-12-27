use std::borrow::Borrow;
use serde::{Deserialize, Serialize};
use crate::database::{query, insert, execute};
use crate::models::track_model::Track;
use crate::utils::errors::AppError;

#[derive(Serialize, Deserialize)]
pub struct Playlist {
    #[serde(default)]
    pub id: i32,
    pub title: String,
    #[serde(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tracks: Option<Vec<Track>>,
}

impl Playlist {
    pub fn new(id: i32, title: String) -> Playlist {
        Playlist{
            id,
            title,
            tracks: None,
        }
    }

    pub fn get_all() -> Vec<Playlist> {
        let mut playlists: Vec<Playlist> = vec![];

        match query("queries/playlist/getAll.sql", &[]) {
            Some(rows) => {
                for row in rows.iter() {
                    playlists.push(Playlist{
                        id: row.get(0),
                        title: row.get(1),
                        tracks: None,
                    });
                }
            }
            _ => {}
        }

        playlists
    }

    pub fn get_one_by_id(id: i32) -> Option<Playlist> {
        let mut playlist: Option<Playlist> = None;

        match query("queries/playlist/getOne.sql", &[&id]) {
            Some(rows) => {
                if !rows.is_empty() {
                    let row = rows.get(0);
                    playlist = Some(Playlist{
                        id: row.get(0),
                        title: row.get(1),
                        tracks: None,
                    });
                }
            }
            _ => {}
        }

        playlist
    }

    pub fn create(&mut self) {
        match insert("queries/playlist/insert.sql", &[&self.title]) {
            Ok(id) => {
                self.id = id;
            }
            _ => {}
        }
    }

    pub fn update(&mut self) -> Result<(), AppError> {
        execute("queries/playlist/update.sql", &[&self.id, &self.title])
    }

    pub fn delete(id: i32) -> Result<(), AppError> {
        execute("queries/playlist/delete.sql", &[&id])
    }

    pub fn get_tracks(&mut self) -> &Vec<Track> {
        let mut tracks: Vec<Track> = vec![];
        self.tracks = Some(vec![]);

        match query("queries/rel_playlist_tracks/getAll.sql", &[&self.id]) {
            Some(rows) => {
                for row in rows.iter() {
                    let track_index: i32 = row.borrow().get(6);
                    let mut track: Track = Track::new_from_row(row);
                    track.track_index = Some(track_index);
                    tracks.push(track);
                }
            },
            _ => {},
        }
        self.tracks = Some(tracks);
        self.tracks.as_ref().unwrap()
    }

    pub fn get_track(&mut self, id_track: i32) -> Option<Track> {
        match query("queries/rel_playlist_tracks/getOne.sql", &[&self.id, &id_track]) {
            Some(rows) => {
                if !rows.is_empty() {
                    let track_index: i32 = rows.borrow().get(0).get(6);
                    let mut track: Track = Track::new_from_row(rows.get(0));
                    track.track_index = Some(track_index);
                    return Some(track)
                }
                None
            },
            _ => None,
        }
    }

    pub fn add_track(&mut self, id_track: i32) -> Result<i32, AppError> {
        insert("queries/rel_playlist_tracks/insert.sql", &[&id_track, &self.id])
    }

    pub fn update_track_index(&mut self, id_track: i32, track_index: i32) -> Result<(), AppError> {
        execute("queries/rel_playlist_tracks/update.sql", &[&id_track, &self.id, &track_index])
    }

    pub fn delete_track(&mut self, id_track: i32) -> Result<(), AppError> {
        execute("queries/rel_playlist_tracks/delete.sql", &[&id_track, &self.id])
    }
}
