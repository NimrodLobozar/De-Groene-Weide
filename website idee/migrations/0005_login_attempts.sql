CREATE TABLE IF NOT EXISTS login_attempts (
  sleutel TEXT PRIMARY KEY,
  aantal INTEGER NOT NULL DEFAULT 0,
  venster_start TEXT NOT NULL,
  geblokkeerd_tot TEXT NOT NULL DEFAULT ''
);
