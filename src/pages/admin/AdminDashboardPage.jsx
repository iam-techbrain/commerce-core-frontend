import React from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminStatCard from '../../components/admin/AdminStatCard';
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  Home,
  ChevronRight,
  TrendingUp,
  Package,
  Layers
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { data: analytics, isLoading: loading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await API.get('/dashboard/analytics');
      return res.data?.success ? res.data.data : null;
    },
    refetchInterval: 30000, // Refresh metrics every 30 seconds
  });

  return (
    <AdminLayout>
      <div>
        {/* Admin Page Header with Breadcrumb */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1>Dashboard</h1>
            <p>Welcome back to Chhabra Sports store control center</p>
          </div>

          <div className="admin-breadcrumb">
            <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} />
              <span>Home</span>
            </NavLink>
            <ChevronRight size={12} style={{ opacity: 0.5 }} />
            <span>Dashboard</span>
          </div>
        </div>

        {loading ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--admin-text-muted)' }}>Loading analytics dashboard...</p>
          </div>
        ) : !analytics ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--admin-text-muted)' }}>Analytics dataset currently unavailable.</p>
          </div>
        ) : (
          <div>
            {/* 4 Stat Cards Grid (Exact Admin Style) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <AdminStatCard
                title="Earnings (Total)"
                value={`₹${analytics.overview.totalRevenue?.toLocaleString('en-IN') || 0}`}
                icon={DollarSign}
                type="primary"
                change="+18.4% this month"
              />
              <AdminStatCard
                title="Total Sales"
                value={analytics.overview.totalOrders || 0}
                icon={ShoppingCart}
                type="success"
                change="+12% since last week"
              />
              <AdminStatCard
                title="Registered Users"
                value={analytics.overview.totalUsers || 0}
                icon={Users}
                type="info"
                change="+20.4% new signups"
              />
              <AdminStatCard
                title="Low Stock Items"
                value={analytics.overview.lowStockProductsCount || 0}
                icon={AlertTriangle}
                type="warning"
                change="Requires restocking"
              />
            </div>

            {/* Recent Orders Table Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">
                  <ShoppingCart size={18} color="var(--admin-primary)" />
                  <span>Recent Customer Orders</span>
                </h3>
                <NavLink
                  to="/admin/orders"
                  className="btn-outline"
                  style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '20px' }}
                >
                  View All Orders →
                </NavLink>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Payment Status</th>
                      <th>Order Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--admin-text-muted)' }}>
                          No recent orders found.
                        </td>
                      </tr>
                    ) : (
                      analytics.recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>
                            #{order.orderNumber}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {order.user?.username || 'Customer'}
                          </td>
                          <td style={{ fontWeight: 800, color: '#1e293b' }}>
                            ₹{order.finalAmount?.toLocaleString('en-IN')}
                          </td>
                          <td>
                            <span
                              style={{
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                background: order.paymentStatus === 'PAID' ? 'rgba(28, 200, 138, 0.15)' : 'rgba(231, 74, 59, 0.15)',
                                color: order.paymentStatus === 'PAID' ? '#1cc88a' : '#e74a3b'
                              }}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
