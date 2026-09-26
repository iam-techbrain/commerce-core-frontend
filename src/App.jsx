import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/common/Layout';

// 🛍️ CUSTOMER DEDICATED PAGES
import HomePage from './pages/customer/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

// 👑 ADMIN DEDICATED PAGES
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminBrandsPage from './pages/admin/AdminBrandsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

import ProtectedRoute from './components/common/ProtectedRoute';
import CartDrawer from './components/cart/CartDrawer';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* 🛍️ Customer Routes (Wrapped in Customer Layout) */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

            {/* 👑 Dedicated Admin Routes (Protected + Dedicated Admin Layout) */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute requiredRole="ADMIN"><AdminProductsPage /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute requiredRole="ADMIN"><AdminCategoriesPage /></ProtectedRoute>} />
            <Route path="/admin/brands" element={<ProtectedRoute requiredRole="ADMIN"><AdminBrandsPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute requiredRole="ADMIN"><AdminOrdersPage /></ProtectedRoute>} />
          </Routes>

          {/* Global Cart Slide-Over Drawer */}
          <CartDrawer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
