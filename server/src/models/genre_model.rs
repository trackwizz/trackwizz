use serde::{Deserialize, Serialize};
use crate::database::{query, insert, execute};

#[derive(Serialize, Deserialize)]
pub struct Genre {
    #[serde(default)]
    pub id: i32,
    pub name: String,
}

pub fn get_all_genres() -> Vec<Genre> {
    let mut genres: Vec<Genre> = vec![];

    match query("queries/genre/getAll.sql", &[]) {
        Some(rows) => {
            for row in rows.iter() {
                genres.push(Genre{
                    id: row.get(0),
                    name: row.get(1),
                });
            }
        }
        _ => {}
    }

    genres
}

pub fn get_one_genre_by_id(id: i32) -> Option<Genre> {
    let mut genre: Option<Genre> = None;

    match query("queries/genre/getOne.sql", &[&id]) {
        Some(rows) => {
            if !rows.is_empty() {
                let row = rows.get(0);
                genre = Some(Genre{
                    id: row.get(0),
                    name: row.get(1),
                });
            }
        }
        _ => {}
    }

    genre
}

impl Genre {
    pub fn create(&mut self) {
        match insert("queries/genre/insert.sql", &[&self.name]) {
            Some(id) => {
                self.id = id;
            }
            _ => {}
        }
    }

    pub fn update(&mut self) {
        execute("queries/genre/update.sql", &[&self.id, &self.name]);
    }

    pub fn delete(&mut self) {
        execute("queries/genre/delete.sql", &[&self.id]);
    }
}
