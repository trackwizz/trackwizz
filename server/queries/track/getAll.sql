SELECT T.id, T.spotify_id, T.title, T.length, G.id, G.name as genre_name
FROM Track T INNER JOIN Genre G ON T.id_genre = G.id
order by T.id;
