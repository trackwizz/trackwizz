CREATE TABLE IF NOT EXISTS Track (
    id       SERIAL PRIMARY KEY,
    spotify_id VARCHAR(50) UNIQUE,
    title    VARCHAR(50) NOT NULL,
    length   INT         NOT NULL,
    id_genre INT         NOT NULL,
    CONSTRAINT Track_Genre_FK FOREIGN KEY (id_genre) REFERENCES Genre (id)
) WITHOUT OIDS;
