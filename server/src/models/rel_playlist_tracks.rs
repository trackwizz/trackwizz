use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase", deserialize = "camelCase"))]
pub struct RelPlaylistTracks {
    #[serde(default)]
    #[serde(skip_serializing)]
    pub id_track: i32,
    #[serde(default)]
    pub track_index: i32,
}
