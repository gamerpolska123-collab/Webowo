// ============================================
// Webowo v3.0 – Admin Panel App
// ============================================

import { initRouter } from './router.js';
import { showToast } from '../components/ui/toast.js';

class AdminApp {
  constructor() {
    this.root = document.getElementById('admin-root');
    this.token = localStorage.getItem('admin_token');
    this.user = null;
    this.currentRoute = 'dashboard';
  }

  async init() {
    if (!this.root) return;

    if (!this.token) {
      this.renderLogin();
      return;
    }

    try {
      await this.fetchUser();
      this.renderLayout();
      initRouter();
    } catch {
      localStorage.removeItem('admin_token');
      this.renderLogin();
    }
  }

  async fetchUser() {
    const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    this.user = await res.json();
  }

  renderLogin() {
    this.root.innerHTML = `
      <style>
        .admin-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 2rem;
        }
        .admin-login-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 1rem;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .admin-login-logo {
          text-align: center;
          margin-bottom: 2rem;
        }
        .admin-login-logo h1 {
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
        }
        .admin-login-logo p {
          color: #94a3b8;
          margin: 0.5rem 0 0;
          font-size: 0.875rem;
        }
        .admin-login-field {
          margin-bottom: 1rem;
        }
        .admin-login-field label {
          display: block;
          color: #cbd5e1;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .admin-login-field input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.5rem;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .admin-login-field input:focus {
          border-color: #005ce6;
        }
        .admin-login-field input::placeholder {
          color: #64748b;
        }
        .admin-login-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          min-height: 1.25rem;
        }
        .admin-login-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #005ce6, #0049b8);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 92, 230, 0.4);
        }
        .admin-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .admin-login-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: #64748b;
          font-size: 0.75rem;
        }
      </style>
      <div class="admin-login">
        <div class="admin-login-card">
          <div class="admin-login-logo">
            <h1>⚡ Webowo Admin</h1>
            <p>Panel zarządzania stroną</p>
          </div>
          <form id="admin-login-form">
            <div class="admin-login-field">
              <label for="username">Nazwa użytkownika</label>
              <input type="text" id="username" name="username" required placeholder="admin" autocomplete="username">
            </div>
            <div class="admin-login-field">
              <label for="password">Hasło</label>
              <input type="password" id="password" name="password" required placeholder="••••••••" autocomplete="current-password">
            </div>
            <div class="admin-login-error" id="login-error"></div>
            <button type="submit" class="admin-login-btn" id="login-btn">Zaloguj się</button>
          </form>
          <div class="admin-login-footer">Webowo v3.0</div>
        </div>
      </div>
    `;

    const form = document.getElementById('admin-login-form');
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Logowanie...';

      const formData = new FormData(form);
      const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.get('username'),
            password: formData.get('password')
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Błąd logowania');
        }

