DROP TYPE IF EXISTS mood;
CREATE TYPE mood AS ENUM (
  'smile',
  'meh',
  'frown'
);

CREATE TABLE entries (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMPTZ DEFAULT now() NOT NULL,
  current_mood mood NOT NULL,
  tech_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  learning_notes TEXT,
  struggling_notes TEXT
);