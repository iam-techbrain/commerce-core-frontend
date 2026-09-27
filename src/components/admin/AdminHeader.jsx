import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Menu,
  Search,
  Bell,
  Mail,
  ListTodo,
  ExternalLink,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react';

const AdminHeader = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="admin-topbar">
      {/* Left: Hamburger Toggle & Search Bar */}
      <div className="admin-topbar-left">
        <button
          className="admin-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Menu"
          title="Toggle Sidebar Menu"
        >
          <Menu size={20} />
        </button>

        <div className="admin-search-wrapper">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search products, orders, SKU..."
          />
        </div>
      </div>

      {/* Right: Notifications, Storefront Shortcut & User Profile */}
      <div className="admin-topbar-right">
        {/* View Customer Store Pill */}
        <NavLink
          to="/"
          className="admin-action-pill"
          title="Open live customer store"
        >
          <ExternalLink size={15} />
          <span>Live Store</span>
        </NavLink>

        {/* Notifications Icon with Badge */}
        <button
          className="admin-icon-badge-btn"
          title="System Notifications (3 Low Stock / Orders)"
        >
          <Bell size={18} />
          <span className="admin-count-badge">3+</span>
        </button>

        {/* Settings Shortcut Icon */}
        <NavLink
          to="/admin/settings"
          className="admin-icon-badge-btn"
          title="Console Settings & Theme Customizer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Settings size={18} />
        </NavLink>

        {/* Messages Icon */}
        <button
          className="admin-icon-badge-btn"
          title="Support Messages"
          style={{ display: 'none' }}
        >
          <Mail size={18} />
          <span className="admin-count-badge" style={{ background: '#36b9cc' }}>2</span>
        </button>

        {/* User Profile Pill */}
        {user && (
          <div className="admin-profile-pill" onClick={logout} title="Click to Logout">
            <div className="admin-profile-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-profile-info">
              <span className="admin-profile-name">{user.username}</span>
              <span className="admin-profile-role">Super Admin</span>
            </div>
            <LogOut size={15} style={{ color: '#e74a3b', marginLeft: '4px' }} />
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
