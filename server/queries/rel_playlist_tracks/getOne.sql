SELECT t.id, t.spotify_id, t.title, t.length, t.id_genre, g.name, r.track_index
FROM rel_playlist_tracks r
         INNER JOIN track t on r.id_track = t.id
         INNER JOIN genre g on t.id_genre = g.id
WHERE id_playlist = $1
  AND id_track = $2
LIMIT 1
