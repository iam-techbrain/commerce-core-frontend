import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Shield, ExternalLink, LogOut, User, Bell } from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{
      background: 'var(--card-bg)',
      borderBottom: '1px solid var(--card-border)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    }}>
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(99, 102, 241, 0.15)',
          color: '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Shield size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Store Admin Console
            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
              LIVE
            </span>
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Control panel for orders, catalog & system settings</span>
        </div>
      </div>

      {/* Admin Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Back to Customer Store Button */}
        <NavLink 
          to="/" 
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          <ExternalLink size={16} />
          <span>View Customer Store</span>
        </NavLink>

        {/* Logged in Admin badge & Logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--card-border)', paddingLeft: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.username}</div>
              <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>System Admin</div>
            </div>
            <button 
              onClick={logout} 
              className="icon-btn" 
              title="Logout Admin" 
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
