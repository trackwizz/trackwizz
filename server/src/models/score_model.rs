use serde::{Deserialize, Serialize};
use postgres::rows::Row;
use crate::database::{query, insert, execute};
use crate::utils::errors::AppError;

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase", deserialize = "camelCase"))]
pub struct Score {
    #[serde(default)]
    pub id: i32,
    #[serde(default)]
    pub id_game: i32,
    #[serde(default)]
    pub id_user: i32,
    #[serde(default)]
    pub spotify_track_id: String,
    #[serde(default)]
    pub timestamp: i64,
    #[serde(default)]
    pub is_correct: bool,
    #[serde(default)]
    pub reaction_time_ms: i32,
}

impl Score {
    pub fn new_from_row(row: Row) -> Score {
        Score{
            id: row.get(0),
            id_game: row.get(1),
            id_user: row.get(2),
            spotify_track_id: row.get(3),
            timestamp: row.get(4),
            is_correct: row.get(5),
            reaction_time_ms: row.get(6)
        }
    }

    pub fn get_all() -> Vec<Score> {
        let mut scores: Vec<Score> = vec![];

        match query("queries/score/getAll.sql", &[]) {
            Some(rows) => {
                for row in rows.iter() {
                    scores.push(Score::new_from_row(row));
                }
            }
            _ => {}
        }

        scores
    }

    pub fn get_one_by_id(id: i32) -> Option<Score> {
        let mut score: Option<Score> = None;

        match query("queries/score/getOne.sql", &[&id]) {
            Some(rows) => {
                if !rows.is_empty() {
                    let row = rows.get(0);
                    score = Some(Score::new_from_row(row));
                }
            }
            _ => {}
        }

        score
    }

    pub fn create(&mut self) -> Result<(), AppError> {
        match insert("queries/score/insert.sql", &[&self.id_game, &self.id_user, &self.spotify_track_id, &self.timestamp, &self.is_correct, &self.reaction_time_ms]) {
            Ok(id) => {
                self.id = id;
                Ok(())
            }
            Err(e) => Err(e)
        }
    }

    pub fn update(&mut self) -> Result<(), AppError> {
        execute("queries/score/update.sql", &[&self.id, &self.id_game, &self.id_user, &self.spotify_track_id, &self.timestamp, &self.is_correct, &self.reaction_time_ms])
    }

    pub fn delete(id: i32) -> Result<(), AppError> {
        execute("queries/score/delete.sql", &[&id])
    }
}
