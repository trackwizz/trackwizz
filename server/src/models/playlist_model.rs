use serde::{Deserialize, Serialize};
use crate::database::{query, insert, execute};

#[derive(Serialize, Deserialize)]
pub struct Playlist {
    #[serde(default)]
    pub id: i32,
    pub title: String,
}

pub fn get_all_playlists() -> Vec<Playlist> {
    let mut playlists: Vec<Playlist> = vec![];

    match query("queries/playlist/getAll.sql", &[]) {
        Some(rows) => {
            for row in rows.iter() {
                playlists.push(Playlist{
                    id: row.get(0),
                    title: row.get(1),
                });
            }
        }
        _ => {}
    }

    playlists
}

pub fn get_one_playlist_by_id(id: i32) -> Option<Playlist> {
    let mut playlist: Option<Playlist> = None;

    match query("queries/playlist/getOne.sql", &[&id]) {
        Some(rows) => {
            if !rows.is_empty() {
                let row = rows.get(0);
                playlist = Some(Playlist{
                    id: row.get(0),
                    title: row.get(1),
                });
            }
        }
        _ => {}
    }

    playlist
}

impl Playlist {
    pub fn create(&mut self) {
        match insert("queries/playlist/insert.sql", &[&self.title]) {
            Some(id) => {
                self.id = id;
            }
            _ => {}
        }
    }

    pub fn update(&mut self) {
        execute("queries/playlist/update.sql", &[&self.id, &self.title]);
    }

    pub fn delete(&mut self) {
        execute("queries/playlist/delete.sql", &[&self.id]);
    }
}
