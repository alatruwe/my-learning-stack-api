CREATE TABLE profiles (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tech_id INTEGER REFERENCES tech_list(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);