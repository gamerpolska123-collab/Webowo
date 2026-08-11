// ============================================
// Shared Constants
// ============================================

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v2';
export const LEGACY_API = import.meta.env.VITE_LEGACY_API_URL || 'http://localhost:3000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Webowo';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '2.0.0';
export const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE || 'pl';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};

export const ANIMATION_DURATION = 300;
export const TOAST_DURATION = 3000;
export const DEBOUNCE_DELAY = 300;
