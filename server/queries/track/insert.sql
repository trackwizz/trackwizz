INSERT INTO Track (spotify_id, title, length, id_genre) VALUES ($1, $2, $3, $4) RETURNING id;
