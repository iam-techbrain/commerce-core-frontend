import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingCart,
  ExternalLink,
  LogOut,
  X,
  ChevronRight,
  Shield,
  Sparkles,
  Settings,
  Users
} from 'lucide-react';

const AdminSidebar = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="admin-sidebar-brand">
        <NavLink to="/admin/dashboard" className="admin-brand-content" style={{ textDecoration: 'none' }}>
          <div className="admin-brand-icon">
            <Shield size={22} />
          </div>
          <div className="admin-brand-text">
            Chhabra Sports
          </div>
        </NavLink>

        <button
          className="admin-sidebar-close-btn"
          onClick={onCloseMobile}
          aria-label="Close sidebar drawer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="admin-sidebar-nav">
        {/* Section: MAIN */}
        <div className="admin-sidebar-heading">Main</div>

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title="Dashboard"
        >
          <div className="admin-nav-item-inner">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </div>
          <ChevronRight size={14} className="admin-nav-arrow" style={{ opacity: 0.6 }} />
        </NavLink>

        {/* Section: CATALOG & INVENTORY */}
        <div className="admin-sidebar-heading">Catalog & Inventory</div>

        <NavLink
          to="/admin/products"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title="Products & Variants"
        >
          <div className="admin-nav-item-inner">
            <Package size={19} />
            <span>Products</span>
          </div>
          <ChevronRight size={14} className="admin-nav-arrow" style={{ opacity: 0.6 }} />
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title="Categories"
        >
          <div className="admin-nav-item-inner">
            <Layers size={19} />
            <span>Categories</span>
          </div>
          <ChevronRight size={14} className="admin-nav-arrow" style={{ opacity: 0.6 }} />
        </NavLink>

        <NavLink
          to="/admin/brands"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title="Brands"
        >
          <div className="admin-nav-item-inner">
            <Tag size={19} />
            <span>Brands</span>
          </div>
          <ChevronRight size={14} className="admin-nav-arrow" style={{ opacity: 0.6 }} />
        </NavLink>

        {/* Section: SALES & ORDERS */}
        <div className="admin-sidebar-heading">Sales & Orders</div>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title="Customer Orders"
        >
          <div className="admin-nav-item-inner">
            <ShoppingCart size={19} />
            <span>Orders</span>
          </div>
          <span className="admin-nav-badge" style={{ background: '#1cc88a', color: '#ffffff' }}>
            Live
          </span>
        </NavLink>

        {/* Section: USERS & CUSTOMERS */}
        <div className="admin-sidebar-heading">Users & Community</div>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title="Users & Gender Management"
        >
          <div className="admin-nav-item-inner">
            <Users size={19} />
            <span>Users</span>
          </div>
          <ChevronRight size={14} className="admin-nav-arrow" style={{ opacity: 0.6 }} />
        </NavLink>

        {/* Section: SYSTEM & PREFERENCES */}
        <div className="admin-sidebar-heading">System & Config</div>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title="Admin Settings"
        >
          <div className="admin-nav-item-inner">
            <Settings size={19} />
            <span>Settings</span>
          </div>
          <ChevronRight size={14} className="admin-nav-arrow" style={{ opacity: 0.6 }} />
        </NavLink>
      </nav>

      {/* Sidebar Footer User Card */}
      {user && (
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                {user.username}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                System SuperAdmin
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout Admin"
            style={{
              background: 'rgba(231, 74, 59, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              color: '#ff6b6b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
