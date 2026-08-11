-- Seed 001 — Demo Data
INSERT INTO users (username, email, password_hash, role, is_active) VALUES
('admin', 'admin@matys.net.pl', '$SEED_ADMIN_HASH$', 'admin', 1);

INSERT INTO pages (slug, title, meta, status, published_at) VALUES
('home', 'Matys WebDev | Tworzenie Stron Internetowych', '{"description":"Profesjonalne strony internetowe, sklepy online i aplikacje webowe."}', 'published', datetime('now'));

INSERT INTO sections (page_id, type, order_index, data, is_active) VALUES
(1, 'hero', 1, '{"title":"Tworzę nowoczesne strony, które","subtitle":"Profesjonalne strony internetowe, sklepy online i aplikacje webowe.","badge":"Dostępny do nowych projektów","ctaPrimary":{"label":"Bezpłatna wycena","href":"#contact"},"ctaSecondary":{"label":"Zobacz realizacje","href":"#portfolio"}}', 1),
(1, 'about', 2, '{"title":"O mnie","text":"Jestem Patryk Matys — full-stack developer z pasją do tworzenia nowoczesnych stron internetowych.","stats":[{"label":"Zrealizowanych projektów","value":"50+"},{"label":"Zadowolonych klientów","value":"100%"},{"label":"Czas odpowiedzi","value":"24h"}]}', 1),
(1, 'services', 3, '{"title":"Usługi","items":[{"title":"Strony WWW","desc":"Nowoczesne strony wizytówki i landing page"},{"title":"Sklepy Online","desc":"E-commerce z płatnościami online"},{"title":"Aplikacje Webowe","desc":"Zaawansowane aplikacje SPA i PWA"},{"title":"Optymalizacja","desc":"SEO, performance, dostępność"}]}', 1),
(1, 'portfolio', 4, '{"title":"Portfolio","items":[]}', 1),
(1, 'process', 5, '{"title":"Proces współpracy","steps":[{"title":"Konsultacja","desc":"Omawiamy Twoje potrzeby i cele."},{"title":"Projekt","desc":"Tworzę mockupy i prototypy."},{"title":"Development","desc":"Kodowanie zgodnie z najlepszymi praktykami."},{"title":"Wdrożenie","desc":"Deploy, testy, szkolenie."}]}', 1),
(1, 'pricing', 6, '{"title":"Cennik","plans":[{"name":"Starter","price":"999","period":"PLN","features":["1 strona","Responsywność","Podstawowe SEO","Kontakt formularz"],"popular":false},{"name":"Professional","price":"2499","period":"PLN","features":["Do 5 podstron","CMS","Zaawansowane SEO","Analityka","Wsparcie 30 dni"],"popular":true},{"name":"Enterprise","price":"Custom","period":"","features":["Dedykowane rozwiązanie","Priorytetowe wsparcie","SLA","Dedykowany opiekun"],"popular":false}]}', 1),
(1, 'faq', 7, '{"title":"FAQ","items":[{"q":"Ile trwa realizacja strony?","a":"Standardowy projekt trwa 2-4 tygodnie."},{"q":"Czy strona będzie responsywna?","a":"Tak, wszystkie strony są w pełni responsywne."},{"q":"Czy oferujesz wsparcie po wdrożeniu?","a":"Tak, oferuję pakiety wsparcia technicznego."},{"q":"Jakie technologie używasz?","a":"Nowoczesny stack: HTML5, CSS3, JS, Node.js, SQLite."}]}', 1),
(1, 'contact', 8, '{"title":"Kontakt","email":"kontakt@matys.net.pl","phone":"+48 123 456 789","social":{"github":"https://github.com/gamerpolska123-collab","linkedin":"https://linkedin.com/in/patryk-matys"}}', 1),
(1, 'footer', 9, '{"brand":"Matys WebDev","tagline":"Tworzę strony, które działają.","copyright":"© 2026 Matys WebDev. Wszelkie prawa zastrzeżone."}', 1);

INSERT INTO settings (key, value, category, is_public) VALUES
('site_title', 'Matys WebDev', 'general', 1),
('site_description', 'Profesjonalne strony internetowe', 'seo', 1),
('contact_email', 'kontakt@matys.net.pl', 'general', 1),
('contact_phone', '+48 123 456 789', 'general', 1),
('primary_color', '#005ce6', 'theme', 1),
('accent_color', '#00d4aa', 'theme', 1),
('auto_backup', 'true', 'general', 0),
('backup_retention_days', '30', 'general', 0);
