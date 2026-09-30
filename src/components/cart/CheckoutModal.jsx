import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { loadRazorpayScript } from '../../utils/loadRazorpay';
import { X, MapPin, CreditCard, ShieldCheck, CheckCircle2, Plus, Zap } from 'lucide-react';

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
        setAddresses(res.data.data || []);
        if (res.data.data.length > 0) {
          const defaultAddr = res.data.data.find((a) => a.isDefault) || res.data.data[0];
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
      alert(err.response?.data?.message || 'Failed to save address!');
    }
  };

  const handlePayNow = async (isInstantSimulate = false) => {
    if (!selectedAddressId) {
      alert('Please select a delivery address or add a new address!');
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

      // If user opted for instant simulated payment
      if (isInstantSimulate) {
        await completePaymentVerification(
          razorpay.orderId,
          `pay_test_dummy_${Date.now()}`,
          'TEST_SIMULATED_SIGNATURE'
        );
        return;
      }

      // Step 2: Load Razorpay Script into Browser DOM
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded) {
        // Fallback for offline/test mode if script load fails
        if (window.confirm('Could not load Razorpay script. Would you like to simulate a dynamic test payment?')) {
          await completePaymentVerification(razorpay.orderId, `pay_test_dummy_${Date.now()}`, 'TEST_SIMULATED_SIGNATURE');
        }
        setProcessingPayment(false);
        return;
      }

      // Step 3: Open Razorpay Official Payment Checkout Modal
      const options = {
        key: razorpay.keyId || 'rzp_test_dummy_key',
        amount: razorpay.amount,
        currency: razorpay.currency || 'INR',
        name: 'Chhabra Sports Official',
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
          contact: phone || '9876543210'
        },
        theme: {
          color: '#11362B'
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          }
        }
      };

      const paymentWindow = new window.Razorpay(options);

      paymentWindow.on('payment.failed', function (response) {
        if (window.confirm(`Payment Gateway Notice: ${response.error.description || 'Test Mode'}. Would you like to proceed with simulated test payment?`)) {
          completePaymentVerification(razorpay.orderId, `pay_test_dummy_${Date.now()}`, 'TEST_SIMULATED_SIGNATURE');
        } else {
          setProcessingPayment(false);
        }
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
        alert('🎉 Payment Successful! Your order has been placed successfully.');
        onClose();
        navigate('/profile?tab=orders');
      } else {
        alert('Payment verification failed.');
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
      <div className="profile-card" style={{ maxWidth: '620px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', background: 'var(--white)', borderRadius: 'var(--radius)' }}>

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={22} color="var(--gold-dark)" />
            <h2 className="display" style={{ fontSize: '1.35rem', color: 'var(--pitch)', margin: 0 }}>
              Complete Your Order
            </h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal"><X size={20} /></button>
        </div>

        {/* Delivery Address Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pitch)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--gold-dark)" /> Select Delivery Address
            </h3>
            {!showAddAddressForm && (
              <button
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '10.5px', color: 'var(--pitch)', borderColor: 'var(--line)' }}
                onClick={() => setShowAddAddressForm(true)}
              >
                <Plus size={14} /> Add Address
              </button>
            )}
          </div>

          {showAddAddressForm ? (
            <form onSubmit={handleSaveAddress} style={{ background: 'var(--parchment)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--line)', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '12px', color: 'var(--pitch)' }}>New Shipping Address</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Full Name</label>
                  <input className="form-control" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter Full Name" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Phone Number</label>
                  <input className="form-control" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter Phone Number" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Address Line</label>
                <input className="form-control" required value={addressLine1} onChange={e => setAddressLine1(e.target.value)} placeholder="Enter Address" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>City</label>
                  <input className="form-control" required value={city} onChange={e => setCity(e.target.value)} placeholder="Enter City Name" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>State</label>
                  <input className="form-control" required value={state} onChange={e => setState(e.target.value)} placeholder="Enter State Name" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Pincode</label>
                  <input className="form-control" required value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Enter Pincode" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-gold" style={{ padding: '8px 16px', fontSize: '11px' }}>
                  Save & Use Address
                </button>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '11px', color: 'var(--ink)' }}
                    onClick={() => setShowAddAddressForm(false)}
                  >
                    Cancel
                  </button>
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
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: `1.5px solid ${selectedAddressId === addr.id ? 'var(--pitch)' : 'var(--line)'}`,
                    background: selectedAddressId === addr.id ? 'rgba(17, 54, 43, 0.05)' : 'var(--white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--pitch)' }}>
                      {addr.fullName} <span style={{ fontWeight: 400, color: 'var(--ink-soft)' }}>({addr.phone})</span>
                    </div>
                    <div style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '2px' }}>
                      {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                    </div>
                  </div>
                  {selectedAddressId === addr.id && <CheckCircle2 color="var(--pitch)" size={20} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Amount Summary */}
        <div style={{ background: 'var(--parchment)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--line)', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', color: 'var(--pitch)' }}>Payment Summary</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
            <span>Items Subtotal</span>
            <span style={{ fontFamily: 'Space Mono, monospace' }}>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
            <span>Express Delivery</span>
            <span style={{ color: 'var(--pitch)', fontWeight: 700 }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--line)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--pitch)' }}>
            <span>Total Payable</span>
            <span style={{ fontFamily: 'Space Mono, monospace' }}>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn btn-smash"
            style={{ width: '100%', padding: '14px', fontSize: '12px', justifyContent: 'center' }}
            onClick={() => handlePayNow(false)}
            disabled={processingPayment || loading}
          >
            <ShieldCheck size={18} />
            <span>{processingPayment ? 'Processing Gateway...' : `Pay ₹${subtotal.toLocaleString('en-IN')} via Razorpay`}</span>
          </button>

          <button
            className="btn btn-gold"
            style={{ width: '100%', padding: '12px', fontSize: '11px', justifyContent: 'center' }}
            onClick={() => handlePayNow(true)}
            disabled={processingPayment || loading}
            title="Instant Simulated Test Order"
          >
            <Zap size={16} />
            <span>⚡ Instant Checkout (Test Demo Mode)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;
