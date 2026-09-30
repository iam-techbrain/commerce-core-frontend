import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import ProfileAvatar, { GuestAvatar } from '../common/ProfileAvatar';
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
  const { user, logout, updateGender } = useContext(AuthContext);
  const { cartCount, setIsDrawerOpen } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isHomeActive = currentPath === '/';
  const isCategoriesActive = currentPath.startsWith('/categories');
  const isProductsActive = currentPath.startsWith('/product') || currentPath.startsWith('/products');
  const isAboutActive = currentPath.startsWith('/about');
  const isContactActive = currentPath.startsWith('/contact');

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
      {/* ANNOUNCEMENT TOPBAR WITH FAQ & SOCIAL LINKS */}
      <div className="announce" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 32px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          FREE PAN-INDIA EXPRESS DELIVERY ON ORDERS OVER <strong>₹2,999</strong> <span>/</span> 100% ORIGINAL WARRANTY
        </div>
        <div className="announce-right" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <a href="tel:+917277252440" style={{ color: 'var(--parchment)', textDecoration: 'none' }}>
            HELPLINE: <strong>+91-72772-52440</strong>
          </a>
          <NavLink to="/contact" style={{ color: 'var(--parchment)', fontWeight: 700, letterSpacing: '1px' }}>
            F.A.Q
          </NavLink>
          <NavLink to="/contact" style={{ color: 'var(--parchment)', fontWeight: 700, letterSpacing: '1px' }}>
            CONTACT US
          </NavLink>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <a 
              href="https://www.facebook.com/chhabrasports/" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Facebook" 
              style={{ color: 'var(--parchment)', display: 'inline-flex', transition: 'color 0.2s' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.326V1.326C24 .597 23.403 0 22.675 0z" />
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/chhabrasportsagencies/" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Instagram" 
              style={{ color: 'var(--parchment)', display: 'inline-flex', transition: 'color 0.2s' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://wa.me/917277252440" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="WhatsApp" 
              style={{ color: '#25D366', display: 'inline-flex', transition: 'transform 0.2s' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
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

          {/* PRIMARY NAVIGATION TABS (HOME, CATEGORIES, PRODUCTS, ABOUT, CONTACT) */}
          <nav className="primary">
            <div className="nav-item">
              <NavLink to="/" end className={isHomeActive ? 'active' : ''}>
                Home
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink to="/categories" className={isCategoriesActive ? 'active' : ''}>
                Categories
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink to="/products" className={isProductsActive ? 'active' : ''}>
                Products
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink to="/about" className={isAboutActive ? 'active' : ''}>
                About
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink to="/contact" className={isContactActive ? 'active' : ''}>
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
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '50%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: profileDropdownOpen ? '0 0 0 3px rgba(212, 155, 58, 0.5)' : 'none'
                  }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  title={`Logged in: ${user.username || 'User'} (${user.gender === 'female' ? 'Female' : 'Male'})`}
                  aria-label="User Profile Menu"
                >
                  <ProfileAvatar user={user} size={38} />
                </button>

                {/* Profile Interactive Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '240px',
                      background: 'var(--white)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 1000,
                      padding: '12px 0',
                      animation: 'fadeIn 0.2s ease'
                    }}
                  >
                    <div style={{ padding: '10px 16px 14px', borderBottom: '1px solid var(--line-dark)', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <ProfileAvatar user={user} size={36} />
                        <div style={{ overflow: 'hidden' }}>
                          <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--pitch)', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {user.username}
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--ink-soft)', margin: '1px 0 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Avatar Gender Switcher */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--parchment)',
                          padding: '4px 6px',
                          borderRadius: '20px',
                          border: '1px solid var(--line)'
                        }}
                      >
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-soft)', paddingLeft: '4px' }}>
                          Avatar:
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateGender('male');
                            }}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: (user.gender || 'male') === 'male' ? 'var(--pitch)' : 'transparent',
                              color: (user.gender || 'male') === 'male' ? '#ffffff' : 'var(--ink-soft)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            👨 Male
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateGender('female');
                            }}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: user.gender === 'female' ? '#8F2B3B' : 'transparent',
                              color: user.gender === 'female' ? '#ffffff' : 'var(--ink-soft)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            👩 Female
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavToProfileTab('profile')}
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
                      <User size={16} color="var(--pitch)" />
                      <span>My Profile</span>
                    </button>

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
              <NavLink
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '4px',
                  textDecoration: 'none'
                }}
                aria-label="Guest User — Click to Login"
                title="Not Logged In — Click to Sign In"
              >
                <GuestAvatar size={36} />
              </NavLink>
            )}
          </div>

        </div>
      </header>
    </>
  );
};

export default CustomerHeader;
