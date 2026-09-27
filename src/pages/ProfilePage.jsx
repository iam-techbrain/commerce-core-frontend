import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import {
  User,
  MapPin,
  Package,
  Download,
  LogOut,
  Plus,
  Heart,
  ShoppingCart,
  Trash2,
  CheckCircle2
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist, fetchWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(tabParam); // 'orders', 'addresses', 'wishlist'
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

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && ['orders', 'addresses', 'wishlist'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

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
        fullName,
        phone,
        addressLine1,
        city,
        state,
        pincode,
        country: 'India',
        isDefault: addresses.length === 0
      });
      if (res.data.success) {
        setAddresses([res.data.data, ...addresses]);
        setShowAddressForm(false);
        setFullName('');
        setPhone('');
        setAddressLine1('');
        setCity('');
        setState('');
        setPincode('');
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

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* Profile Sidebar */}
        <div className="profile-card" style={{ height: 'fit-content' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--pitch)',
              color: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              marginBottom: '16px'
            }}
          >
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px', color: 'var(--pitch)' }}>
            {user.username}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginBottom: '14px' }}>{user.email}</p>

          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: 'rgba(212, 155, 58, 0.15)',
              color: 'var(--gold-dark)',
              marginBottom: '24px',
              fontFamily: 'Space Mono, monospace'
            }}
          >
            {user.role || 'CUSTOMER'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className={`pill-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleTabChange('orders')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Package size={18} />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              className={`pill-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => handleTabChange('addresses')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <MapPin size={18} />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              className={`pill-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => handleTabChange('wishlist')}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Heart size={18} />
              <span>My Wishlist ({wishlistItems.length})</span>
            </button>

            <button
              className="btn btn-outline"
              onClick={logout}
              style={{
                justifyContent: 'center',
                width: '100%',
                marginTop: '16px',
                color: 'var(--oxblood)',
                borderColor: 'var(--oxblood)',
                background: 'transparent'
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Profile Content Area */}
        <div>
          {/* TAB 1: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--pitch)' }}>Order History</h2>
                <span className="eyebrow">{orders.length} Total Orders</span>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>Loading Orders...</div>
              ) : orders.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '48px' }}>
                  <Package size={48} color="var(--ink-soft)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--ink-soft)', fontSize: '1rem' }}>Aapne abhi tak koi order place nahi kiya.</p>
                  <button className="btn btn-gold" style={{ marginTop: '16px' }} onClick={() => navigate('/products')}>
                    Browse Catalog
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="profile-card" style={{ marginBottom: '20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--line)',
                        paddingBottom: '16px',
                        marginBottom: '16px'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Space Mono, monospace' }}>
                          Order Reference
                        </span>
                        <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--pitch)', marginTop: '2px', fontFamily: 'Space Mono, monospace' }}>
                          #{order.orderNumber}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            padding: '6px 14px',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            fontFamily: 'Space Mono, monospace',
                            background: order.paymentStatus === 'PAID' ? 'rgba(17, 54, 43, 0.1)' : 'rgba(109, 30, 42, 0.1)',
                            color: order.paymentStatus === 'PAID' ? 'var(--pitch)' : 'var(--oxblood)',
                            border: `1px solid ${order.paymentStatus === 'PAID' ? 'var(--pitch)' : 'var(--oxblood)'}`
                          }}
                        >
                          {order.paymentStatus === 'PAID' ? '✓ PAID' : 'PENDING'}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'var(--parchment)',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            border: '1px solid var(--line)'
                          }}
                        >
                          <img
                            src={
                              item.product?.imageUrl
                                ? item.product.imageUrl.startsWith('http')
                                  ? item.product.imageUrl
                                  : `http://localhost:5000${item.product.imageUrl}`
                                : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100'
                            }
                            alt={item.product?.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>
                              {item.product?.name || 'Product Item'}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                              Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <strong style={{ fontSize: '1rem', fontFamily: 'Space Mono, monospace', color: 'var(--pitch)' }}>
                            ₹{item.totalPrice?.toLocaleString('en-IN')}
                          </strong>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary Footer */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--line)'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Total Amount: </span>
                        <strong style={{ fontSize: '1.25rem', color: 'var(--pitch)', fontFamily: 'Space Mono, monospace', marginLeft: '6px' }}>
                          ₹{order.finalAmount?.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '11px', color: 'var(--pitch)', borderColor: 'var(--pitch)' }}
                        onClick={() => downloadInvoice(order.id, order.orderNumber)}
                      >
                        <Download size={14} /> PDF Invoice
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
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--pitch)' }}>Saved Shipping Addresses</h2>
                <button
                  className="btn btn-gold"
                  style={{ padding: '10px 18px', fontSize: '11px' }}
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  <Plus size={14} /> Add New Address
                </button>
              </div>

              {showAddressForm && (
                <div className="profile-card" style={{ marginBottom: '28px', border: '1.5px solid var(--gold)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', color: 'var(--pitch)' }}>
                    Add Shipping Address
                  </h3>
                  <form onSubmit={handleAddAddress}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input className="form-control" placeholder="Afzal Khan" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
                        <input className="form-control" placeholder="Patna" required value={city} onChange={(e) => setCity(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input className="form-control" placeholder="Bihar" required value={state} onChange={(e) => setState(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Pincode</label>
                        <input className="form-control" placeholder="800020" required value={pincode} onChange={(e) => setPincode(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="btn btn-gold">Save Address</button>
                      <button type="button" className="btn btn-outline" style={{ color: 'var(--ink)' }} onClick={() => setShowAddressForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '48px' }}>
                  <MapPin size={48} color="var(--ink-soft)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--ink-soft)' }}>Koi saved address nahi hai.</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className="profile-card" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--pitch)', marginBottom: '4px' }}>
                          {addr.fullName} <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 400 }}>({addr.phone})</span>
                        </h4>
                        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
                          {addr.addressLine1}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>
                      {addr.isDefault && (
                        <span
                          style={{
                            background: 'rgba(17, 54, 43, 0.1)',
                            color: 'var(--pitch)',
                            border: '1px solid var(--pitch)',
                            padding: '4px 10px',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            fontFamily: 'Space Mono, monospace'
                          }}
                        >
                          ✓ DEFAULT
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--pitch)' }}>My Saved Wishlist</h2>
                <span className="eyebrow">{wishlistItems.length} Products Saved</span>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '48px' }}>
                  <Heart size={48} color="var(--ink-soft)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--ink-soft)', fontSize: '1rem' }}>Aapki wishlist abhi khali hai.</p>
                  <button className="btn btn-gold" style={{ marginTop: '16px' }} onClick={() => navigate('/products')}>
                    Explore Products
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {wishlistItems.map((item) => {
                    const prod = item.product || item;
                    const imageSrc = prod.imageUrl
                      ? prod.imageUrl.startsWith('http')
                        ? prod.imageUrl
                        : `http://localhost:5000${prod.imageUrl}`
                      : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500';

                    return (
                      <div key={item.id || prod.id} className="prod-card" style={{ background: 'var(--white)' }}>
                        <div className="prod-media" style={{ height: '200px' }}>
                          <img src={imageSrc} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            className="prod-wish active"
                            onClick={() => toggleWishlist(prod)}
                            title="Remove from wishlist"
                          >
                            <Trash2 size={16} color="var(--oxblood)" />
                          </button>
                        </div>
                        <div className="prod-info" style={{ padding: '16px' }}>
                          <div className="prod-brand">{prod.brand?.name || prod.brandName || 'Chhabra Sports'}</div>
                          <h4 className="prod-name" style={{ minHeight: 'auto', marginBottom: '8px' }}>{prod.name}</h4>
                          <div className="prod-price" style={{ marginBottom: '14px' }}>
                            <span className="price-now">₹{prod.price?.toLocaleString('en-IN')}</span>
                          </div>
                          <button
                            className="btn btn-gold"
                            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '11px' }}
                            onClick={() => addToCart(prod.id, 1)}
                          >
                            <ShoppingCart size={15} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
