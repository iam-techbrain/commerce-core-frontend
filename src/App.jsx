import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/common/Layout';

// 🛍️ CUSTOMER DEDICATED PAGES
import HomePage from './pages/customer/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

// 👑 ADMIN DEDICATED PAGES
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminBrandsPage from './pages/admin/AdminBrandsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

import ProtectedRoute from './components/common/ProtectedRoute';
import CartDrawer from './components/cart/CartDrawer';
import Preloader from './components/common/Preloader';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {/* Smooth Brand Preloader Screen */}
          <Preloader />
          <Router>
            <Routes>
              {/* 🛍️ Customer Routes (Wrapped in Customer Layout) */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
              <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
              <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
              <Route path="/login" element={<Layout><LoginPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              <Route path="/wishlist" element={<Layout><ProfilePage /></Layout>} />

              {/* 👑 Dedicated Admin Authentication & Management Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute requiredRole="ADMIN"><AdminProductsPage /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute requiredRole="ADMIN"><AdminCategoriesPage /></ProtectedRoute>} />
              <Route path="/admin/brands" element={<ProtectedRoute requiredRole="ADMIN"><AdminBrandsPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute requiredRole="ADMIN"><AdminOrdersPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><AdminUsersPage /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requiredRole="ADMIN"><AdminSettingsPage /></ProtectedRoute>} />
            </Routes>

            {/* Global Cart Slide-Over Drawer */}
            <CartDrawer />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
