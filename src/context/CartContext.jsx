import React, { createContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper to calculate totals from items list
  const calculateTotals = (items) => {
    let totalQty = 0;
    let totalAmt = 0;
    items.forEach((it) => {
      const q = it.quantity || 1;
      const p = it.price || 0;
      totalQty += q;
      totalAmt += q * p;
    });
    return { totalQty, totalAmt };
  };

  // Helper to load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const raw = localStorage.getItem('guest_cart');
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          const { totalQty, totalAmt } = calculateTotals(items);
          setCartItems(items);
          setCartCount(totalQty);
          setSubtotal(totalAmt);
          return items;
        }
      }
    } catch (e) {
      console.error('Error loading guest cart:', e);
    }
    setCartItems([]);
    setCartCount(0);
    setSubtotal(0);
    return [];
  };

  // Fetch cart items from Express Backend (or load guest cart if not logged in)
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token || token === 'undefined' || token === 'null') {
      loadGuestCart();
      return;
    }

    try {
      // Sync any guest cart items first
      const rawGuest = localStorage.getItem('guest_cart');
      if (rawGuest) {
        try {
          const guestItems = JSON.parse(rawGuest);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            for (const item of guestItems) {
              await API.post('/cart', {
                productId: item.productId,
                quantity: item.quantity,
                variantId: item.variantId || null
              }).catch(() => {});
            }
            localStorage.removeItem('guest_cart');
          }
        } catch (e) {
          console.error('Error syncing guest cart:', e);
        }
      }

      const res = await API.get('/cart');
      if (res.data.success) {
        setCartItems(res.data.data.items || []);
        setCartCount(res.data.data.totalItems || 0);
        setSubtotal(res.data.data.subtotal || 0);
      }
    } catch (error) {
      console.log('Cart fetch notice: Falling back to guest cart');
      loadGuestCart();
    }
  }, []);

  useEffect(() => {
    fetchCart();

    const handleStorageChange = () => {
      fetchCart();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, variantId = null, productObj = null) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    const token = localStorage.getItem('userToken');

    // 1. If user is logged in, save to backend API
    if (token && token !== 'undefined' && token !== 'null') {
      try {
        const payload = { productId: parseInt(productId), quantity: qty };
        if (variantId) payload.variantId = parseInt(variantId);
        const res = await API.post('/cart', payload);
        if (res.data.success) {
          await fetchCart();
          setIsDrawerOpen(true);
        }
        return res.data;
      } catch (error) {
        const msg = error.response?.data?.message || 'Cart me add nahi ho saka!';
        alert(msg);
        return { success: false, message: msg };
      }
    }

    // 2. Guest User Flow: Save to localStorage guest cart
    try {
      let product = productObj;
      if (!product || String(product.id) !== String(productId)) {
        try {
          const res = await API.get(`/products/${productId}`);
          if (res.data.success) {
            product = res.data.data;
          }
        } catch (e) {
          console.error('Failed to fetch product details for guest cart', e);
        }
      }

      let variant = null;
      if (variantId && product?.variants?.length > 0) {
        variant = product.variants.find((v) => String(v.id) === String(variantId)) || null;
      }

      const effectivePrice = variant ? variant.price : (product?.price || 0);
      const effectiveMrp = variant?.mrp || product?.mrp || null;
      const effectiveStock = variant ? (variant.stock ?? 10) : (product?.stock ?? 25);
      const effectiveName = product?.name || 'Sports Item';
      const effectiveImage = variant?.imageUrl || (product?.imageUrl) || (Array.isArray(product?.images) ? product.images[0] : null);

      let currentGuestCart = [];
      try {
        const raw = localStorage.getItem('guest_cart');
        if (raw) currentGuestCart = JSON.parse(raw);
        if (!Array.isArray(currentGuestCart)) currentGuestCart = [];
      } catch (e) {
        currentGuestCart = [];
      }

      const existingIndex = currentGuestCart.findIndex((item) => {
        return (
          String(item.productId) === String(productId) &&
          String(item.variantId || '') === String(variantId || '')
        );
      });

      if (existingIndex > -1) {
        const newQty = currentGuestCart[existingIndex].quantity + qty;
        if (newQty > effectiveStock) {
          alert(`Stock limit exceeded! Is item ka sirf ${effectiveStock} quantity available hai.`);
          return { success: false };
        }
        currentGuestCart[existingIndex].quantity = newQty;
        currentGuestCart[existingIndex].itemTotal = newQty * currentGuestCart[existingIndex].price;
      } else {
        if (qty > effectiveStock) {
          alert(`Stock limit exceeded! Is item ka sirf ${effectiveStock} quantity available hai.`);
          return { success: false };
        }
        currentGuestCart.push({
          id: `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          productId: parseInt(productId),
          variantId: variantId ? parseInt(variantId) : null,
          variantTitle: variant ? (variant.title || variant.name) : null,
          productName: effectiveName,
          productImage: effectiveImage,
          price: effectivePrice,
          mrp: effectiveMrp,
          quantity: qty,
          stockAvailable: effectiveStock,
          itemTotal: qty * effectivePrice
        });
      }

      localStorage.setItem('guest_cart', JSON.stringify(currentGuestCart));
      const { totalQty, totalAmt } = calculateTotals(currentGuestCart);
      setCartItems(currentGuestCart);
      setCartCount(totalQty);
      setSubtotal(totalAmt);
      setIsDrawerOpen(true);
      return { success: true };
    } catch (err) {
      console.error('Guest cart add error:', err);
      alert('Cart me item add karte waqt samasya aayi.');
      return { success: false };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    const token = localStorage.getItem('userToken');

    if (token && token !== 'undefined' && token !== 'null') {
      try {
        const res = await API.put(`/cart/${itemId}`, { quantity: qty });
        if (res.data.success) {
          await fetchCart();
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Quantity update error');
      }
      return;
    }

    // Guest Cart update
    try {
      const raw = localStorage.getItem('guest_cart');
      if (raw) {
        let items = JSON.parse(raw);
        items = items.map((it) => {
          if (String(it.id) === String(itemId)) {
            const finalQty = Math.min(qty, it.stockAvailable || 99);
            return {
              ...it,
              quantity: finalQty,
              itemTotal: finalQty * it.price
            };
          }
          return it;
        });
        localStorage.setItem('guest_cart', JSON.stringify(items));
        const { totalQty, totalAmt } = calculateTotals(items);
        setCartItems(items);
        setCartCount(totalQty);
        setSubtotal(totalAmt);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = async (itemId) => {
    const token = localStorage.getItem('userToken');

    if (token && token !== 'undefined' && token !== 'null') {
      try {
        const res = await API.delete(`/cart/${itemId}`);
        if (res.data.success) {
          await fetchCart();
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    // Guest Cart remove
    try {
      const raw = localStorage.getItem('guest_cart');
      if (raw) {
        let items = JSON.parse(raw);
        items = items.filter((it) => String(it.id) !== String(itemId));
        localStorage.setItem('guest_cart', JSON.stringify(items));
        const { totalQty, totalAmt } = calculateTotals(items);
        setCartItems(items);
        setCartCount(totalQty);
        setSubtotal(totalAmt);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = () => {
    localStorage.removeItem('guest_cart');
    setCartItems([]);
    setCartCount(0);
    setSubtotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isDrawerOpen,
        setIsDrawerOpen,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
