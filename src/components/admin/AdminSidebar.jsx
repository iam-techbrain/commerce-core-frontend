import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, Tag, ShoppingCart, ArrowLeft } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside style={{
      width: '240px',
      background: 'var(--card-bg)',
      borderRight: '1px solid var(--card-border)',
      padding: '24px 16px',
      borderRadius: '16px',
      height: 'fit-content'
    }}>
      <div style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Navigation
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Package size={18} />
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin/categories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Layers size={18} />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/admin/brands" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Tag size={18} />
          <span>Brands</span>
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={18} />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/" className="nav-item" style={{ marginTop: '24px', color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} />
          <span>Back to Store</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
