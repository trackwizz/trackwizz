INSERT INTO rel_playlist_tracks (id_track, id_playlist, track_index)
SELECT $1, $2, COUNT(*) FROM rel_playlist_tracks WHERE id_playlist = 1
RETURNING track_index;
