-- Seed Data
INSERT INTO users (username, email, password_hash, role, is_active) VALUES
  ('admin', 'admin@webowo.pl', '$SEED_ADMIN_HASH$', 'admin', 1);

INSERT INTO settings (key, value, type, is_public) VALUES
  ('site_title', 'Matys WebDev | Tworzenie Stron Internetowych', 'string', 1),
  ('site_description', 'Profesjonalne strony internetowe, sklepy online i aplikacje webowe.', 'string', 1),
  ('contact_email', 'kontakt@matys.net.pl', 'string', 1),
  ('contact_phone', '+48 123 456 789', 'string', 1);

INSERT INTO pages (slug, title, meta_title, meta_description, is_published) VALUES
  ('home', 'Strona główna', 'Matys WebDev', 'Tworzenie stron internetowych', 1);
