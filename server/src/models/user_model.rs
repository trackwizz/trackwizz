use serde::{Deserialize, Serialize};
use crate::database::{query, insert, execute};
use crate::utils::errors::AppError;

#[derive(Serialize, Deserialize)]
pub struct User {
    #[serde(default)]
    pub id: i32,
    pub name: String,
}

impl User {
    pub fn get_all() -> Vec<User> {
        let mut users: Vec<User> = vec![];

        match query("queries/user/getAll.sql", &[]) {
            Some(rows) => {
                for row in rows.iter() {
                    users.push(User{
                        id: row.get(0),
                        name: row.get(1),
                    });
                }
            }
            _ => {}
        }

        users
    }

    pub fn get_one_by_id(id: i32) -> Option<User> {
        let mut user: Option<User> = None;

        match query("queries/user/getOne.sql", &[&id]) {
            Some(rows) => {
                if !rows.is_empty() {
                    let row = rows.get(0);
                    user = Some(User{
                        id: row.get(0),
                        name: row.get(1),
                    });
                }
            }
            _ => {}
        }

        user
    }

    pub fn create(&mut self) {
        match insert("queries/user/insert.sql", &[&self.name]) {
            Ok(id) => {
                self.id = id;
            }
            _ => {}
        }
    }

    pub fn update(&mut self) -> Result<(), AppError> {
        execute("queries/user/update.sql", &[&self.id, &self.name])
    }

    pub fn delete(&mut self) -> Result<(), AppError> {
        execute("queries/user/delete.sql", &[&self.id])
    }
}
