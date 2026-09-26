import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { ShoppingCart } from 'lucide-react';

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
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <h1 className="section-title">Manage Customer Orders</h1>
        </div>

        <div className="profile-card">
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px' }}>Order #</th>
                  <th style={{ padding: '12px' }}>Customer</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Payment</th>
                  <th style={{ padding: '12px' }}>Order Status Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>#{o.orderNumber}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600 }}>{o.user?.username || 'Customer'}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.user?.email}</span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--secondary)', fontWeight: 700 }}>₹{o.finalAmount}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: o.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: o.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        className="form-control"
                        style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
