UPDATE Score 
SET id_game = $2, id_user = $3, spotify_track_id = $4, timestamp = $5, is_correct = $6, reaction_time_ms = $7 
WHERE id = $1;
