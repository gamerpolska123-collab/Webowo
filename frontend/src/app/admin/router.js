// ============================================
// Admin Router (hash-based)
// ============================================

function initAdminRouter() {
  const handle = () => {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const admin = document.querySelector('webowo-admin');
    if (admin) admin.loadPage(hash);
  };
  window.addEventListener('hashchange', handle);
  handle();
}

export { initAdminRouter };
