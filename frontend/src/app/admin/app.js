// ============================================
// Webowo v3.1 – Admin Panel App
// ============================================

const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';

// ============ STATE ============
let currentView = 'dashboard';
let authToken = localStorage.getItem('webowo_admin_token');
let currentUser = null;
let pageData = { sections: [] };

// ============ API CLIENT ============
async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      logout();
      throw new Error('Sesja wygasła. Zaloguj się ponownie.');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    showToast(err.message, 'error');
    throw err;
  }
}

// ============ TOAST SYSTEM ============
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ============ AUTH ============
async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Błąd logowania');

  authToken = data.data.accessToken;
  localStorage.setItem('webowo_admin_token', authToken);
  currentUser = data.data.user;
  showToast('Zalogowano pomyślnie', 'success');
  renderApp();
}

async function logout() {
  try {
    await api('/auth/logout', { method: 'POST' });
  } catch (e) {}
  authToken = null;
  currentUser = null;
  localStorage.removeItem('webowo_admin_token');
  showToast('Wylogowano', 'success');
  renderApp();
}

async function fetchMe() {
  try {
    const data = await api('/auth/me');
    currentUser = data.data;
    return true;
  } catch {
    return false;
  }
}

// ============ HELPERS ============
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============ LOGIN VIEW ============
function renderLogin() {
  const app = document.getElementById('admin-app');
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-box">
        <div class="brand">
          <div class="brand-icon">M</div>
          <div>
            <div style="font-weight:800;font-size:1.125rem;">Webowo Admin</div>
            <div class="subtitle">v3.1</div>
          </div>
        </div>
        <h1>Witaj ponownie</h1>
        <p class="subtitle">Zaloguj się do panelu administracyjnego</p>
        <form id="login-form">
          <div class="form-group">
            <label>Nazwa użytkownika</label>
            <input type="text" name="username" required placeholder="admin" autocomplete="username">
          </div>
          <div class="form-group">
            <label>Hasło</label>
            <input type="password" name="password" required placeholder="••••••••" autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary">Zaloguj się</button>
        </form>
      </div>
    </div>
  `;

  app.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Logowanie...';
    try {
      const fd = new FormData(e.target);
      await login(fd.get('username'), fd.get('password'));
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Zaloguj się';
    }
  });
}

// ============ LAYOUT ============
function renderLayout(content) {
  const app = document.getElementById('admin-app');
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    { id: 'content', label: 'Treści', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
    { id: 'messages', label: 'Wiadomości', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'media', label: 'Media', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' },
    { id: 'settings', label: 'Ustawienia', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
    { id: 'backups', label: 'Kopie zapasowe', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' },
    { id: 'users', label: 'Użytkownicy', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  ];

  app.innerHTML = `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="brand-icon">M</div>
          <div>
            <div class="brand-text">Webowo</div>
            <div class="brand-sub">Panel administracyjny</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-section-title">Główne</div>
            ${navItems.slice(0, 4).map(item => `
              <button class="nav-item ${currentView === item.id ? 'active' : ''}" data-view="${item.id}">
                ${item.icon}
                <span>${item.label}</span>
              </button>
            `).join('')}
          </div>
          <div class="nav-section">
            <div class="nav-section-title">System</div>
            ${navItems.slice(4).map(item => `
              <button class="nav-item ${currentView === item.id ? 'active' : ''}" data-view="${item.id}">
                ${item.icon}
                <span>${item.label}</span>
              </button>
            `).join('')}
          </div>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">${currentUser?.username?.charAt(0).toUpperCase() || 'A'}</div>
            <div>
              <div class="user-name">${escapeHtml(currentUser?.username || 'Admin')}</div>
              <div class="user-role">${currentUser?.role || 'admin'}</div>
            </div>
          </div>
          <button class="nav-item" id="logout-btn" style="margin-top:0.5rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Wyloguj</span>
          </button>
        </div>
      </aside>
      <main class="main-content">
        ${content}
      </main>
    </div>
  `;

  // Event listeners
  app.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      renderApp();
    });
  });

  app.querySelector('#logout-btn').addEventListener('click', logout);
}

// ============ DASHBOARD VIEW ============
async function renderDashboard() {
  let stats = { pages: 0, messages: 0, media: 0, users: 0 };
  let recentMessages = [];

  try {
    const [pagesRes, messagesRes, mediaRes, usersRes] = await Promise.all([
      api('/content/pages').catch(() => ({ data: [] })),
      api('/contact?page=1&limit=5').catch(() => ({ data: { items: [] } })),
      api('/media?page=1&limit=1').catch(() => ({ data: { meta: { total: 0 } } })),
      api('/settings').catch(() => ({ data: [] }))
    ]);
    stats.pages = pagesRes.data?.length || 0;
    stats.messages = messagesRes.data?.meta?.total || 0;
    stats.media = mediaRes.data?.meta?.total || 0;
    stats.users = 1; // Simplified
    recentMessages = messagesRes.data?.items || [];
  } catch (e) {}

  renderLayout(`
    <div class="page-header">
      <h1>Dashboard</h1>
      <div class="actions">
        <button class="btn btn-secondary" onclick="window.open('/', '_blank')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Zobacz stronę
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.pages}</div>
        <div class="stat-label">Strony</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.messages}</div>
        <div class="stat-label">Wiadomości</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.media}</div>
        <div class="stat-label">Pliki</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.users}</div>
        <div class="stat-label">Użytkownicy</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Ostatnie wiadomości</div>
        <button class="btn btn-sm btn-secondary" data-view="messages">Zobacz wszystkie</button>
      </div>
      ${recentMessages.length === 0 ? `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <p>Brak wiadomości</p>
        </div>
      ` : `
        <div class="table-container">
          <table>
            <thead><tr><th>Od</th><th>Temat</th><th>Data</th><th>Status</th></tr></thead>
            <tbody>
              ${recentMessages.map(m => `
                <tr>
                  <td>${escapeHtml(m.name)}</td>
                  <td>${escapeHtml(m.subject || '-')}</td>
                  <td>${formatDate(m.created_at)}</td>
                  <td><span class="badge badge-${m.status}">${m.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `);

  // Re-attach nav listeners after layout render
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      renderApp();
    });
  });
}

// ============ CONTENT MANAGER ============
let editingSectionId = null;
let dragSrcEl = null;

async function renderContent() {
  try {
    const res = await api('/content/pages/home');
    pageData = res.data;
  } catch (e) {
    pageData = { sections: [] };
  }

  renderLayout(`
    <div class="page-header">
      <h1>Zarządzanie treścią</h1>
      <div class="actions">
        <button class="btn btn-primary" id="add-section-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Dodaj sekcję
        </button>
      </div>
    </div>

    <div class="section-list" id="section-list">
      ${pageData.sections?.filter(s => s.type !== 'footer').map((section, index) => {
        let data = section.data;
        if (typeof data === 'string') {
          try { data = JSON.parse(data); } catch { data = {}; }
        }
        return `
          <div class="section-item ${section.is_active ? '' : 'inactive'}" draggable="true" data-id="${section.id}" data-index="${index}">
            <div class="drag-handle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
            </div>
            <div class="section-info">
              <div class="section-type">${section.type}</div>
              <div class="section-order">Kolejność: ${section.order_index} | ${section.is_active ? 'Aktywna' : 'Nieaktywna'}</div>
            </div>
            <div class="section-actions">
              <div class="toggle ${section.is_active ? 'active' : ''}" data-id="${section.id}" title="Włącz/Wyłącz"></div>
              <button class="btn-icon" data-edit="${section.id}" title="Edytuj">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-icon" data-preview="${section.id}" title="Podgląd">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="btn-icon" data-delete="${section.id}" title="Usuń" style="color:var(--admin-danger);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `;
      }).join('') || '<div class="empty-state"><p>Brak sekcji</p></div>'}
    </div>

    <div style="margin-top:1.5rem;">
      <button class="btn btn-primary" id="save-order-btn" style="display:none;">Zapisz kolejność</button>
    </div>
  `);

  setupDragAndDrop();
  setupContentEvents();
}

function setupDragAndDrop() {
  const list = document.getElementById('section-list');
  if (!list) return;

  list.querySelectorAll('.section-item').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
  });
}

function handleDragStart(e) {
  dragSrcEl = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(e) {
  e.stopPropagation();
  if (dragSrcEl !== this) {
    const list = document.getElementById('section-list');
    const items = [...list.querySelectorAll('.section-item')];
    const srcIndex = items.indexOf(dragSrcEl);
    const targetIndex = items.indexOf(this);

    if (srcIndex < targetIndex) {
      this.after(dragSrcEl);
    } else {
      this.before(dragSrcEl);
    }

    document.getElementById('save-order-btn').style.display = 'inline-flex';
  }
  return false;
}

function handleDragEnd() {
  this.classList.remove('dragging');
}

function setupContentEvents() {
  // Toggle
  document.querySelectorAll('.toggle[data-id]').forEach(toggle => {
    toggle.addEventListener('click', async () => {
      const id = toggle.dataset.id;
      try {
        await api(`/content/sections/${id}/toggle`, { method: 'PATCH' });
        toggle.classList.toggle('active');
        showToast('Status sekcji zmieniony', 'success');
        renderContent();
      } catch (e) {}
    });
  });

  // Edit
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openEditor(btn.dataset.edit));
  });

  // Preview
  document.querySelectorAll('[data-preview]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.preview;
      const section = pageData.sections?.find(s => s.id == id);
      if (section) {
        window.open(`/#${section.type}`, '_blank');
      }
    });
  });

  // Delete
  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.delete;
      if (!confirm('Czy na pewno chcesz usunąć tę sekcję?')) return;
      try {
        // Note: API doesn't have direct section delete, we'd need to update page
        showToast('Funkcja wymaga aktualizacji API', 'warning');
      } catch (e) {}
    });
  });

  // Add section
  document.getElementById('add-section-btn')?.addEventListener('click', openAddModal);

  // Save order
  document.getElementById('save-order-btn')?.addEventListener('click', async () => {
    const list = document.getElementById('section-list');
    const ids = [...list.querySelectorAll('.section-item')].map(el => parseInt(el.dataset.id));
    try {
      await api('/content/pages/1/reorder', {
        method: 'POST',
        body: JSON.stringify({ sectionIds: ids })
      });
      showToast('Kolejność zapisana', 'success');
      document.getElementById('save-order-btn').style.display = 'none';
      renderContent();
    } catch (e) {}
  });
}

