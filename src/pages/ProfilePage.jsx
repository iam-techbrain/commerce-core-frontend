import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, MapPin, Package, Download, LogOut, Plus, ShieldCheck, Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses'
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersRes, addressRes] = await Promise.all([
          API.get('/orders/my-orders'),
          API.get('/addresses')
        ]);

        if (ordersRes.data.success) setOrders(ordersRes.data.data || []);
        if (addressRes.data.success) setAddresses(addressRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/addresses', {
        fullName, phone, addressLine1, city, state, pincode, isDefault: addresses.length === 0
      });
      if (res.data.success) {
        setAddresses([res.data.data, ...addresses]);
        setShowAddressForm(false);
        setFullName(''); setPhone(''); setAddressLine1(''); setCity(''); setState(''); setPincode('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Address save error!');
    }
  };

  const downloadInvoice = async (orderId, orderNumber) => {
    try {
      const res = await API.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Invoice download failed!');
    }
  };

  if (!user) return null;

  return (
    <div className="wrap" style={{ padding: '50px 32px' }}>
      {/* Page Header */}
      <div className="sec-head" style={{ marginBottom: '32px' }}>
        <div>
          <span className="eyebrow">Customer Account Console</span>
          <h1 className="display" style={{ fontSize: '36px', color: 'var(--pitch)', marginTop: '6px' }}>
            My Account & Orders
          </h1>
        </div>
      </div>

      <div className="profile-grid">
        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <div className="avatar">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '4px' }}>{user.username}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>{user.email}</p>

          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '0.75rem',
            fontWeight: 800,
            background: 'rgba(99, 102, 241, 0.2)',
            color: 'var(--primary)',
            marginBottom: '24px'
          }}>
            {user.role || 'CUSTOMER'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className={`pill ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px' }}
            >
              <Package size={18} />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              className={`pill ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px' }}
            >
              <MapPin size={18} />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              className="btn-secondary"
              onClick={logout}
              style={{ justifyContent: 'center', width: '100%', marginTop: '20px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut size={18} />
              <span>Logout Account</span>
            </button>
          </div>
        </div>

        {/* Main Profile Content Area */}
        <div>
          {/* TAB 1: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '24px' }}>Order History</h2>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading Orders...</div>
              ) : orders.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '48px' }}>
                  <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Aapne abhi tak koi order place nahi kiya.</p>
                  <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/products')}>
                    Browse Products
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="profile-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Reference</span>
                        <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '2px' }}>#{order.orderNumber}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '99px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          background: order.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: order.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--danger)',
                          border: `1px solid ${order.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                          {order.paymentStatus === 'PAID' ? '✓ PAID' : 'PENDING'}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
                          <img
                            src={item.product?.imageUrl ? `http://localhost:5000${item.product.imageUrl}` : 'https://via.placeholder.com/50'}
                            alt={item.product?.name}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.product?.name || 'Product'}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity} x ₹{item.unitPrice}</p>
                          </div>
                          <strong style={{ fontSize: '1rem', color: 'var(--secondary)' }}>₹{item.totalPrice}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount: </span>
                        <strong style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginLeft: '6px' }}>₹{order.finalAmount}</strong>
                      </div>
                      <button
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        onClick={() => downloadInvoice(order.id, order.orderNumber)}
                      >
                        <Download size={16} /> PDF Invoice
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Saved Shipping Addresses</h2>
                <button className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.9rem' }} onClick={() => setShowAddressForm(!showAddressForm)}>
                  <Plus size={18} /> Add New Address
                </button>
              </div>

              {showAddressForm && (
                <div className="profile-card" style={{ marginBottom: '28px', border: '1px solid var(--primary-glow)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>Add Shipping Address</h3>
                  <form onSubmit={handleAddAddress}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input className="form-control" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input className="form-control" placeholder="9876543210" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label>Address Line 1</label>
                      <input className="form-control" placeholder="Flat / House No., Street, Area" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div className="form-group">
                        <label>City</label>
                        <input className="form-control" placeholder="City" required value={city} onChange={(e) => setCity(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input className="form-control" placeholder="State" required value={state} onChange={(e) => setState(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Pincode</label>
                        <input className="form-control" placeholder="803201" required value={pincode} onChange={(e) => setPincode(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="btn-primary">Save Address</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowAddressForm(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '48px' }}>
                  <MapPin size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Koi saved address nahi hai.</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className="profile-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                          {addr.fullName} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>({addr.phone})</span>
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                          {addr.addressLine1}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>
                      {addr.isDefault && (
                        <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                          ✓ DEFAULT
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
