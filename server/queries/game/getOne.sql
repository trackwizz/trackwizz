SELECT id, start_date, is_ended, score, title, tracks_number, is_public, mode FROM Game WHERE id = $1;