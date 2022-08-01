CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	author text,
	url TEXT NOT NULL,
	title TEXT NOT NULL,
	likes INT
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Dan Abramov', 'https://example.com', 'On let vs const', 0);

INSERT INTO blogs (author, url, title) VALUES ('Laurenz Albe', 'https://example.com', 'Gaps in sequences in PostgresSQL');

SELECT * from blogs;
