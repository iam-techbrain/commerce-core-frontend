export const getApiHost = () => {
  if (import.meta.env.VITE_API_HOST) {
    return import.meta.env.VITE_API_HOST;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const getImageUrl = (url, fallback) => {
  if (!url) return fallback || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const host = getApiHost();
  return `${host}${url.startsWith('/') ? '' : '/'}${url}`;
};
