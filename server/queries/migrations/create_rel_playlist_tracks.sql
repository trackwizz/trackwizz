CREATE TABLE IF NOT EXISTS Rel_playlist_tracks (
    id_track    INT NOT NULL,
    id_playlist INT NOT NULL,
    track_index INT NOT NULL,
    CONSTRAINT rel_playlist_tracks_PK PRIMARY KEY (id_track, id_playlist),
    CONSTRAINT rel_playlist_tracks_track_FK FOREIGN KEY (id_track) REFERENCES Track (id),
    CONSTRAINT rel_playlist_tracks_playlist_FK FOREIGN KEY (id_Playlist) REFERENCES Playlist (id)
) WITHOUT OIDS;