function openEditor(sectionId) {
  const section = pageData.sections?.find(s => s.id == sectionId);
  if (!section) return;

  let data = section.data;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { data = {}; }
  }

  editingSectionId = sectionId;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Edytuj sekcję: ${section.type}</h3>
        <button class="btn-icon" id="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Typ sekcji</label>
          <input type="text" value="${section.type}" disabled class="input" style="opacity:0.6;">
        </div>
        <div class="form-group">
          <label>Dane sekcji (JSON)</label>
          <textarea class="json-editor" id="section-json">${JSON.stringify(data, null, 2)}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-edit">Anuluj</button>
        <button class="btn btn-primary" id="save-section">Zapisz zmiany</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
  modal.querySelector('#cancel-edit').addEventListener('click', () => modal.remove());
  modal.querySelector('#save-section').addEventListener('click', async () => {
    try {
      const json = JSON.parse(modal.querySelector('#section-json').value);
      await api(`/content/sections/${editingSectionId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: json })
      });
      showToast('Sekcja zaktualizowana', 'success');
      modal.remove();
      renderContent();
    } catch (err) {
      if (err.message.includes('JSON')) {
        showToast('Nieprawidłowy format JSON', 'error');
      }
    }
  });
}

function openAddModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Dodaj nową sekcję</h3>
        <button class="btn-icon" id="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Typ sekcji</label>
          <select class="input" id="new-section-type">
            <option value="hero">Hero</option>
            <option value="stats">Stats</option>
            <option value="about">About</option>
            <option value="services">Services</option>
            <option value="portfolio">Portfolio</option>
            <option value="process">Process</option>
            <option value="pricing">Pricing</option>
            <option value="testimonials">Testimonials</option>
            <option value="faq">FAQ</option>
            <option value="contact">Contact</option>
            <option value="cta">CTA</option>
          </select>
        </div>
        <div class="form-group">
          <label>Dane (JSON)</label>
          <textarea class="json-editor" id="new-section-json">{}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-add">Anuluj</button>
        <button class="btn btn-primary" id="create-section">Utwórz</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
  modal.querySelector('#cancel-add').addEventListener('click', () => modal.remove());
  modal.querySelector('#create-section').addEventListener('click', async () => {
    try {
      const type = modal.querySelector('#new-section-type').value;
      const data = JSON.parse(modal.querySelector('#new-section-json').value);
      await api('/content/sections', {
        method: 'POST',
        body: JSON.stringify({ page_id: 1, type, data, order_index: (pageData.sections?.length || 0) + 1 })
      });
      showToast('Sekcja utworzona', 'success');
      modal.remove();
      renderContent();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ============ MESSAGES VIEW ============
async function renderMessages() {
  let messages = [];
  let total = 0;
  try {
    const res = await api('/contact?page=1&limit=50');
    messages = res.data?.items || [];
    total = res.data?.meta?.total || 0;
  } catch (e) {}

  renderLayout(`
    <div class="page-header">
      <h1>Wiadomości (${total})</h1>
    </div>

    <div class="card">
      ${messages.length === 0 ? `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <p>Brak wiadomości</p>
        </div>
      ` : `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Od</th>
                <th>Email</th>
                <th>Temat</th>
                <th>Budżet</th>
                <th>Data</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              ${messages.map(m => `
                <tr>
                  <td>${escapeHtml(m.name)}</td>
                  <td>${escapeHtml(m.email)}</td>
                  <td>${escapeHtml(m.subject || '-')}</td>
                  <td>${escapeHtml(m.budget || '-')}</td>
                  <td>${formatDate(m.created_at)}</td>
                  <td><span class="badge badge-${m.status}">${m.status}</span></td>
                  <td>
                    <button class="btn-icon" data-view-msg="${m.id}" title="Zobacz">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button class="btn-icon" data-archive-msg="${m.id}" title="Archiwizuj">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `);

  // View message
  document.querySelectorAll('[data-view-msg]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        const res = await api(`/contact/${btn.dataset.viewMsg}`);
        const msg = res.data;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal">
            <div class="modal-header">
              <h3>Wiadomość od ${escapeHtml(msg.name)}</h3>
              <button class="btn-icon" id="close-modal">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group"><label>Od</label><input type="text" value="${escapeHtml(msg.name)} <${escapeHtml(msg.email)}>" disabled class="input" style="opacity:0.6;"></div>
              <div class="form-group"><label>Temat</label><input type="text" value="${escapeHtml(msg.subject || '-'}" disabled class="input" style="opacity:0.6;"></div>
              <div class="form-group"><label>Budżet</label><input type="text" value="${escapeHtml(msg.budget || '-'}" disabled class="input" style="opacity:0.6;"></div>
              <div class="form-group"><label>Wiadomość</label><textarea disabled class="input" style="opacity:0.6;min-height:120px;">${escapeHtml(msg.message)}</textarea></div>
              <div class="form-group"><label>IP</label><input type="text" value="${escapeHtml(msg.ip || '-'}" disabled class="input" style="opacity:0.6;"></div>
              <div class="form-group"><label>Data</label><input type="text" value="${formatDate(msg.created_at)}" disabled class="input" style="opacity:0.6;"></div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" id="close-modal-btn">Zamknij</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('#close-modal-btn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

        // Mark as read
        if (msg.status === 'new') {
          await api(`/contact/${msg.id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'read' })
          });
        }
      } catch (e) {}
    });
  });

  // Archive
  document.querySelectorAll('[data-archive-msg]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await api(`/contact/${btn.dataset.archiveMsg}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'archived' })
        });
        showToast('Wiadomość zarchiwizowana', 'success');
        renderMessages();
      } catch (e) {}
    });
  });
}

