import React from 'react';

const AdminFooter = () => {
  return (
    <footer style={{
      background: 'var(--admin-footer-bg, #ffffff)',
      borderTop: '1px solid var(--admin-border, #e3e6f0)',
      padding: '16px 32px',
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.8rem',
      color: 'var(--admin-text-muted, #858796)',
      transition: 'background-color 0.3s ease'
    }}>
      <div>&copy; {new Date().getFullYear()} Chhabra Sports Admin System v2.0</div>
      <div>Status: <span style={{ color: '#1cc88a', fontWeight: 600 }}>● All Systems Operational</span></div>
    </footer>
  );
};

export default AdminFooter;
