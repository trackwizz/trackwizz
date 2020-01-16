CREATE TABLE IF NOT EXISTS Game (
    id SERIAL PRIMARY KEY,
    start_date BIGINT NOT NULL,
    is_ended BOOLEAN NOT NULL,
    score INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    questions_number INT NOT NULL,
    is_public BOOLEAN NOT NULL,
    mode SMALLINT NOT NULL
) WITHOUT OIDS;