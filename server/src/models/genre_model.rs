use serde::{Deserialize, Serialize};
use crate::database::{query, insert, execute};
use crate::utils::errors::AppError;

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase", deserialize = "camelCase"))]
pub struct Genre {
    #[serde(default)]
    pub id: i32,
    pub name: String,
}

impl Genre {
    pub fn get_all() -> Vec<Genre> {
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

    pub fn get_one_by_id(id: i32) -> Option<Genre> {
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

    pub fn create(&mut self) -> Result<(), AppError> {
        match insert("queries/genre/insert.sql", &[&self.name]) {
            Ok(id) => {
                self.id = id;
                Ok(())
            }
            Err(e) => Err(e)
        }
    }

    pub fn update(&mut self) -> Result<(), AppError> {
        execute("queries/genre/update.sql", &[&self.id, &self.name])
    }

    pub fn delete(id: i32) -> Result<(), AppError> {
        execute("queries/genre/delete.sql", &[&id])
    }
}
