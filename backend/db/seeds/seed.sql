-- Legacy seed file
INSERT INTO users (username, email, password_hash, role, is_active) VALUES
('admin', 'admin@matys.net.pl', '$SEED_ADMIN_HASH$', 'admin', 1);
