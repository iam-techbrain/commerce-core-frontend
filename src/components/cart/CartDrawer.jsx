import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import CheckoutModal from './CheckoutModal';
import { X, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../utils/image.util';

const CartDrawer = () => {
  const { cartItems, subtotal, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    if (!user) {
      alert('Please log in first to place your order! 🔑');
      setIsDrawerOpen(false);
      navigate('/login');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'CHHABRA10') {
      setDiscount(500);
      alert('Promo Code CHHABRA10 applied! ₹500 Discount 🎉');
    } else {
      alert('Invalid Coupon Code! Try "CHHABRA10"');
    }
  };

  const finalPayable = Math.max(0, subtotal - discount);
  const freeShipDiff = 2999 - subtotal;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsDrawerOpen(false)}></div>
      
      <div className="cart-drawer">
        {/* Cart Header */}
        <div className="cart-header">
          <h3>Your Shopping Cart</h3>
          <button className="close-drawer" onClick={() => setIsDrawerOpen(false)} aria-label="Close Cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="free-ship-bar">
          {subtotal >= 2999 ? (
            <span>🎉 You unlocked <strong>FREE EXPRESS PAN-INDIA SHIPPING!</strong></span>
          ) : (
            <span>Add <span>₹{freeShipDiff.toLocaleString('en-IN')}</span> more for <strong>FREE PAN-INDIA SHIPPING!</strong></span>
          )}
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', padding: '40px 10px' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: 'var(--ink-soft)' }}>
                Your cart is currently empty. 🛒
              </p>
            </div>
          ) : (
            cartItems.map((item) => {
              const imageSrc = getImageUrl(item.productImage, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200');

              return (
                <div className="cart-item" key={item.id}>
                  <img src={imageSrc} alt={item.productName} className="cart-item-img" />
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cart-item-title">{item.productName}</div>
                    {item.variantTitle && (
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--gold)',
                          fontWeight: 600,
                          marginTop: '2px',
                          display: 'inline-block',
                          background: 'rgba(201, 168, 76, 0.12)',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        Option: {item.variantTitle}
                      </div>
                    )}
                    <div className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      <button className="remove-item" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-coupon">
              <input 
                type="text" 
                placeholder="Promo Code (e.g. CHHABRA10)" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>Apply</button>
            </div>

            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>₹{finalPayable.toLocaleString('en-IN')}</span>
            </div>

            <button
              className="btn btn-smash"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '12px' }}
              onClick={handleCheckoutClick}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Razorpay Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};

export default CartDrawer;
