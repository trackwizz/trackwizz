INSERT INTO Score (id_game, id_user, spotify_track_id, timestamp, is_correct, reaction_time_ms)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id;
