-- ============================================
-- Webowo v3.0 – Seed Data
-- ============================================

-- Admin user (password hash injected by server.js)
INSERT OR IGNORE INTO users (username, email, password_hash, role, is_active) VALUES ('admin', 'admin@webowo.pl', '$SEED_ADMIN_HASH$', 'admin', 1);

-- Default page
INSERT OR IGNORE INTO pages (slug, title, meta_description, is_active) VALUES ('home', 'Strona główna', 'Profesjonalne strony internetowe, sklepy online i aplikacje webowe.', 1);

-- Default settings
INSERT OR IGNORE INTO settings (key, value, is_public) VALUES ('site_title', 'Matys WebDev', 1);
INSERT OR IGNORE INTO settings (key, value, is_public) VALUES ('site_description', 'Profesjonalne strony internetowe, sklepy online i aplikacje webowe.', 1);
INSERT OR IGNORE INTO settings (key, value, is_public) VALUES ('theme_color', '#005ce6', 1);
INSERT OR IGNORE INTO settings (key, value, is_public) VALUES ('contact_email', 'kontakt@matys.net.pl', 1);
INSERT OR IGNORE INTO settings (key, value, is_public) VALUES ('analytics_enabled', 'true', 0);
