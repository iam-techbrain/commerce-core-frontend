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
  const defaultFallback = fallback || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600';
  if (!url) return defaultFallback;
  if (typeof url !== 'string') return defaultFallback;

  // If already full http(s) URL
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const host = getApiHost();
  return `${host}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const parseProductImages = (product, fallback) => {
  const defaultFallback = fallback || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600';
  if (!product) return [defaultFallback];

  let rawList = [];

  // Case 1: Array
  if (Array.isArray(product.images)) {
    rawList = product.images;
  } 
  // Case 2: String (JSON string or comma-separated string)
  else if (typeof product.images === 'string' && product.images.trim()) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (typeof parsed === 'string') {
        rawList = parsed.split(',').map((s) => s.trim());
      }
    } catch (e) {
      if (product.images.includes(',')) {
        rawList = product.images.split(',').map((s) => s.trim());
      } else {
        rawList = [product.images.trim()];
      }
    }
  }

  // Case 3: Fallback to single product.imageUrl
  if (rawList.length === 0 && product.imageUrl) {
    rawList = [product.imageUrl];
  }

  const result = rawList
    .filter((img) => img && typeof img === 'string' && img.trim() !== '')
    .map((img) => getImageUrl(img, defaultFallback));

  return result.length > 0 ? result : [defaultFallback];
};
