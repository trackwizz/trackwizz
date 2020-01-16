CREATE TABLE IF NOT EXISTS Score (
    id                  SERIAL PRIMARY KEY,
    id_game             INT       NOT NULL,
    id_user             INT       NOT NULL,
    spotify_track_id    VARCHAR(50) UNIQUE,
    timestamp           BIGINT    NOT NULL,
    is_correct          BOOLEAN   NOT NULL,
    reaction_time       INT       NOT NULL,
    CONSTRAINT Score_Game_FK FOREIGN KEY (id_game) REFERENCES Game (id),
    CONSTRAINT Score_User_FK FOREIGN KEY (id_user) REFERENCES Person (id)
) WITHOUT OIDS;