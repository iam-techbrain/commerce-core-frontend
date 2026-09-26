import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react';

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/analytics')
      .then((res) => {
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div>
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <h1 className="section-title">Store Sales & Revenue Analytics</h1>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
        ) : !analytics ? (
          <p style={{ color: 'var(--text-muted)' }}>Analytics dataset unavailable.</p>
        ) : (
          <div>
            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <AdminStatCard title="Total Revenue" value={`₹${analytics.overview.totalRevenue}`} icon={DollarSign} color="99, 102, 241" />
              <AdminStatCard title="Total Orders" value={analytics.overview.totalOrders} icon={ShoppingCart} color="6, 182, 212" />
              <AdminStatCard title="Total Customers" value={analytics.overview.totalUsers} icon={Users} color="16, 185, 129" />
              <AdminStatCard title="Low Stock Items" value={analytics.overview.lowStockProductsCount} icon={AlertTriangle} color="239, 68, 68" />
            </div>

            {/* Recent Orders Table */}
            <div className="profile-card">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Recent Customer Orders</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px' }}>Order #</th>
                    <th style={{ padding: '12px' }}>Customer</th>
                    <th style={{ padding: '12px' }}>Amount</th>
                    <th style={{ padding: '12px' }}>Payment Status</th>
                    <th style={{ padding: '12px' }}>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>#{order.orderNumber}</td>
                      <td style={{ padding: '12px' }}>{order.user?.username || 'Customer'}</td>
                      <td style={{ padding: '12px', color: 'var(--secondary)', fontWeight: 700 }}>₹{order.finalAmount}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '99px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: order.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: order.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{order.orderStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
