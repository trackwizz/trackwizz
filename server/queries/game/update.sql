UPDATE Game SET start_date = $2, is_ended = $3, score = $4, title = $5, questions_number = $6, is_public = $7, mode = $8 WHERE id = $1;