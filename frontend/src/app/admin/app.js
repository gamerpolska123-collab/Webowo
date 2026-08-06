// ============================================
// Admin Panel v2.0
// ============================================

class WebowoAdmin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.token = localStorage.getItem('webowo_admin_token');
    this.user = null;
    this.apiUrl = '/api/v2'; // Relative path – nginx proxies to backend
  }

  async connectedCallback() {
    this.renderLayout();
    if (this.token) {
      await this.validateToken();
    } else {
      this.showLogin();
    }
  }

  renderLayout() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; min-height: 100vh; background: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
        .sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 260px; background: white; border-right: 1px solid #e2e8f0; padding: 1.5rem; }
        .logo { font-size: 1.5rem; font-weight: 800; color: #005ce6; margin-bottom: 2rem; }
        .nav { list-style: none; padding: 0; margin: 0; }
        .nav li { margin-bottom: 0.25rem; }
        .nav a { display: block; padding: 0.75rem 1rem; border-radius: 0.5rem; color: #475569; text-decoration: none; font-weight: 500; transition: all 0.2s; cursor: pointer; }
        .nav a:hover, .nav a.active { background: #f1f5f9; color: #005ce6; }
        .main { margin-left: 260px; padding: 2rem; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header h1 { margin: 0; font-size: 1.5rem; }
        .card { background: white; border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 1rem; }
        .btn { padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; background: #005ce6; color: white; font-weight: 500; cursor: pointer; }
        .btn-secondary { background: #e2e8f0; color: #475569; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e2e8f0; }
        th { font-weight: 600; color: #64748b; font-size: 0.875rem; }
        .login-box { max-width: 400px; margin: 10vh auto; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .login-box h2 { margin: 0 0 1.5rem; text-align: center; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; }
        .form-group input { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box; }
        .error { color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem; }
        .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
        .badge-published { background: #dcfce7; color: #166534; }
        .badge-draft { background: #fef3c7; color: #92400e; }
      </style>
      <div id="app"></div>
    `;
  }

  async validateToken() {
    try {
      const res = await fetch(`${this.apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      if (res.ok) {
        const { data } = await res.json();
        this.user = data;
        this.showDashboard();
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    }
  }

  showLogin() {
    const app = this.shadowRoot.getElementById('app');
    app.innerHTML = `
      <div class="login-box">
        <h2>🔐 Webowo Admin</h2>
        <form id="login-form">
          <div class="form-group">
            <label>Login</label>
            <input type="text" name="username" required autofocus>
          </div>
          <div class="form-group">
            <label>Hasło</label>
            <input type="password" name="password" required>
          </div>
          <button class="btn" type="submit" style="width:100%;">Zaloguj się</button>
          <div class="error" id="login-error"></div>
        </form>
      </div>
    `;
    app.querySelector('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      try {
        const res = await fetch(`${this.apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        const result = await res.json();
        if (result.success) {
          this.token = result.data.accessToken;
          localStorage.setItem('webowo_admin_token', this.token);
          this.user = result.data.user;
          this.showDashboard();
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        app.querySelector('#login-error').textContent = err.message || 'Błąd logowania';
      }
    });
  }

  showDashboard() {
    const app = this.shadowRoot.getElementById('app');
    app.innerHTML = `
      <div class="sidebar">
        <div class="logo">Webowo</div>
        <ul class="nav">
          <li><a class="active" data-page="dashboard">📊 Dashboard</a></li>
          <li><a data-page="content">📝 Treści</a></li>
          <li><a data-page="media">🖼️ Media</a></li>
          <li><a data-page="contacts">📨 Wiadomości</a></li>
          <li><a data-page="settings">⚙️ Ustawienia</a></li>
          <li><a data-page="backups">💾 Kopie zapasowe</a></li>
          <li><a id="logout">🚪 Wyloguj</a></li>
        </ul>
      </div>
      <div class="main" id="main-content">
        <div class="header"><h1>Dashboard</h1><span>Witaj, ${this.user?.username || 'admin'}</span></div>
        <div class="card">Witaj w panelu administracyjnym Webowo v2.0</div>
      </div>
    `;

    app.querySelectorAll('.nav a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        app.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        this.loadPage(e.target.dataset.page);
      });
    });

    app.querySelector('#logout').addEventListener('click', () => this.logout());
  }

  async loadPage(page) {
    const main = this.shadowRoot.getElementById('main-content');
    main.innerHTML = '<div class="card">Ładowanie...</div>';

    switch (page) {
      case 'dashboard':
        main.innerHTML = `<div class="header"><h1>Dashboard</h1></div><div class="card">Witaj w panelu administracyjnym Webowo v2.0</div>`;
        break;
      case 'content':
        await this.loadContent(main);
        break;
      case 'media':
        await this.loadMedia(main);
        break;
      case 'contacts':
        await this.loadContacts(main);
        break;
      case 'settings':
        await this.loadSettings(main);
        break;
      case 'backups':
        await this.loadBackups(main);
        break;
    }
  }

  async loadContent(main) {
    try {
      const res = await fetch(`${this.apiUrl}/content/pages`, { headers: { 'Authorization': `Bearer ${this.token}` } });
      const { data } = await res.json();
      main.innerHTML = `
        <div class="header"><h1>Treści</h1><button class="btn" id="new-page">+ Nowa strona</button></div>
        <div class="card">
          <table>
            <thead><tr><th>Tytuł</th><th>Slug</th><th>Status</th><th>Akcje</th></tr></thead>
            <tbody>
              ${data.map(p => `
                <tr>
                  <td>${p.title}</td>
                  <td>${p.slug}</td>
                  <td><span class="badge badge-${p.status}">${p.status}</span></td>
                  <td><button class="btn btn-secondary" onclick="alert('Edycja: ${p.title}')">Edytuj</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch {
      main.innerHTML = '<div class="card">Błąd ładowania treści</div>';
    }
  }

  async loadMedia(main) {
    try {
      const res = await fetch(`${this.apiUrl}/media`, { headers: { 'Authorization': `Bearer ${this.token}` } });
      const { data } = await res.json();
      main.innerHTML = `
        <div class="header"><h1>Media</h1></div>
        <div class="card">${data.length} plików w bibliotece</div>
      `;
    } catch {
      main.innerHTML = '<div class="card">Błąd ładowania mediów</div>';
    }
  }

  async loadContacts(main) {
    try {
      const res = await fetch(`${this.apiUrl}/contact`, { headers: { 'Authorization': `Bearer ${this.token}` } });
      const { data } = await res.json();
      main.innerHTML = `
        <div class="header"><h1>Wiadomości</h1></div>
        <div class="card">
          <table>
            <thead><tr><th>Od</th><th>Email</th><th>Temat</th><th>Status</th><th>Data</th></tr></thead>
            <tbody>
              ${data.map(c => `
                <tr>
                  <td>${c.name}</td>
                  <td>${c.email}</td>
                  <td>${c.subject || '-'}</td>
                  <td>${c.status}</td>
                  <td>${new Date(c.created_at).toLocaleDateString('pl-PL')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch {
      main.innerHTML = '<div class="card">Błąd ładowania wiadomości</div>';
    }
  }

  async loadSettings(main) {
    try {
      const res = await fetch(`${this.apiUrl}/settings`, { headers: { 'Authorization': `Bearer ${this.token}` } });
      const { data } = await res.json();
      main.innerHTML = `
        <div class="header"><h1>Ustawienia</h1></div>
        <div class="card">
          <table>
            <thead><tr><th>Klucz</th><th>Wartość</th><th>Kategoria</th></tr></thead>
            <tbody>
              ${data.map(s => `
                <tr><td>${s.key}</td><td>${s.value}</td><td>${s.category}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch {
      main.innerHTML = '<div class="card">Błąd ładowania ustawień</div>';
    }
  }

  async loadBackups(main) {
    try {
      const res = await fetch(`${this.apiUrl}/backups`, { headers: { 'Authorization': `Bearer ${this.token}` } });
      const { data } = await res.json();
      main.innerHTML = `
        <div class="header"><h1>Kopie zapasowe</h1><button class="btn" id="create-backup">+ Utwórz kopię</button></div>
        <div class="card">
          <table>
            <thead><tr><th>Nazwa</th><th>Rozmiar</th><th>Data</th></tr></thead>
            <tbody>
              ${data.map(b => `
                <tr><td>${b.name}</td><td>${(b.size / 1024).toFixed(1)} KB</td><td>${new Date(b.createdAt).toLocaleString('pl-PL')}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      main.querySelector('#create-backup').addEventListener('click', async () => {
        await fetch(`${this.apiUrl}/backups`, { method: 'POST', headers: { 'Authorization': `Bearer ${this.token}` } });
        this.loadPage('backups');
      });
    } catch {
      main.innerHTML = '<div class="card">Błąd ładowania kopii</div>';
    }
  }

  logout() {
    localStorage.removeItem('webowo_admin_token');
    this.token = null;
    this.user = null;
    this.showLogin();
  }
}
customElements.define('webowo-admin', WebowoAdmin);
