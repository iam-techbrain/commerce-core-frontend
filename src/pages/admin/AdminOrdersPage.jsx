import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { ShoppingCart, Home, ChevronRight, Package, CheckCircle2 } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/admin/all');
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        alert(`Order status updated to "${newStatus}"!`);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update error');
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* Admin Page Header with Breadcrumb */}
        <div className="admin-page-header">
          <div className="admin-page-title-group">
            <h1>Customer Orders</h1>
            <p>Track real-time purchases, update fulfillment statuses, and manage deliveries.</p>
          </div>

          <div className="admin-breadcrumb">
            <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} />
              <span>Home</span>
            </NavLink>
            <ChevronRight size={12} style={{ opacity: 0.5 }} />
            <span>Orders</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <ShoppingCart size={20} color="var(--admin-primary)" />
              <span>All Orders ({orders.length})</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
              Live customer checkout records
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Loading orders...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Order Status Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '28px', color: 'var(--admin-text-muted)' }}>
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>
                          #{o.orderNumber}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{o.user?.username || 'Customer'}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{o.user?.email}</span>
                        </td>
                        <td style={{ fontWeight: 800, color: '#1e293b' }}>
                          ₹{o.finalAmount?.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: o.paymentStatus === 'PAID' ? 'rgba(28, 200, 138, 0.15)' : 'rgba(231, 74, 59, 0.15)',
                            color: o.paymentStatus === 'PAID' ? '#1cc88a' : '#e74a3b'
                          }}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-control"
                            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem', borderRadius: '6px' }}
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