// ============ MEDIA VIEW ============
async function renderMedia() {
  let media = [];
  let total = 0;
  try {
    const res = await api('/media?page=1&limit=50');
    media = res.data?.items || [];
    total = res.data?.meta?.total || 0;
  } catch (e) {}

  renderLayout(`
    <div class="page-header">
      <h1>Media (${total})</h1>
      <div class="actions">
        <button class="btn btn-primary" id="upload-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Prześlij plik
        </button>
      </div>
    </div>

    <input type="file" id="file-input" accept="image/*" style="display:none;">

    <div class="card">
      ${media.length === 0 ? `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <p>Brak plików</p>
        </div>
      ` : `
        <div class="table-container">
          <table>
            <thead>
              <tr><th>Podgląd</th><th>Nazwa</th><th>Typ</th><th>Rozmiar</th><th>Data</th><th>Akcje</th></tr>
            </thead>
            <tbody>
              ${media.map(m => `
                <tr>
                  <td><img src="${m.url}" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:0.5rem;"></td>
                  <td>${escapeHtml(m.original_name)}</td>
                  <td>${m.mime_type}</td>
                  <td>${(m.size / 1024).toFixed(1)} KB</td>
                  <td>${formatDate(m.created_at)}</td>
                  <td>
                    <button class="btn-icon" data-delete-media="${m.id}" title="Usuń" style="color:var(--admin-danger);">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `);

  // Upload
  document.getElementById('upload-btn')?.addEventListener('click', () => {
    document.getElementById('file-input').click();
  });

  document.getElementById('file-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });
      if (res.ok) {
        showToast('Plik przesłany', 'success');
        renderMedia();
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      showToast('Błąd przesyłania', 'error');
    }
  });

  // Delete
  document.querySelectorAll('[data-delete-media]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Usunąć ten plik?')) return;
      try {
        await api(`/media/${btn.dataset.deleteMedia}`, { method: 'DELETE' });
        showToast('Plik usunięty', 'success');
        renderMedia();
      } catch (e) {}
    });
  });
}

