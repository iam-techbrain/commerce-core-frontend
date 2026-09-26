import React from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Admin Dedicated Top Navbar */}
      <AdminHeader />

      {/* Admin Content Area (Sidebar + Main Content) */}
      <div className="container" style={{ flex: 1, display: 'flex', gap: '32px', paddingBottom: '32px' }}>
        <AdminSidebar />
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>

      {/* Admin Dedicated Footer */}
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
