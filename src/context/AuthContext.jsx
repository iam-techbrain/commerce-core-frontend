import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user token on startup
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token && token !== 'undefined') {
      API.get('/auth/profile')
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data || res.data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('userToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      // 🟢 Fixed: Extract token from res.data.data.token (Unified API Response Format)
      const token = res.data.data?.token || res.data.token;
      const userData = res.data.data?.user || res.data.user;

      if (token) {
        localStorage.setItem('userToken', token);
        setUser(userData);
      }
    }
    return res.data;
  };

  const register = async (username, email, password, role = 'CUSTOMER') => {
    const res = await API.post('/auth/register', { username, email, password, role });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
