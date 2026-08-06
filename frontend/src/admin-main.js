// Admin Panel Entry Point
import './app/admin/app.js';
import { initAdminRouter } from './app/admin/router.js';

document.addEventListener('DOMContentLoaded', () => {
  initAdminRouter();
});
