CREATE TABLE IF NOT EXISTS Track (
    id       SERIAL PRIMARY KEY,
    service  VARCHAR(50) NOT NULL,
    title    VARCHAR(50) NOT NULL,
    length   INT         NOT NULL,
    id_genre INT         NOT NULL,
    CONSTRAINT Track_Genre_FK FOREIGN KEY (id_genre) REFERENCES Genre (id)
) WITHOUT OIDS;
