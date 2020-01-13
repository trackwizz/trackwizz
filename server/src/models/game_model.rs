use crate::database::{execute, insert, query};
use crate::utils::errors::AppError;
use postgres::rows::Row;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase", deserialize = "camelCase"))]
pub struct Game {
    #[serde(default)]
    pub id: i32,
    #[serde(default)]
    pub start_date: i64,
    #[serde(default)]
    pub is_ended: bool,
    #[serde(default)]
    pub score: i32,
    #[serde(default)]
    pub title: String,
    #[serde(default)]
    pub tracks_number: i32,
    #[serde(default)]
    pub is_public: bool,
    #[serde(default)]
    pub mode: i16,
}

impl Game {
    pub fn new_from_row(row: Row) -> Game {
        Game {
            id: row.get(0),
            start_date: row.get(1),
            is_ended: row.get(2),
            score: row.get(3),
            title: row.get(4),
            tracks_number: row.get(5),
            is_public: row.get(6),
            mode: row.get(7),
        }
    }

    pub fn get_one_by_id(id: i32) -> Option<Game> {
        let mut game: Option<Game> = None;

        match query("queries/game/getOne.sql", &[&id]) {
            Some(rows) => {
                if !rows.is_empty() {
                    let row = rows.get(0);
                    game = Some(Game::new_from_row(row));
                }
            }
            _ => {}
        }

        game
    }

    pub fn create(&mut self) -> Result<(), AppError> {
        match insert(
            "queries/game/insert.sql",
            &[
                &self.start_date,
                &self.is_ended,
                &self.score,
                &self.title,
                &self.tracks_number,
                &self.is_public,
                &self.mode,
            ],
        ) {
            Ok(id) => {
                self.id = id;
                Ok(())
            }
            Err(e) => Err(e),
        }
    }

    pub fn update(&mut self) -> Result<(), AppError> {
        execute(
            "queries/game/update.sql",
            &[
                &self.id,
                &self.start_date,
                &self.is_ended,
                &self.score,
                &self.title,
                &self.tracks_number,
                &self.is_public,
                &self.mode,
            ],
        )
    }

    pub fn delete(id: i32) -> Result<(), AppError> {
        execute("queries/game/delete.sql", &[&id])
    }
}
