import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch cart items from Express Backend
  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      if (res.data.success) {
        setCartItems(res.data.data.items || []);
        setCartCount(res.data.data.totalItems || 0);
        setSubtotal(res.data.data.subtotal || 0);
      }
    } catch (error) {
      console.log('Cart fetch notice: Login to fetch cart');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    try {
      const payload = { productId, quantity };
      if (variantId) payload.variantId = variantId;
      const res = await API.post('/cart', payload);
      if (res.data.success) {
        await fetchCart();
        setIsDrawerOpen(true); // Auto-open cart drawer on add
      }
      return res.data;
    } catch (error) {
      alert(error.response?.data?.message || 'Cart me add nahi ho saka!');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await API.put(`/cart/${itemId}`, { quantity });
      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Quantity update error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await API.delete(`/cart/${itemId}`);
      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = () => {
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
