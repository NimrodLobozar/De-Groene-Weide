-- Eigen teksten en meldingen.
--
-- De site begint met de teksten uit src/i18n (Nederlands, Engels, Duits). Wat de
-- eigenaar zelf aanpast staat hier: één rij per tekst, met de Nederlandse bron
-- en de vertalingen die de Worker via Lara heeft gemaakt. Zo hoeft een tekst
-- maar één keer vertaald te worden en kan de site hem meteen tonen.
--
-- Wordt een rij weggegooid, dan valt de site terug op de tekst uit de code.

CREATE TABLE IF NOT EXISTS texts (
  sleutel    TEXT PRIMARY KEY,
  nl         TEXT NOT NULL,
  en         TEXT NOT NULL DEFAULT '',
  de         TEXT NOT NULL DEFAULT '',
  vertaald   TEXT NOT NULL DEFAULT '',
  bijgewerkt TEXT NOT NULL
);

-- Meldingen bovenaan de site, zoals "het zwembad is dicht".
-- De site toont ze in volgorde van `volgorde` en alleen binnen van/tot.
CREATE TABLE IF NOT EXISTS notices (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nl         TEXT NOT NULL,
  en         TEXT NOT NULL DEFAULT '',
  de         TEXT NOT NULL DEFAULT '',
  soort      TEXT NOT NULL DEFAULT 'info',
  actief     INTEGER NOT NULL DEFAULT 1,
  van        TEXT NOT NULL DEFAULT '',
  tot        TEXT NOT NULL DEFAULT '',
  volgorde   INTEGER NOT NULL DEFAULT 0,
  aangemaakt TEXT NOT NULL,
  bijgewerkt TEXT NOT NULL DEFAULT ''
);

-- De aankondiging die al in de instellingen stond, verhuist naar de meldingen.
INSERT INTO notices (nl, en, de, soort, actief, van, tot, volgorde, aangemaakt, bijgewerkt)
SELECT
  TRIM(s.waarde),
  '',
  '',
  'mededeling',
  CASE WHEN COALESCE(a.waarde, '1') = '1' THEN 1 ELSE 0 END,
  '',
  '',
  0,
  datetime('now'),
  datetime('now')
FROM settings s
LEFT JOIN settings a ON a.sleutel = 'aankondiging_aan'
WHERE s.sleutel = 'aankondiging'
  AND TRIM(s.waarde) <> ''
  AND (SELECT COUNT(*) FROM notices) = 0;
