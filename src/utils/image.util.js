export const getApiHost = () => {
  if (import.meta.env.VITE_API_HOST) {
    return import.meta.env.VITE_API_HOST;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const CATEGORY_SPORTS_IMAGES = {
  'badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=700&q=80&auto=format&fit=crop',
  'cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=700&q=80&auto=format&fit=crop',
  'lawn tennis': 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=700&q=80&auto=format&fit=crop',
  'tennis': 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=700&q=80&auto=format&fit=crop',
  'pickleball': 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=700&q=80&auto=format&fit=crop',
  'fitness': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&q=80&auto=format&fit=crop',
  'gym': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&q=80&auto=format&fit=crop',
  'clothing': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&q=80&auto=format&fit=crop',
  'apparel': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&q=80&auto=format&fit=crop',
  'general sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&q=80&auto=format&fit=crop',
  'football': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=700&q=80&auto=format&fit=crop',
  'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80&auto=format&fit=crop',
  'table tennis': 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=700&q=80&auto=format&fit=crop',
  'squash': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=700&q=80&auto=format&fit=crop'
};

export const getCategoryFallbackImage = (categoryName) => {
  if (!categoryName || typeof categoryName !== 'string') {
    return CATEGORY_SPORTS_IMAGES['general sports'];
  }
  const lower = categoryName.trim().toLowerCase();
  for (const [key, img] of Object.entries(CATEGORY_SPORTS_IMAGES)) {
    if (lower.includes(key)) return img;
  }
  return CATEGORY_SPORTS_IMAGES['general sports'];
};

export const getImageUrl = (url, fallback, categoryName) => {
  const defaultFallback = fallback || (categoryName ? getCategoryFallbackImage(categoryName) : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600');
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
