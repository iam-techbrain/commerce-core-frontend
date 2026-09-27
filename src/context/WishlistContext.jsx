import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Load wishlist from backend if logged in, or from localStorage for guest
  const fetchWishlist = async () => {
    if (user) {
      setLoading(true);
      try {
        const res = await API.get('/wishlist');
        if (res.data.success) {
          const items = res.data.data || [];
          setWishlistItems(items);
          setWishlistIds(new Set(items.map((item) => item.productId || item.product?.id || item.id)));
        }
      } catch (err) {
        console.error('Wishlist fetch error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest localStorage fallback
      try {
        const local = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
        setWishlistItems(local);
        setWishlistIds(new Set(local.map((item) => item.id || item.productId)));
      } catch (e) {
        setWishlistItems([]);
        setWishlistIds(new Set());
      }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  // Toggle wishlist item
  const toggleWishlist = async (product) => {
    if (!product) return;
    const productId = product.id;

    if (user) {
      try {
        const res = await API.post('/wishlist/toggle', { productId });
        if (res.data.success) {
          await fetchWishlist();
        }
      } catch (err) {
        console.error('Toggle wishlist error:', err);
      }
    } else {
      // Guest mode
      const exists = wishlistIds.has(productId);
      let updated;
      if (exists) {
        updated = wishlistItems.filter((i) => (i.id || i.productId) !== productId);
      } else {
        updated = [...wishlistItems, { id: productId, productId, product }];
      }
      setWishlistItems(updated);
      setWishlistIds(new Set(updated.map((i) => i.id || i.productId)));
      localStorage.setItem('guest_wishlist', JSON.stringify(updated));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        fetchWishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
