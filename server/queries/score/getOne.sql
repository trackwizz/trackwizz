SELECT id, id_game, id_user, spotify_track_id, timestamp, is_correct, reaction_time FROM Score WHERE id = $1;
