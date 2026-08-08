// ============================================
// Webowo v3.0 – Admin Router
// ============================================

function initRouter() {
  const navLinks = document.querySelectorAll('[data-route]');
  const content = document.getElementById('admin-content');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.dataset.route;
      navigate(route);
    });
  });

  function navigate(route) {
    navLinks.forEach(l => l.classList.remove('is-active'));
    document.querySelector(`[data-route="${route}"]`)?.classList.add('is-active');

    if (!content) return;

    switch (route) {
      case 'dashboard':
        window.location.reload();
        break;
      case 'content':
        content.innerHTML = `
          <div class="admin-header"><h2>Zarządzanie treścią</h2></div>
          <div class="admin-card"><p style="color:#64748b;">Edytor treści w przygotowaniu. Użyj API bezpośrednio lub skontaktuj się z developerem.</p></div>
        `;
        break;
      case 'messages':
        content.innerHTML = `
          <div class="admin-header"><h2>Wiadomości</h2></div>
          <div class="admin-card"><p style="color:#64748b;">Ładowanie wiadomości...</p></div>
        `;
        loadMessages();
        break;
      case 'media':
        content.innerHTML = `
          <div class="admin-header"><h2>Media</h2></div>
          <div class="admin-card"><p style="color:#64748b;">Menadżer mediów w przygotowaniu.</p></div>
        `;
        break;
      case 'settings':
        content.innerHTML = `
          <div class="admin-header"><h2>Ustawienia</h2></div>
          <div class="admin-card"><p style="color:#64748b;">Panel ustawień w przygotowaniu.</p></div>
        `;
        break;
      case 'backups':
        content.innerHTML = `
          <div class="admin-header"><h2>Kopie zapasowe</h2></div>
          <div class="admin-card"><p style="color:#64748b;">Menadżer kopii zapasowych w przygotowaniu.</p></div>
        `;
        break;
      case 'users':
        content.innerHTML = `
          <div class="admin-header"><h2>Użytkownicy</h2></div>
          <div class="admin-card"><p style="color:#64748b;">Zarządzanie użytkownikami w przygotowaniu.</p></div>
        `;
        break;
      default:
        content.innerHTML = `
          <div class="admin-header"><h2>404</h2></div>
          <div class="admin-card"><p style="color:#64748b;">Nie znaleziono strony.</p></div>
        `;
    }
  }

  async function loadMessages() {
    const token = localStorage.getItem('admin_token');
    const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
    try {
      const res = await fetch(`${API_BASE}/contact?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const content = document.getElementById('admin-content');
      if (!content) return;

      if (data.data?.length > 0) {
        content.innerHTML = `
          <div class="admin-header"><h2>Wiadomości (${data.meta?.total || data.data.length})</h2></div>
          <div class="admin-card">
            <table class="admin-table">
              <thead>
                <tr><th>Nadawca</th><th>E-mail</th><th>Temat</th><th>Budżet</th><th>Status</th><th>Data</th></tr>
              </thead>
              <tbody>
                ${data.data.map(c => `
                  <tr>
                    <td>${c.name}</td>
                    <td><a href="mailto:${c.email}" style="color:#005ce6;">${c.email}</a></td>
                    <td>${c.subject}</td>
                    <td>${c.budget || '-'}</td>
                    <td><span class="admin-badge admin-badge-${c.status}">${c.status}</span></td>
                    <td style="color:#64748b;font-size:0.75rem;">${new Date(c.created_at).toLocaleString('pl-PL')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } else {
        content.innerHTML = `
          <div class="admin-header"><h2>Wiadomości</h2></div>
          <div class="admin-card"><p style="color:#64748b;">Brak wiadomości.</p></div>
        `;
      }
    } catch (err) {
      content.innerHTML = `
        <div class="admin-header"><h2>Wiadomości</h2></div>
        <div class="admin-card"><p style="color:#ef4444;">Błąd ładowania wiadomości.</p></div>
      `;
    }
  }
}

export { initRouter };
