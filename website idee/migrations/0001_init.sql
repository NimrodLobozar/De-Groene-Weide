-- De Groene Weide — database (Cloudflare D1 / SQLite)
-- Reserveringen, plekken, beheerders, sessies, berichten en een mailwachtrij.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS reservations (
  nummer        TEXT PRIMARY KEY,
  pitch         TEXT NOT NULL,
  van           TEXT NOT NULL,
  tot           TEXT NOT NULL,
  volwassenen   INTEGER NOT NULL DEFAULT 2,
  kinderen      INTEGER NOT NULL DEFAULT 0,
  naam          TEXT NOT NULL,
  email         TEXT NOT NULL,
  telefoon      TEXT NOT NULL DEFAULT '',
  adres         TEXT NOT NULL DEFAULT '',
  postcode      TEXT NOT NULL DEFAULT '',
  plaats        TEXT NOT NULL DEFAULT '',
  land          TEXT NOT NULL DEFAULT 'Nederland',
  opmerking     TEXT NOT NULL DEFAULT '',
  wensen        TEXT NOT NULL DEFAULT '',
  bedrag        INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'nieuw',
  hond          INTEGER NOT NULL DEFAULT 0,
  token         TEXT NOT NULL,
  taal          TEXT NOT NULL DEFAULT 'nl',
  aangemaakt    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_res_pitch ON reservations (pitch, van, tot);
CREATE INDEX IF NOT EXISTS idx_res_email ON reservations (email);
CREATE INDEX IF NOT EXISTS idx_res_van ON reservations (van);

CREATE TABLE IF NOT EXISTS pitches (
  id      TEXT PRIMARY KEY,
  prijs   INTEGER NOT NULL,
  status  TEXT NOT NULL DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS admins (
  email      TEXT PRIMARY KEY,
  naam       TEXT NOT NULL,
  rol        TEXT NOT NULL DEFAULT 'eigenaar',
  salt       TEXT NOT NULL,
  hash       TEXT NOT NULL,
  iteraties  INTEGER NOT NULL DEFAULT 100000,
  aangemaakt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  email      TEXT NOT NULL,
  verloopt   TEXT NOT NULL,
  aangemaakt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sess_verloopt ON sessions (verloopt);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  naam       TEXT NOT NULL,
  email      TEXT NOT NULL,
  onderwerp  TEXT NOT NULL,
  bericht    TEXT NOT NULL,
  gelezen    INTEGER NOT NULL DEFAULT 0,
  aangemaakt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscribers (
  email      TEXT PRIMARY KEY,
  taal       TEXT NOT NULL DEFAULT 'nl',
  aangemaakt TEXT NOT NULL
);

-- Alles wat de site wil versturen. Verzonden mails blijven hier als logboek staan;
-- mislukte of nog niet te verzenden mails kunnen opnieuw worden aangeboden.
CREATE TABLE IF NOT EXISTS outbox (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  aan        TEXT NOT NULL,
  van        TEXT NOT NULL,
  onderwerp  TEXT NOT NULL,
  tekst      TEXT NOT NULL,
  html       TEXT NOT NULL,
  soort      TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'wacht',
  fout       TEXT,
  pogingen   INTEGER NOT NULL DEFAULT 0,
  aangemaakt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  sleutel TEXT PRIMARY KEY,
  waarde  TEXT NOT NULL
);
