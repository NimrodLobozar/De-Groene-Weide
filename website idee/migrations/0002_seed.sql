-- Startgegevens: één beheerder en de standaardinstellingen.
-- Wachtwoord van de demo-beheerder: weide (PBKDF2-SHA256, 100.000 rondes).

INSERT INTO admins (email, naam, rol, salt, hash, iteraties, aangemaakt)
VALUES (
  'bert@degroeneweide.nl',
  'Bert',
  'eigenaar',
  '70ef2a7a009c2e3245f70625f06d2bb3',
  '63fd060451bc063c1a52b2aad5a293585569372ff814523ceb0f42dd9897717c',
  100000,
  '2026-01-01T00:00:00.000Z'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO settings (sleutel, waarde) VALUES
  ('aankondiging_aan', '1'),
  ('aankondiging', 'Zwembad gaat dinsdag dicht voor onderhoud. Douches blijven open.'),
  ('plekmatch_aan', '1'),
  ('receptie_email', 'receptie@degroeneweide.danielsturkenboom.nl'),
  ('boekingen_email', 'boekingen@degroeneweide.danielsturkenboom.nl')
ON CONFLICT (sleutel) DO NOTHING;
