import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { loadRazorpayScript } from '../../utils/loadRazorpay';
import { X, MapPin, CreditCard, ShieldCheck, CheckCircle2, Plus } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const { subtotal, fetchCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  // New Address Form State
  const [fullName, setFullName] = useState(user?.username || '');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await API.get('/addresses');
      if (res.data.success) {
        setAddresses(res.data.data);
        if (res.data.data.length > 0) {
          const defaultAddr = res.data.data.find(a => a.isDefault) || res.data.data[0];
          setSelectedAddressId(defaultAddr.id);
        } else {
          setShowAddAddressForm(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  const handleSaveAddress = async (e) => {
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
        isDefault: true
      });
      if (res.data.success) {
        await fetchAddresses();
        setShowAddAddressForm(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Address save karne me dikkat aayi!');
    }
  };

  const handlePayNow = async () => {
    if (!selectedAddressId) {
      alert('Kripya delivery address select karein ya add karein!');
      return;
    }

    setProcessingPayment(true);

    try {
      // Step 1: Create Order in Backend DB + Razorpay Order
      const createRes = await API.post('/orders/create', {
        addressId: selectedAddressId
      });

      if (!createRes.data.success) {
        alert(createRes.data.message || 'Order creation failed');
        setProcessingPayment(false);
        return;
      }

      const { order, razorpay } = createRes.data.data;

      // Step 2: Load Razorpay Script into Browser DOM
      const isLoaded = await loadRazorpayScript();
      
      if (!isLoaded) {
        // Fallback for offline/test mode if script load fails
        if (window.confirm('Razorpay Script Load nahi ho saka. Dynamic Test Mode Payment simulate karein?')) {
          await completePaymentVerification(razorpay.orderId, `pay_test_dummy_${Date.now()}`, 'TEST_SIGNATURE');
        }
        setProcessingPayment(false);
        return;
      }

      // Step 3: Open Razorpay Official Payment Checkout Modal
      const options = {
        key: razorpay.keyId || 'rzp_test_dummy_key',
        amount: razorpay.amount,
        currency: razorpay.currency || 'INR',
        name: 'SaaS Store',
        description: `Order #${order.orderNumber}`,
        order_id: razorpay.orderId,
        handler: async function (response) {
          await completePaymentVerification(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        },
        prefill: {
          name: user?.username || fullName,
          email: user?.email || '',
          contact: phone || '9999999999'
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          }
        }
      };

      const paymentWindow = new window.Razorpay(options);
      
      // Fallback for invalid test keys in development mode
      paymentWindow.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`);
        setProcessingPayment(false);
      });

      paymentWindow.open();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Payment processing error');
      setProcessingPayment(false);
    }
  };

  const completePaymentVerification = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    try {
      const verifyRes = await API.post('/orders/verify-payment', {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      if (verifyRes.data.success) {
        clearCart();
        alert('🎉 Payment Successful! AAPKA ORDER CONGRATULATIONS SUBMIT HO GAYA HAI.');
        onClose();
        navigate('/profile');
      } else {
        alert('Payment verification fail ho gaya.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment Verification Server Error!');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ maxWidth: '620px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Complete Your Order</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Delivery Address Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--secondary)" /> Select Shipping Address
            </h3>
            {!showAddAddressForm && (
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setShowAddAddressForm(true)}>
                <Plus size={14} /> Add New Address
              </button>
            )}
          </div>

          {showAddAddressForm ? (
            <form onSubmit={handleSaveAddress} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>New Shipping Address</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Full Name</label>
                  <input className="form-control" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Afzal Khan" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Phone Number</label>
                  <input className="form-control" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem' }}>Address Line</label>
                <input className="form-control" required value={addressLine1} onChange={e => setAddressLine1(e.target.value)} placeholder="House #123, Main Market" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>City</label>
                  <input className="form-control" required value={city} onChange={e => setCity(e.target.value)} placeholder="Delhi" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>State</label>
                  <input className="form-control" required value={state} onChange={e => setState(e.target.value)} placeholder="Delhi" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Pincode</label>
                  <input className="form-control" required value={pincode} onChange={e => setPincode(e.target.value)} placeholder="110001" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Save & Use Address</button>
                {addresses.length > 0 && (
                  <button type="button" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setShowAddAddressForm(false)}>Cancel</button>
                )}
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {addresses.map(addr => (
                <div 
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: `2px solid ${selectedAddressId === addr.id ? 'var(--primary)' : 'var(--card-border)'}`,
                    background: selectedAddressId === addr.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{addr.fullName} ({addr.phone})</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                      {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                    </div>
                  </div>
                  {selectedAddressId === addr.id && <CheckCircle2 color="var(--primary)" size={20} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Amount Summary */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Payment Summary</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Items Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Shipping Charge</span>
            <span style={{ color: 'var(--success)' }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--card-border)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
            <span>Total Amount Payable</span>
            <span>₹{subtotal}</span>
          </div>
        </div>

        {/* Pay Action Button */}
        <button 
          className="btn-primary" 
          style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
          onClick={handlePayNow}
          disabled={processingPayment || loading}
        >
          <ShieldCheck size={20} />
          <span>{processingPayment ? 'Opening Razorpay Gateway...' : `Pay ₹${subtotal} via Razorpay`}</span>
        </button>

      </div>
    </div>
  );
};

export default CheckoutModal;
