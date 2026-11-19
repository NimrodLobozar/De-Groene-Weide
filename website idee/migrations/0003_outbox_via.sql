-- Onthouden via welke weg een mail de deur uit ging.
ALTER TABLE outbox ADD COLUMN via TEXT;
