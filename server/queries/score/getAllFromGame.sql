SELECT id, id_game, id_user, spotify_track_id, timestamp, is_correct, reaction_time_ms
FROM Score
WHERE id_game = $1
ORDER BY id;