        localStorage.setItem('admin_token', data.data.accessToken);
        localStorage.setItem('admin_refresh', data.data.refreshToken);
        window.location.reload();
      } catch (err) {
        errorEl.textContent = err.message;
        btn.disabled = false;
        btn.textContent = 'Zaloguj się';
      }
    });
  }

  renderLayout() {
    this.root.innerHTML = `
      <style>
        .admin-app {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: 100vh;
          background: #0f172a;
          color: #e2e8f0;
          font-family: var(--font-sans, system-ui, sans-serif);
        }
        .admin-sidebar {
          background: #1e293b;
          border-right: 1px solid #334155;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .admin-sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #334155;
        }
        .admin-sidebar-header h1 {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .admin-sidebar-header p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0.25rem 0 0;
        }
        .admin-nav {
          flex: 1;
          padding: 1rem 0;
        }
        .admin-nav-group {
          margin-bottom: 1rem;
        }
        .admin-nav-label {
          padding: 0 1.5rem;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1.5rem;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        .admin-nav-link:hover {
          color: white;
          background: rgba(255,255,255,0.05);
        }
        .admin-nav-link.is-active {
          color: #005ce6;
          background: rgba(0, 92, 230, 0.1);
          border-left-color: #005ce6;
        }
        .admin-sidebar-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #334155;
        }
        .admin-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .admin-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #005ce6, #00d4aa);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.75rem;
        }
        .admin-user-info {
          flex: 1;
          min-width: 0;
        }
        .admin-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .admin-user-role {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: capitalize;
        }
        .admin-logout {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.375rem;
          transition: color 0.2s;
        }
        .admin-logout:hover {
          color: #ef4444;
        }
        .admin-main {
          padding: 2rem;
          overflow-y: auto;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .admin-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }
        .admin-header-actions {
          display: flex;
          gap: 0.75rem;
        }
        .admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .admin-btn-primary {
          background: #005ce6;
          color: white;
        }
        .admin-btn-primary:hover {
          background: #0049b8;
        }
        .admin-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .admin-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin: 0 0 1rem;
        }
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .admin-stat {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 0.75rem;
          padding: 1.25rem;
        }
        .admin-stat-value {
          font-size: 1.875rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }
        .admin-stat-label {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          border-bottom: 1px solid #334155;
        }
        .admin-table td {
          padding: 0.875rem 1rem;
          font-size: 0.875rem;
          color: #cbd5e1;
          border-bottom: 1px solid #1e293b;
        }
        .admin-table tr:hover td {
          background: rgba(255,255,255,0.02);
        }
        .admin-badge {
          display: inline-flex;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .admin-badge-new { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .admin-badge-read { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .admin-badge-replied { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .admin-badge-archived { background: rgba(100, 116, 139, 0.2); color: #64748b; }
        @media (max-width: 1024px) {
          .admin-app { grid-template-columns: 1fr; }
          .admin-sidebar { display: none; }
          .admin-stats { grid-template-columns: repeat(2, 1fr); }
        }
      </style>
      <div class="admin-app">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">
            <h1>⚡ Webowo</h1>
            <p>Panel administracyjny</p>
          </div>
          <nav class="admin-nav">
            <div class="admin-nav-group">
              <div class="admin-nav-label">Główne</div>
              <a href="#dashboard" class="admin-nav-link is-active" data-route="dashboard">📊 Dashboard</a>
              <a href="#content" class="admin-nav-link" data-route="content">📝 Treści</a>
              <a href="#media" class="admin-nav-link" data-route="media">🖼️ Media</a>
            </div>
            <div class="admin-nav-group">
              <div class="admin-nav-label">Komunikacja</div>
              <a href="#messages" class="admin-nav-link" data-route="messages">📨 Wiadomości</a>
              <a href="#settings" class="admin-nav-link" data-route="settings">⚙️ Ustawienia</a>
            </div>
            <div class="admin-nav-group">
              <div class="admin-nav-label">System</div>
              <a href="#backups" class="admin-nav-link" data-route="backups">💾 Kopie zapasowe</a>
              <a href="#users" class="admin-nav-link" data-route="users">👥 Użytkownicy</a>
            </div>
          </nav>
          <div class="admin-sidebar-footer">
            <div class="admin-user">
              <div class="admin-user-avatar">A</div>
              <div class="admin-user-info">
                <div class="admin-user-name">${this.user?.data?.username || 'Admin'}</div>
                <div class="admin-user-role">${this.user?.data?.role || 'admin'}</div>
              </div>
              <button class="admin-logout" id="admin-logout" title="Wyloguj">🚪</button>
            </div>
          </div>
        </aside>
        <main class="admin-main" id="admin-content">
          <!-- Content rendered by router -->
        </main>
      </div>
    `;

    document.getElementById('admin-logout')?.addEventListener('click', () => {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh');
      window.location.reload();
    });

    this.renderDashboard();
  }

  renderDashboard() {
    const content = document.getElementById('admin-content');
    if (!content) return;

    content.innerHTML = `
      <div class="admin-header">
        <h2>Dashboard</h2>
        <div class="admin-header-actions">
          <button class="admin-btn admin-btn-primary" onclick="window.open('/','_blank')">Zobacz stronę ↗</button>
        </div>
      </div>
      <div class="admin-stats">
        <div class="admin-stat">
          <div class="admin-stat-value">--</div>
          <div class="admin-stat-label">Wiadomości</div>
        </div>
        <div class="admin-stat">
          <div class="admin-stat-value">--</div>
          <div class="admin-stat-label">Podstrony</div>
        </div>
        <div class="admin-stat">
          <div class="admin-stat-value">--</div>
          <div class="admin-stat-label">Media</div>
        </div>
        <div class="admin-stat">
          <div class="admin-stat-value">--</div>
          <div class="admin-stat-label">Użytkownicy</div>
        </div>
      </div>
      <div class="admin-card">
        <h3 class="admin-card-title">Ostatnie wiadomości</h3>
        <p style="color:#64748b;font-size:0.875rem;">Ładowanie...</p>
      </div>
    `;

    this.loadDashboardData();
  }

  async loadDashboardData() {
    const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
    const headers = { Authorization: `Bearer ${this.token}` };

    try {
      const [contactsRes, pagesRes, mediaRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/contact?page=1&limit=5`, { headers }),
        fetch(`${API_BASE}/content/pages`, { headers }),
        fetch(`${API_BASE}/media?page=1&limit=1`, { headers }),
        fetch(`${API_BASE}/settings`, { headers })
      ]);

      const contacts = contactsRes.ok ? await contactsRes.json() : { data: [] };
      const pages = pagesRes.ok ? await pagesRes.json() : { data: [] };
      const media = mediaRes.ok ? await mediaRes.json() : { data: { total: 0 } };

      const stats = document.querySelectorAll('.admin-stat-value');
      if (stats[0]) stats[0].textContent = contacts.meta?.total || contacts.data?.length || 0;
      if (stats[1]) stats[1].textContent = pages.data?.length || 0;
      if (stats[2]) stats[2].textContent = media.data?.total || 0;
      if (stats[3]) stats[3].textContent = '1';

      // Render messages table
      const card = document.querySelector('.admin-card');
      if (card && contacts.data?.length > 0) {
        card.innerHTML = `
          <h3 class="admin-card-title">Ostatnie wiadomości</h3>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nadawca</th>
                <th>Temat</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              ${contacts.data.map(c => `
                <tr>
                  <td><strong>${c.name}</strong><br><span style="color:#64748b;font-size:0.75rem;">${c.email}</span></td>
                  <td>${c.subject}</td>
                  <td><span class="admin-badge admin-badge-${c.status}">${c.status}</span></td>
                  <td style="color:#64748b;font-size:0.75rem;">${new Date(c.created_at).toLocaleDateString('pl-PL')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    } catch (err) {
      console.error('[Admin] Dashboard data error:', err);
    }
  }
}

const app = new AdminApp();
app.init();

export { AdminApp };
