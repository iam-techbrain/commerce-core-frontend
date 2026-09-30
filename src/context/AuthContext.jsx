import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attach stored gender preference and avatar
  const attachGenderAndAvatar = (userData) => {
    if (!userData) return null;
    const savedGender = userData.gender || localStorage.getItem(`user_gender_${userData.id}`) || 'male';
    const savedAvatar = userData.avatar || localStorage.getItem(`user_avatar_${userData.id}`) || null;
    return { ...userData, gender: savedGender, avatar: savedAvatar };
  };

  // Check user token on startup
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token && token !== 'undefined') {
      API.get('/auth/profile')
        .then((res) => {
          if (res.data.success) {
            const rawUser = res.data.data || res.data.user;
            setUser(attachGenderAndAvatar(rawUser));
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
      const token = res.data.data?.token || res.data.token;
      const userData = res.data.data?.user || res.data.user;

      if (token) {
        localStorage.setItem('userToken', token);
        setUser(attachGenderAndAvatar(userData));
        window.dispatchEvent(new Event('storage'));
      }
    }
    return res.data;
  };

  const updateGender = async (newGender) => {
    if (user) {
      localStorage.setItem(`user_gender_${user.id}`, newGender);
      setUser((prev) => ({ ...prev, gender: newGender }));
      try {
        await API.put(`/users/${user.id}`, { gender: newGender });
      } catch (err) {
        console.error('Failed to sync gender to backend:', err);
      }
    }
  };

  const updateAvatar = async (newAvatar) => {
    if (user) {
      localStorage.setItem(`user_avatar_${user.id}`, newAvatar);
      setUser((prev) => ({ ...prev, avatar: newAvatar }));
      try {
        await API.put(`/users/${user.id}`, { avatar: newAvatar });
      } catch (err) {
        console.error('Failed to sync avatar to backend:', err);
      }
    }
  };

  const updateProfile = async (updateData) => {
    if (!user) return { success: false, message: 'User not logged in' };
    const res = await API.put(`/users/${user.id}`, updateData);
    if (res.data.success) {
      const updated = res.data.data;
      if (updated.gender) localStorage.setItem(`user_gender_${user.id}`, updated.gender);
      if (updated.avatar !== undefined) {
        if (updated.avatar) localStorage.setItem(`user_avatar_${user.id}`, updated.avatar);
        else localStorage.removeItem(`user_avatar_${user.id}`);
      }
      setUser((prev) => ({ ...prev, ...updated }));
    }
    return res.data;
  };

  const register = async (username, email, password, role = 'CUSTOMER', gender = 'male', phone = '') => {
    const res = await API.post('/auth/register', { username, email, password, role, gender, phone });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, updateGender, updateAvatar, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
