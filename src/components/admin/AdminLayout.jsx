import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';
import { getSavedTheme, applyAdminTheme } from '../../utils/themeManager';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Apply saved theme colors on startup
  useEffect(() => {
    applyAdminTheme(getSavedTheme());
  }, []);

  // Automatically close mobile sidebar on route transition
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 992) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="admin-app-wrapper">
      {/* Mobile Drawer Overlay Backdrop */}
      <div
        className={`admin-backdrop ${mobileSidebarOpen ? 'active' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Modern Left Sidebar (Admin / Metronic Style) */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container: Topbar + Page Content + Footer */}
      <div className="admin-main-wrapper">
        <AdminHeader onToggleSidebar={handleToggleSidebar} />

        <main className="admin-content-container">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
