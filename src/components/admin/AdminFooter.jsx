import React from 'react';

const AdminFooter = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--card-border)',
      padding: '16px 32px',
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.8rem',
      color: 'var(--text-muted)'
    }}>
      <div>&copy; {new Date().getFullYear()} SaaS E-Commerce Admin System v2.0</div>
      <div>Status: <span style={{ color: '#10b981', fontWeight: 600 }}>● All Systems Operational</span></div>
    </footer>
  );
};

export default AdminFooter;