// ============ SETTINGS VIEW ============
async function renderSettings() {
  let settings = [];
  try {
    const res = await api('/settings');
    settings = res.data || [];
  } catch (e) {}

  renderLayout(`
    <div class="page-header">
      <h1>Ustawienia</h1>
      <button class="btn btn-primary" id="save-settings">Zapisz zmiany</button>
    </div>

    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr><th>Klucz</th><th>Wartość</th><th>Kategoria</th><th>Publiczne</th></tr>
          </thead>
          <tbody>
            ${settings.map(s => `
              <tr>
                <td>${escapeHtml(s.key)}</td>
                <td><input type="text" class="input setting-value" data-key="${s.key}" value="${escapeHtml(s.value)}" style="min-width:200px;"></td>
                <td>${s.category}</td>
                <td>${s.is_public ? 'Tak' : 'Nie'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);

  document.getElementById('save-settings')?.addEventListener('click', async () => {
    const inputs = document.querySelectorAll('.setting-value');
    let saved = 0;
    for (const input of inputs) {
      try {
        await api(`/settings/${input.dataset.key}`, {
          method: 'PUT',
          body: JSON.stringify({ value: input.value })
        });
        saved++;
      } catch (e) {}
    }
    showToast(`Zapisano ${saved} ustawień`, 'success');
  });
}

// ============ BACKUPS VIEW ============
async function renderBackups() {
  let backups = [];
  try {
    const res = await api('/backup');
    backups = res.data || [];
  } catch (e) {}

  renderLayout(`
    <div class="page-header">
      <h1>Kopie zapasowe</h1>
      <button class="btn btn-primary" id="create-backup">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Utwórz kopię
      </button>
    </div>

    <div class="card">
      ${backups.length === 0 ? `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p>Brak kopii zapasowych</p>
        </div>
      ` : `
        <div class="table-container">
          <table>
            <thead>
              <tr><th>Nazwa pliku</th><th>Rozmiar</th><th>Data utworzenia</th><th>Akcje</th></tr>
            </thead>
            <tbody>
              ${backups.map(b => `
                <tr>
                  <td>${escapeHtml(b.filename)}</td>
                  <td>${(b.size / 1024 / 1024).toFixed(2)} MB</td>
                  <td>${formatDate(b.created_at)}</td>
                  <td>
                    <button class="btn-icon" data-restore="${b.filename}" title="Przywróć">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                    </button>
                    <button class="btn-icon" data-delete-backup="${b.filename}" title="Usuń" style="color:var(--admin-danger);">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `);

  document.getElementById('create-backup')?.addEventListener('click', async () => {
    try {
      await api('/backup', { method: 'POST' });
      showToast('Kopia zapasowa utworzona', 'success');
      renderBackups();
    } catch (e) {}
  });

  document.querySelectorAll('[data-restore]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Przywrócić tę kopię? Serwer zostanie zrestartowany.')) return;
      try {
        await api('/backup/restore', {
          method: 'POST',
          body: JSON.stringify({ filename: btn.dataset.restore })
        });
        showToast('Baza przywrócona. Zrestartuj serwer.', 'success');
      } catch (e) {}
    });
  });

  document.querySelectorAll('[data-delete-backup]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Usunąć tę kopię?')) return;
      try {
        await api(`/backup/${btn.dataset.deleteBackup}`, { method: 'DELETE' });
        showToast('Kopia usunięta', 'success');
        renderBackups();
      } catch (e) {}
    });
  });
}

// ============ USERS VIEW ============
async function renderUsers() {
  renderLayout(`
    <div class="page-header">
      <h1>Użytkownicy</h1>
    </div>
    <div class="card">
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <p>Zarządzanie użytkownikami w wersji 3.1</p>
        <p style="font-size:0.875rem;margin-top:0.5rem;">Funkcja w pełni dostępna w przyszłej aktualizacji</p>
      </div>
    </div>
  `);
}

// ============ ROUTER & INIT ============
const views = {
  dashboard: renderDashboard,
  content: renderContent,
  messages: renderMessages,
  media: renderMedia,
  settings: renderSettings,
  backups: renderBackups,
  users: renderUsers
};

function renderApp() {
  if (!authToken) {
    renderLogin();
    return;
  }

  const view = views[currentView];
  if (view) {
    view();
  } else {
    currentView = 'dashboard';
    renderDashboard();
  }
}

export async function initAdmin() {
  if (authToken) {
    const valid = await fetchMe();
    if (!valid) {
      authToken = null;
      localStorage.removeItem('webowo_admin_token');
    }
  }
  renderApp();
}
