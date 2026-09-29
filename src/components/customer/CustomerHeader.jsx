import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import {
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  Heart,
  ChevronDown,
  Package,
  MapPin
} from 'lucide-react';

const CustomerHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, setIsDrawerOpen } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user && (user.role === 'ADMIN' || user.email === 'afzal@schooldigitalised.com');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavToProfileTab = (tab) => {
    setProfileDropdownOpen(false);
    navigate(`/profile?tab=${tab}`);
  };

  return (
    <>
      {/* ANNOUNCEMENT TOPBAR */}
      <div className="announce">
        FREE PAN-INDIA EXPRESS DELIVERY ON ORDERS OVER <strong>₹2,999</strong> <span>/</span> 100% ORIGINAL WARRANTY <span>/</span> HELPLINE: <strong>+91-72772-52440</strong>
      </div>

      {/* SITE HEADER WITH OFFICIAL LOGO IMAGE */}
      <header className="site">
        <div className="header-inner">
          
          {/* Logo Link */}
          <NavLink to="/" className="logo-link">
            <img 
              src="https://chhabrasports.com/wp-content/uploads/2025/09/csa-acrylic-letter-cutting-scaled-e1756718460651.jpg" 
              alt="Chhabra Sports Official Logo" 
              className="logo-img" 
            />
          </NavLink>

          {/* PRIMARY NAVIGATION TABS (HOME, CATEGORIES, PRODUCTS, ABOUT) */}
          <nav className="primary">
            <div className="nav-item">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink to="/categories" className={({ isActive }) => (isActive ? 'active' : '')}>
                Categories
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
                Products
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                About
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
                Contact
              </NavLink>
            </div>

            {/* 👑 ADMIN CONSOLE LINK (Shown only for Admin users) */}
            {isAdmin && (
              <div className="nav-item">
                <NavLink to="/admin/dashboard" style={{ color: 'var(--gold)', fontWeight: 800 }}>
                  <LayoutDashboard size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  Admin
                </NavLink>
              </div>
            )}
          </nav>

          {/* HEADER ACTIONS */}
          <div className="header-actions">
            {/* Search */}
            <button className="icon-btn" aria-label="Search" onClick={() => navigate('/products')}>
              <Search size={20} />
            </button>

            {/* Wishlist Heart Icon with Count Badge */}
            <button
              className="icon-btn"
              aria-label="Wishlist"
              onClick={() => {
                if (user) {
                  navigate('/profile?tab=wishlist');
                } else {
                  navigate('/login');
                }
              }}
              title="View Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </button>

            {/* Cart Chip */}
            <button
              className="icon-btn"
              aria-label="Wishlist"
              onClick={() => setIsDrawerOpen(true)} title="View Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>

            {/* Cart Chip */}
            {/* <button className="cart-chip" onClick={() => setIsDrawerOpen(true)} title="View Cart">
              <ShoppingBag size={16} />
              <span>CART</span> ({cartCount})
            </button> */}

            {/* USER LOGIN / PROFILE AREA */}
            {user ? (
              <div ref={dropdownRef} style={{ position: 'relative', marginLeft: '6px' }}>
                <button
                  className="btn btn-gold"
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <User size={15} />
                  <span style={{ fontWeight: 800, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.username || 'User'}
                  </span>
                  <ChevronDown size={14} style={{ transform: profileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Profile Interactive Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '230px',
                      background: 'var(--white)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 1000,
                      padding: '12px 0',
                      animation: 'fadeIn 0.2s ease'
                    }}
                  >
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--line-dark)', marginBottom: '6px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--pitch)', margin: 0 }}>
                        {user.username}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--ink-soft)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => handleNavToProfileTab('orders')}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--parchment-dim)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <Package size={16} color="var(--pitch)" />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => handleNavToProfileTab('addresses')}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--parchment-dim)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <MapPin size={16} color="var(--gold-dark)" />
                      <span>Saved Addresses</span>
                    </button>

                    <button
                      onClick={() => handleNavToProfileTab('wishlist')}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--parchment-dim)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <Heart size={16} color="var(--oxblood)" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </button>

                    <div style={{ height: '1px', background: 'var(--line-dark)', margin: '6px 0' }}></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--oxblood)',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-gold" style={{ padding: '8px 16px', fontSize: '11px', marginLeft: '6px' }}>
                <User size={14} />
                <span>Login</span>
              </NavLink>
            )}
          </div>

        </div>
      </header>
    </>
  );
};

export default CustomerHeader;
