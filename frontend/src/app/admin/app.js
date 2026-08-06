// ============================================
// Admin Panel v2.0 – Content Manager (Tura 1)
// ============================================

import { showToast } from '../components/ui/toast.js';

class WebowoAdmin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.token = localStorage.getItem('webowo_admin_token');
    this.user = null;
    this.apiUrl = '/api/v2';
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
        :host { display: block; min-height: 100vh; font-family: system-ui, -apple-system, sans-serif; }
        .layout { display: flex; min-height: 100vh; }
        .sidebar { width: 260px; background: #0f172a; color: #e2e8f0; padding: 1.5rem; flex-shrink: 0; }
        .sidebar h1 { font-size: 1.25rem; margin-bottom: 1.5rem; color: #38bdf8; }
        .nav { list-style: none; padding: 0; margin: 0; }
        .nav li { margin-bottom: 0.25rem; }
        .nav a { display: block; padding: 0.6rem 0.75rem; border-radius: 0.375rem; color: #94a3b8; text-decoration: none; font-size: 0.875rem; cursor: pointer; }
        .nav a:hover, .nav a.active { background: #1e293b; color: #f8fafc; }
        .main { flex: 1; padding: 2rem; background: #f1f5f9; overflow-y: auto; }
        .login-box { max-width: 360px; margin: 10vh auto; padding: 2rem; background: #fff; border-radius: 0.75rem; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .login-box h2 { margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; }
        .form-group input { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; font-size: 0.875rem; box-sizing: border-box; }
        .btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; }
        .btn-primary { background: #0ea5e9; color: #fff; }
        .btn-primary:hover { background: #0284c7; }
        .btn-secondary { background: #e2e8f0; color: #0f172a; }
        .btn-secondary:hover { background: #cbd5e1; }
        .btn-danger { background: #ef4444; color: #fff; }
        .btn-danger:hover { background: #dc2626; }
        .btn-sm { padding: 0.35rem 0.6rem; font-size: 0.75rem; }
        .error { color: #dc2626; font-size: 0.875rem; margin-top: 0.5rem; }
        .table-wrap { background: #fff; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; font-weight: 600; color: #475569; }
        .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
        .badge-published { background: #dcfce7; color: #166534; }
        .badge-draft { background: #fef3c7; color: #92400e; }
        .badge-archived { background: #f1f5f9; color: #475569; }
        .badge-new { background: #dbeafe; color: #1e40af; }
        .badge-read { background: #e2e8f0; color: #475569; }
        .badge-replied { background: #dcfce7; color: #166534; }
        .badge-spam { background: #fee2e2; color: #991b1b; }
        .actions { display: flex; gap: 0.375rem; flex-wrap: wrap; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
        .modal { background: #fff; border-radius: 0.75rem; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.18); }
        .modal-header { padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; font-size: 1rem; }
        .modal-body { padding: 1.25rem; }
        .modal-footer { padding: 1rem 1.25rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.5rem; }
        .close-btn { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #64748b; }
        .close-btn:hover { color: #0f172a; }
        .form-row { margin-bottom: 1rem; }
        .form-row label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; }
        .form-row input, .form-row select, .form-row textarea { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; font-size: 0.875rem; box-sizing: border-box; }
        .form-row textarea { min-height: 120px; font-family: ui-monospace, SFMono-Regular, monospace; }
        .section-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; margin-bottom: 0.5rem; }
        .section-item .type { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #64748b; min-width: 80px; }
        .section-item .title { flex: 1; font-size: 0.875rem; }
        .revisions-list { max-height: 300px; overflow-y: auto; }
        .revision-item { padding: 0.6rem 0.75rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .revision-item:last-child { border-bottom: none; }
        .empty { text-align: center; padding: 3rem; color: #64748b; }
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .toolbar h2 { margin: 0; font-size: 1.25rem; }
        .hidden { display: none !important; }
        @media (max-width: 768px) {
          .layout { flex-direction: column; }
          .sidebar { width: 100%; padding: 1rem; }
          .main { padding: 1rem; }
          .actions { flex-direction: column; }
        }
      </style>
      <div class="layout">
        <aside class="sidebar" id="sidebar"></aside>
        <main class="main" id="main-content"></main>
      </div>
    `;
  }

  // ========== API Helpers ==========
  async apiFetch(url, options = {}) {
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${this.token}`
    };
    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    const opts = {
      ...options,
      credentials: 'include',
      headers
    };
    let res = await fetch(`${this.apiUrl}${url}`, opts);
    if (res.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        opts.headers['Authorization'] = `Bearer ${this.token}`;
        res = await fetch(`${this.apiUrl}${url}`, opts);
      } else {
        this.logout();
        throw new Error('Sesja wygasła. Zaloguj się ponownie.');
      }
    }
    return res;
  }

  async refreshToken() {
    try {
      const res = await fetch(`${this.apiUrl}/auth/refresh`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const result = await res.json();
        this.token = result.data.accessToken;
        localStorage.setItem('webowo_admin_token', this.token);
        return true;
      }
    } catch {}
    return false;
  }

  // ========== Auth ==========
  async validateToken() {
    try {
      const res = await this.apiFetch('/auth/me');
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
    const main = this.shadowRoot.getElementById('main-content');
    const sidebar = this.shadowRoot.getElementById('sidebar');
    sidebar.innerHTML = '';
    main.innerHTML = `
      <div class="login-box">
        <h2>🔐 Logowanie do panelu</h2>
        <form id="login-form">
          <div class="form-group">
            <label>Nazwa użytkownika</label>
            <input type="text" name="username" required autofocus>
          </div>
          <div class="form-group">
            <label>Hasło</label>
            <input type="password" name="password" required>
          </div>
          <button type="submit" class="btn btn-primary">Zaloguj się</button>
          <div class="error" id="login-error"></div>
        </form>
      </div>
    `;
    main.querySelector('#login-form').addEventListener('submit', async (e) => {
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
        main.querySelector('#login-error').textContent = err.message || 'Błąd logowania';
      }
    });
  }

  logout() {
    fetch(`${this.apiUrl}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
    localStorage.removeItem('webowo_admin_token');
    this.token = null;
    this.user = null;
    this.showLogin();
  }

  // ========== Layout & Routing ==========
  showDashboard() {
    const sidebar = this.shadowRoot.getElementById('sidebar');
    sidebar.innerHTML = `
      <h1>Webowo</h1>
      <ul class="nav">
        <li><a data-page="dashboard" class="active">📊 Dashboard</a></li>
        <li><a data-page="content">📝 Treści</a></li>
        <li><a data-page="media">🖼️ Media</a></li>
        <li><a data-page="contacts">📨 Wiadomości</a></li>
        <li><a data-page="settings">⚙️ Ustawienia</a></li>
        <li><a data-page="backups">💾 Kopie zapasowe</a></li>
        <li><a id="logout">🚪 Wyloguj</a></li>
      </ul>
    `;
    sidebar.querySelectorAll('.nav a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        sidebar.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        this.loadPage(e.target.dataset.page);
      });
    });
    sidebar.querySelector('#logout').addEventListener('click', () => this.logout());
    this.loadPage('dashboard');
  }

  async loadPage(page) {
    const main = this.shadowRoot.getElementById('main-content');
    switch (page) {
      case 'dashboard':
        main.innerHTML = `<div class="toolbar"><h2>Dashboard</h2></div><p>Witaj, ${this.user?.username || 'admin'}! Panel administracyjny Webowo v2.0</p>`;
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

  // ========== Content Manager ==========
  async loadContent(main) {
    main.innerHTML = `
      <div class="toolbar">
        <h2>📝 Zarządzanie treścią</h2>
        <button class="btn btn-primary" id="btn-new-page">+ Nowa strona</button>
      </div>
      <div id="content-table" class="table-wrap"><div class="empty">Ładowanie...</div></div>
    `;
    try {
      const res = await this.apiFetch('/content/pages');
      const { data } = await res.json();
      this.renderPagesTable(main, data || []);
    } catch (err) {
      main.querySelector('#content-table').innerHTML = `<div class="empty">Błąd ładowania: ${err.message}</div>`;
      showToast(err.message, 'error');
    }
  }

  renderPagesTable(container, pages) {
    const tableWrap = container.querySelector('#content-table');
    if (!pages.length) {
      tableWrap.innerHTML = `<div class="empty">Brak stron. Utwórz pierwszą stronę.</div>`;
      return;
    }
    tableWrap.innerHTML = `
      <table>
        <thead><tr><th>Tytuł</th><th>Slug</th><th>Status</th><th>Ostatnia zmiana</th><th>Akcje</th></tr></thead>
        <tbody>
          ${pages.map(p => `
            <tr data-id="${p.id}">
              <td>${this.escapeHtml(p.title)}</td>
              <td><code>${this.escapeHtml(p.slug)}</code></td>
              <td><span class="badge badge-${p.status}">${p.status}</span></td>
              <td>${p.updatedAt ? new Date(p.updatedAt).toLocaleString('pl-PL') : '-'}</td>
              <td class="actions">
                <button class="btn btn-secondary btn-sm btn-edit" data-id="${p.id}">Edytuj</button>
                <button class="btn btn-primary btn-sm btn-publish" data-id="${p.id}">Publikuj</button>
                <button class="btn btn-secondary btn-sm btn-history" data-id="${p.id}">Historia</button>
                <button class="btn btn-danger btn-sm btn-delete" data-id="${p.id}">Usuń</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.querySelector('#btn-new-page').addEventListener('click', () => this.openNewPageModal());
    tableWrap.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', (e) => this.openEditPageModal(parseInt(e.target.dataset.id))));
    tableWrap.querySelectorAll('.btn-publish').forEach(b => b.addEventListener('click', (e) => this.publishPage(parseInt(e.target.dataset.id))));
    tableWrap.querySelectorAll('.btn-history').forEach(b => b.addEventListener('click', (e) => this.openHistoryModal(parseInt(e.target.dataset.id))));
    tableWrap.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', (e) => this.deletePage(parseInt(e.target.dataset.id))));
  }

  // ========== Modals ==========
  openModal(html) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = html;
    this.shadowRoot.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.close-btn')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    return { overlay, close };
  }

  openNewPageModal() {
    const { overlay, close } = this.openModal(`
      <div class="modal">
        <div class="modal-header"><h3>Nowa strona</h3><button class="close-btn">&times;</button></div>
        <div class="modal-body">
          <div class="form-row"><label>Slug (URL)</label><input type="text" id="np-slug" placeholder="np. o-nas" required></div>
          <div class="form-row"><label>Tytuł</label><input type="text" id="np-title" placeholder="Tytuł strony" required></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary close-btn">Anuluj</button>
          <button class="btn btn-primary" id="np-save">Utwórz</button>
        </div>
      </div>
    `);
    overlay.querySelector('#np-save').addEventListener('click', async () => {
      const slug = overlay.querySelector('#np-slug').value.trim();
      const title = overlay.querySelector('#np-title').value.trim();
      if (!slug || !title) { showToast('Wypełnij wszystkie pola', 'error'); return; }
      try {
        const res = await this.apiFetch('/content/pages', {
          method: 'POST',
          body: JSON.stringify({ slug, title, sections: [] })
        });
        const result = await res.json();
        if (result.success) {
          showToast('Strona utworzona', 'success');
          close();
          this.loadPage('content');
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  async openEditPageModal(pageId) {
    try {
      const res = await this.apiFetch(`/content/pages/${pageId}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      const page = result.data;
      const sections = page.sections || [];

      const { overlay, close } = this.openModal(`
        <div class="modal" style="max-width:720px;">
          <div class="modal-header"><h3>Edycja: ${this.escapeHtml(page.title)}</h3><button class="close-btn">&times;</button></div>
          <div class="modal-body">
            <div class="form-row"><label>Tytuł</label><input type="text" id="ep-title" value="${this.escapeHtml(page.title)}"></div>
            <div class="form-row"><label>Status</label>
              <select id="ep-status">
                <option value="draft" ${page.status === 'draft' ? 'selected' : ''}>Szkic</option>
                <option value="published" ${page.status === 'published' ? 'selected' : ''}>Opublikowana</option>
                <option value="archived" ${page.status === 'archived' ? 'selected' : ''}>Zarchiwizowana</option>
              </select>
            </div>
            <hr style="border:0;border-top:1px solid #e2e8f0;margin:1rem 0;">
            <h4 style="margin:0 0 0.5rem;font-size:0.875rem;">Sekcje strony</h4>
            <div id="ep-sections">${sections.length ? sections.map((s, i) => this.renderSectionItem(s, i)).join('') : '<div class="empty">Brak sekcji</div>'}</div>
            <button class="btn btn-secondary btn-sm" id="ep-add-section" style="margin-top:0.5rem;">+ Dodaj sekcję</button>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary close-btn">Anuluj</button>
            <button class="btn btn-primary" id="ep-save">Zapisz zmiany</button>
          </div>
        </div>
      `);

      const getSections = () => {
        const items = overlay.querySelectorAll('.section-item');
        return Array.from(items).map(item => {
          const type = item.dataset.type;
          const dataStr = item.querySelector('.section-data').value;
          let data = {};
          try { data = JSON.parse(dataStr); } catch { data = { text: dataStr }; }
          return { type, data, order: parseInt(item.dataset.order) };
        });
      };

      overlay.querySelector('#ep-add-section').addEventListener('click', () => {
        const container = overlay.querySelector('#ep-sections');
        if (container.querySelector('.empty')) container.innerHTML = '';
        const idx = container.children.length;
        const div = document.createElement('div');
        div.innerHTML = this.renderSectionItem({ type: 'text', data: { text: '' }, order: idx }, idx);
        container.appendChild(div.firstElementChild);
        this.bindSectionEvents(container.lastElementChild, container);
      });

      overlay.querySelectorAll('.section-item').forEach(item => this.bindSectionEvents(item, overlay.querySelector('#ep-sections')));

      overlay.querySelector('#ep-save').addEventListener('click', async () => {
        const title = overlay.querySelector('#ep-title').value.trim();
        const status = overlay.querySelector('#ep-status').value;
        const sections = getSections();
        try {
          const res = await this.apiFetch(`/content/pages/${pageId}`, {
            method: 'PATCH',
            body: JSON.stringify({ title, status, sections })
          });
          const result = await res.json();
          if (result.success) {
            showToast('Zmiany zapisane', 'success');
            close();
            this.loadPage('content');
          } else {
            throw new Error(result.error);
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  renderSectionItem(section, index) {
    const dataStr = typeof section.data === 'string' ? section.data : JSON.stringify(section.data, null, 2);
    return `
      <div class="section-item" data-type="${this.escapeHtml(section.type || 'text')}" data-order="${index}">
        <span class="type">${this.escapeHtml(section.type || 'text')}</span>
        <span class="title">Sekcja #${index + 1}</span>
        <button class="btn btn-sm btn-secondary btn-up" title="W górę">↑</button>
        <button class="btn btn-sm btn-secondary btn-down" title="W dół">↓</button>
        <button class="btn btn-sm btn-secondary btn-edit-section" title="Edytuj JSON">✎</button>
        <button class="btn btn-sm btn-danger btn-del-section" title="Usuń">🗑</button>
        <textarea class="section-data hidden" rows="4">${this.escapeHtml(dataStr)}</textarea>
      </div>
    `;
  }

  bindSectionEvents(item, container) {
    item.querySelector('.btn-up').addEventListener('click', () => {
      const prev = item.previousElementSibling;
      if (prev) container.insertBefore(item, prev);
      this.renumberSections(container);
    });
    item.querySelector('.btn-down').addEventListener('click', () => {
      const next = item.nextElementSibling;
      if (next) container.insertBefore(next, item);
      this.renumberSections(container);
    });
    item.querySelector('.btn-del-section').addEventListener('click', () => {
      item.remove();
      if (!container.children.length) container.innerHTML = '<div class="empty">Brak sekcji</div>';
      else this.renumberSections(container);
    });
    item.querySelector('.btn-edit-section').addEventListener('click', () => {
      const ta = item.querySelector('.section-data');
      ta.classList.toggle('hidden');
      if (!ta.classList.contains('hidden')) ta.focus();
    });
  }

  renumberSections(container) {
    container.querySelectorAll('.section-item').forEach((el, i) => {
      el.dataset.order = i;
      el.querySelector('.title').textContent = `Sekcja #${i + 1}`;
    });
  }

  async publishPage(pageId) {
    if (!confirm('Opublikować tę stronę?')) return;
    try {
      const res = await this.apiFetch(`/content/pages/${pageId}/publish`, { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        showToast('Strona opublikowana', 'success');
        this.loadPage('content');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async deletePage(pageId) {
    if (!confirm('Usunąć tę stronę? Tej operacji nie można cofnąć.')) return;
    try {
      const res = await this.apiFetch(`/content/pages/${pageId}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showToast('Strona usunięta', 'success');
        this.loadPage('content');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async openHistoryModal(pageId) {
    try {
      const res = await this.apiFetch(`/content/pages/${pageId}/revisions`);
      const result = await res.json();
      const revisions = result.data || [];
      const { overlay, close } = this.openModal(`
        <div class="modal">
          <div class="modal-header"><h3>Historia zmian</h3><button class="close-btn">&times;</button></div>
          <div class="modal-body">
            <div class="revisions-list">
              ${revisions.length ? revisions.map(r => `
                <div class="revision-item" data-revid="${r.id}">
                  <div>
                    <div style="font-size:0.875rem;font-weight:500;">${new Date(r.createdAt).toLocaleString('pl-PL')}</div>
                    <div style="font-size:0.75rem;color:#64748b;">${this.escapeHtml(r.note || 'Auto-save')} – ${this.escapeHtml(r.author || 'system')}</div>
                  </div>
                  <button class="btn btn-secondary btn-sm btn-rollback" data-revid="${r.id}">Przywróć</button>
                </div>
              `).join('') : '<div class="empty">Brak historii</div>'}
            </div>
          </div>
          <div class="modal-footer"><button class="btn btn-secondary close-btn">Zamknij</button></div>
        </div>
      `);
      overlay.querySelectorAll('.btn-rollback').forEach(b => b.addEventListener('click', async (e) => {
        const revId = parseInt(e.target.dataset.revid);
        if (!confirm('Przywrócić tę wersję?')) return;
        try {
          const res = await this.apiFetch(`/content/pages/${pageId}/rollback`, {
            method: 'POST',
            body: JSON.stringify({ revisionId: revId })
          });
          const result = await res.json();
          if (result.success) {
            showToast('Wersja przywrócona', 'success');
            close();
            this.loadPage('content');
          } else {
            throw new Error(result.error);
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      }));
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // ========== Media ==========
  async loadMedia(main) {
    main.innerHTML = `
      <div class="toolbar"><h2>🖼️ Biblioteka mediów</h2></div>
      <div id="media-grid" class="table-wrap"><div class="empty">Ładowanie...</div></div>
    `;
    try {
      const res = await this.apiFetch('/media');
      const { data } = await res.json();
      const grid = main.querySelector('#media-grid');
      if (!data.length) {
        grid.innerHTML = `<div class="empty">Brak plików w bibliotece.</div>`;
        return;
      }
      grid.innerHTML = `
        <table>
          <thead><tr><th>Podgląd</th><th>Nazwa</th><th>Typ</th><th>Rozmiar</th><th>Warianty</th><th>Akcje</th></tr></thead>
          <tbody>
            ${data.map(m => `
              <tr>
                <td><img src="${m.variants?.thumb || m.url}" width="48" height="48" style="object-fit:cover;border-radius:4px;" loading="lazy"></td>
                <td>${this.escapeHtml(m.originalName || m.filename)}</td>
                <td>${this.escapeHtml(m.mimeType)}</td>
                <td>${(m.size / 1024).toFixed(1)} KB</td>
                <td>${m.variants ? Object.keys(m.variants).join(', ') : '-'}</td>
                <td class="actions"><button class="btn btn-danger btn-sm btn-del-media" data-id="${m.id}">Usuń</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      grid.querySelectorAll('.btn-del-media').forEach(b => b.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);
        if (!confirm('Usunąć ten plik?')) return;
        try {
          const res = await this.apiFetch(`/media/${id}`, { method: 'DELETE' });
          const result = await res.json();
          if (result.success) { showToast('Plik usunięty', 'success'); this.loadPage('media'); }
          else throw new Error(result.error);
        } catch (err) { showToast(err.message, 'error'); }
      }));
    } catch (err) {
      main.querySelector('#media-grid').innerHTML = `<div class="empty">Błąd: ${err.message}</div>`;
      showToast(err.message, 'error');
    }
  }

  // ========== Contacts ==========
  async loadContacts(main) {
    main.innerHTML = `
      <div class="toolbar"><h2>📨 Wiadomości</h2></div>
      <div id="contacts-table" class="table-wrap"><div class="empty">Ładowanie...</div></div>
    `;
    try {
      const res = await this.apiFetch('/contact');
      const { data } = await res.json();
      const table = main.querySelector('#contacts-table');
      if (!data.length) { table.innerHTML = `<div class="empty">Brak wiadomości.</div>`; return; }
      table.innerHTML = `
        <table>
          <thead><tr><th>Od</th><th>Email</th><th>Temat</th><th>Status</th><th>Data</th><th>Akcje</th></tr></thead>
          <tbody>
            ${data.map(c => `
              <tr>
                <td>${this.escapeHtml(c.name)}</td>
                <td>${this.escapeHtml(c.email)}</td>
                <td>${this.escapeHtml(c.subject || '-')}</td>
                <td><span class="badge badge-${c.status}">${c.status}</span></td>
                <td>${new Date(c.created_at).toLocaleDateString('pl-PL')}</td>
                <td class="actions">
                  <button class="btn btn-secondary btn-sm btn-status" data-id="${c.id}" data-status="${c.status}">Zmień status</button>
                  <button class="btn btn-danger btn-sm btn-del-contact" data-id="${c.id}">Usuń</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      table.querySelectorAll('.btn-status').forEach(b => b.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);
        const current = e.target.dataset.status;
        const next = current === 'new' ? 'read' : current === 'read' ? 'replied' : 'new';
        try {
          const res = await this.apiFetch(`/contact/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: next }) });
          const result = await res.json();
          if (result.success) { showToast('Status zmieniony', 'success'); this.loadPage('contacts'); }
          else throw new Error(result.error);
        } catch (err) { showToast(err.message, 'error'); }
      }));
      table.querySelectorAll('.btn-del-contact').forEach(b => b.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);
        if (!confirm('Usunąć wiadomość?')) return;
        try {
          const res = await this.apiFetch(`/contact/${id}`, { method: 'DELETE' });
          const result = await res.json();
          if (result.success) { showToast('Wiadomość usunięta', 'success'); this.loadPage('contacts'); }
          else throw new Error(result.error);
        } catch (err) { showToast(err.message, 'error'); }
      }));
    } catch (err) {
      main.querySelector('#contacts-table').innerHTML = `<div class="empty">Błąd: ${err.message}</div>`;
      showToast(err.message, 'error');
    }
  }

  // ========== Settings ==========
  async loadSettings(main) {
    main.innerHTML = `
      <div class="toolbar"><h2>⚙️ Ustawienia</h2></div>
      <div id="settings-form" class="table-wrap" style="padding:1.5rem;"><div class="empty">Ładowanie...</div></div>
    `;
    try {
      const res = await this.apiFetch('/settings');
      const { data } = await res.json();
      const wrap = main.querySelector('#settings-form');
      wrap.innerHTML = `
        <table>
          <thead><tr><th>Klucz</th><th>Wartość</th><th>Kategoria</th><th>Akcja</th></tr></thead>
          <tbody>
            ${data.map(s => `
              <tr data-key="${this.escapeHtml(s.key)}">
                <td><code>${this.escapeHtml(s.key)}</code></td>
                <td><input type="text" class="setting-val" value="${this.escapeHtml(s.value)}" style="width:100%;"></td>
                <td>${this.escapeHtml(s.category)}</td>
                <td><button class="btn btn-primary btn-sm btn-save-setting">Zapisz</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      wrap.querySelectorAll('.btn-save-setting').forEach(b => b.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        const key = row.dataset.key;
        const value = row.querySelector('.setting-val').value;
        try {
          const res = await this.apiFetch(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });
          const result = await res.json();
          if (result.success) showToast('Ustawienie zapisane', 'success');
          else throw new Error(result.error);
        } catch (err) { showToast(err.message, 'error'); }
      }));
    } catch (err) {
      main.querySelector('#settings-form').innerHTML = `<div class="empty">Błąd: ${err.message}</div>`;
      showToast(err.message, 'error');
    }
  }

  // ========== Backups ==========
  async loadBackups(main) {
    main.innerHTML = `
      <div class="toolbar"><h2>💾 Kopie zapasowe</h2><button class="btn btn-primary" id="btn-create-backup">+ Utwórz backup</button></div>
      <div id="backups-table" class="table-wrap"><div class="empty">Ładowanie...</div></div>
    `;
    try {
      const res = await this.apiFetch('/backups');
      const { data } = await res.json();
      const table = main.querySelector('#backups-table');
      if (!data.length) { table.innerHTML = `<div class="empty">Brak backupów.</div>`; return; }
      table.innerHTML = `
        <table>
          <thead><tr><th>Nazwa</th><th>Rozmiar</th><th>Data</th><th>Akcje</th></tr></thead>
          <tbody>
            ${data.map(b => `
              <tr>
                <td><code>${this.escapeHtml(b.name)}</code></td>
                <td>${(b.size / 1024).toFixed(1)} KB</td>
                <td>${new Date(b.createdAt).toLocaleString('pl-PL')}</td>
                <td class="actions">
                  <a class="btn btn-secondary btn-sm" href="${this.apiUrl}/backups/${encodeURIComponent(b.name)}" download>Pobierz</a>
                  <button class="btn btn-primary btn-sm btn-restore" data-file="${this.escapeHtml(b.name)}">Przywróć</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      main.querySelector('#btn-create-backup').addEventListener('click', async () => {
        try {
          const res = await this.apiFetch('/backups', { method: 'POST' });
          const result = await res.json();
          if (result.success) { showToast('Backup utworzony', 'success'); this.loadPage('backups'); }
          else throw new Error(result.error);
        } catch (err) { showToast(err.message, 'error'); }
      });
      table.querySelectorAll('.btn-restore').forEach(b => b.addEventListener('click', async (e) => {
        const file = e.target.dataset.file;
        if (!confirm(`Przywrócić backup ${file}?`)) return;
        try {
          const res = await this.apiFetch('/backups/restore', { method: 'POST', body: JSON.stringify({ filename: file }) });
          const result = await res.json();
          if (result.success) showToast('Backup przywrócony', 'success');
          else throw new Error(result.error);
        } catch (err) { showToast(err.message, 'error'); }
      }));
    } catch (err) {
      main.querySelector('#backups-table').innerHTML = `<div class="empty">Błąd: ${err.message}</div>`;
      showToast(err.message, 'error');
    }
  }

  // ========== Helpers ==========
  escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

customElements.define('webowo-admin', WebowoAdmin);
