-- Vanaf nu staan ook de plekken, evenementen en voorzieningen in de database,
-- zodat ze in het beheer toegevoegd en gewijzigd kunnen worden.

-- De plekken worden opnieuw opgebouwd uit de code (er zijn nog geen reserveringen).
DROP TABLE IF EXISTS pitches;

CREATE TABLE pitches (
  id               TEXT PRIMARY KEY,
  soort            TEXT NOT NULL DEFAULT 'tent',
  weide            TEXT NOT NULL DEFAULT 'A',
  stroom           INTEGER NOT NULL DEFAULT 0,
  ondergrond       TEXT NOT NULL DEFAULT 'gras',
  vlak             TEXT NOT NULL DEFAULT 'vlak',
  water            INTEGER NOT NULL DEFAULT 0,
  rustig           INTEGER NOT NULL DEFAULT 0,
  schaduw          INTEGER NOT NULL DEFAULT 0,
  max_personen     INTEGER NOT NULL DEFAULT 4,
  afstand_sanitair INTEGER NOT NULL DEFAULT 60,
  prijs            INTEGER NOT NULL DEFAULT 25,
  status           TEXT NOT NULL DEFAULT 'open',
  hond             INTEGER NOT NULL DEFAULT 0,
  volgorde         INTEGER NOT NULL DEFAULT 0,
  aangemaakt       TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  dag        INTEGER NOT NULL DEFAULT 0,
  tijd       TEXT NOT NULL,
  titel_nl   TEXT NOT NULL,
  titel_en   TEXT NOT NULL DEFAULT '',
  titel_de   TEXT NOT NULL DEFAULT '',
  locatie    TEXT NOT NULL DEFAULT '',
  leeftijd   TEXT NOT NULL DEFAULT '',
  soort      TEXT NOT NULL DEFAULT 'dieren',
  actief     INTEGER NOT NULL DEFAULT 1,
  aangemaakt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS facilities (
  id         TEXT PRIMARY KEY,
  soort      TEXT NOT NULL DEFAULT 'eten',
  naam       TEXT NOT NULL,
  kort       TEXT NOT NULL DEFAULT '',
  x          INTEGER NOT NULL DEFAULT 1,
  y          INTEGER NOT NULL DEFAULT 1,
  breed      INTEGER NOT NULL DEFAULT 1,
  hoog       INTEGER NOT NULL DEFAULT 1,
  open       INTEGER NOT NULL DEFAULT 1,
  volgorde   INTEGER NOT NULL DEFAULT 0,
  aangemaakt TEXT NOT NULL
);

-- Eén foto per plek op de site (hero, kippen, zwembad, …).
CREATE TABLE IF NOT EXISTS media (
  sleutel      TEXT PRIMARY KEY,
  bestandsnaam TEXT NOT NULL,
  type         TEXT NOT NULL,
  grootte      INTEGER NOT NULL,
  opslag_sleutel TEXT NOT NULL,
  aangemaakt   TEXT NOT NULL
);
