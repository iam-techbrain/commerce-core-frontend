// =========================================================================
// 🎨 ADMIN THEME & COLOR PREFERENCES MANAGER (LocalStorage Persistence)
// =========================================================================

export const DEFAULT_THEME = {
  sidebarColor: '#4e73df',
  sidebarGradient: 'linear-gradient(180deg, #4e73df 10%, #224abe 100%)',
  topbarColor: '#ffffff',
  bodyColor: '#f8f9fc',
  footerColor: '#ffffff'
};

export const PRESET_THEMES = [
  {
    id: 'default',
    name: 'RuangAdmin Royal Indigo (Default)',
    sidebarColor: '#4e73df',
    sidebarGradient: 'linear-gradient(180deg, #4e73df 10%, #224abe 100%)',
    topbarColor: '#ffffff',
    bodyColor: '#f8f9fc',
    footerColor: '#ffffff'
  },
  {
    id: 'emerald',
    name: 'Emerald Forest Green',
    sidebarColor: '#1cc88a',
    sidebarGradient: 'linear-gradient(180deg, #1cc88a 10%, #13855c 100%)',
    topbarColor: '#ffffff',
    bodyColor: '#f4fbf7',
    footerColor: '#ffffff'
  },
  {
    id: 'purple',
    name: 'Deep Royal Purple',
    sidebarColor: '#6f42c1',
    sidebarGradient: 'linear-gradient(180deg, #6f42c1 10%, #4e229e 100%)',
    topbarColor: '#ffffff',
    bodyColor: '#f9f6fc',
    footerColor: '#ffffff'
  },
  {
    id: 'crimson',
    name: 'Crimson Sports Red',
    sidebarColor: '#e74a3b',
    sidebarGradient: 'linear-gradient(180deg, #e74a3b 10%, #be2617 100%)',
    topbarColor: '#ffffff',
    bodyColor: '#fff8f8',
    footerColor: '#ffffff'
  },
  {
    id: 'cyan',
    name: 'Cyan Teal Ocean',
    sidebarColor: '#36b9cc',
    sidebarGradient: 'linear-gradient(180deg, #36b9cc 10%, #258391 100%)',
    topbarColor: '#ffffff',
    bodyColor: '#f5fbfc',
    footerColor: '#ffffff'
  },
  {
    id: 'dark',
    name: 'Obsidian Slate Dark Mode',
    sidebarColor: '#1e293b',
    sidebarGradient: 'linear-gradient(180deg, #1e293b 10%, #0f172a 100%)',
    topbarColor: '#1e293b',
    bodyColor: '#0f172a',
    footerColor: '#1e293b'
  }
];

export const getSavedTheme = () => {
  try {
    const raw = localStorage.getItem('chhabra_admin_theme');
    if (raw) {
      return { ...DEFAULT_THEME, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to parse admin theme from localStorage:', e);
  }
  return DEFAULT_THEME;
};

export const applyAdminTheme = (theme = DEFAULT_THEME) => {
  const root = document.documentElement;
  const targetTheme = { ...DEFAULT_THEME, ...theme };

  // Set CSS Variables
  const sidebarGrad = targetTheme.sidebarGradient || `linear-gradient(180deg, ${targetTheme.sidebarColor} 10%, #1a2f6c 100%)`;
  root.style.setProperty('--admin-sidebar-gradient', sidebarGrad);
  root.style.setProperty('--admin-sidebar-bg', targetTheme.sidebarColor);
  root.style.setProperty('--admin-topbar-bg', targetTheme.topbarColor);
  root.style.setProperty('--admin-body-bg', targetTheme.bodyColor);
  root.style.setProperty('--admin-footer-bg', targetTheme.footerColor);
};

export const saveAdminTheme = (theme) => {
  try {
    localStorage.setItem('chhabra_admin_theme', JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save admin theme to localStorage:', e);
  }
  applyAdminTheme(theme);
};

export const resetAdminTheme = () => {
  localStorage.removeItem('chhabra_admin_theme');
  applyAdminTheme(DEFAULT_THEME);
  return DEFAULT_THEME;
};
