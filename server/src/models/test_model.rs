use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct TestObj {
    #[serde(default)]
    pub id: u32,

    pub name: String,
}
