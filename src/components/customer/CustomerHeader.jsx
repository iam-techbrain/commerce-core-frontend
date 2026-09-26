import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { ShoppingBag, User, LogOut, LayoutDashboard, Search, Heart } from 'lucide-react';

const CustomerHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, setIsDrawerOpen } = useContext(CartContext);

  const isAdmin = user && (user.role === 'ADMIN' || user.email === 'afzal@schooldigitalised.com');

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

          {/* PRIMARY NAVIGATION */}
          <nav className="primary">
            <div className="nav-item">
              <NavLink to="/">Home</NavLink>
            </div>

            {/* BADMINTON MEGA MENU */}
            <div className="nav-item">
              <NavLink to="/products?categoryId=badminton">Badminton</NavLink>
              <div className="mega">
                <div className="mega-col">
                  <h4>Racquets</h4>
                  <NavLink to="/products">Yonex Astrox / Nanoflare</NavLink>
                  <NavLink to="/products">Li-Ning Halbertec / Tectonic</NavLink>
                  <NavLink to="/products">Head & Apacs Racquets</NavLink>
                  <NavLink to="/products">Light Weight & High Tension</NavLink>
                </div>
                <div className="mega-col">
                  <h4>Shuttles & Strings</h4>
                  <NavLink to="/products">Feather Shuttlecocks (RSL/Yonex)</NavLink>
                  <NavLink to="/products">Nylon Shuttlecocks</NavLink>
                  <NavLink to="/products">BG65 / BG80 / Aerosonic</NavLink>
                  <a href="#stringing">Pro Stringing Service (22-30 lbs)</a>
                </div>
                <div className="mega-col">
                  <h4>Court Shoes & Gear</h4>
                  <NavLink to="/products">Non-Marking Badminton Shoes</NavLink>
                  <NavLink to="/products">Kit Bags (3R / 6R / Duffle)</NavLink>
                  <NavLink to="/products">Grips & Overgrips</NavLink>
                </div>
                <div className="mega-feature">
                  <img src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80&auto=format&fit=crop" alt="Badminton Equipment" />
                  <div className="mf-label">Yonex & Li-Ning</div>
                  <span className="mf-cta">Explore Racquets →</span>
                </div>
              </div>
            </div>

            {/* TENNIS MEGA MENU */}
            <div className="nav-item">
              <NavLink to="/products?categoryId=tennis">Tennis</NavLink>
              <div className="mega">
                <div className="mega-col">
                  <h4>Tennis Racquets</h4>
                  <NavLink to="/products">Head Speed / Radical</NavLink>
                  <NavLink to="/products">Babolat Pure Drive / Aero</NavLink>
                  <NavLink to="/products">Wilson Pro Staff / Blade</NavLink>
                  <NavLink to="/products">Yonex EZONE / VCORE</NavLink>
                </div>
                <div className="mega-col">
                  <h4>Balls & Strings</h4>
                  <NavLink to="/products">Championship Tennis Balls</NavLink>
                  <NavLink to="/products">Luxilon & Solinco Strings</NavLink>
                  <NavLink to="/products">Vibration Dampeners</NavLink>
                </div>
                <div className="mega-col">
                  <h4>Bags & Shoes</h4>
                  <NavLink to="/products">All-Court Tennis Shoes</NavLink>
                  <NavLink to="/products">9R & 12R Tour Kitbags</NavLink>
                  <NavLink to="/products">Replacement Grips</NavLink>
                </div>
                <div className="mega-feature">
                  <img src="https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=400&q=80&auto=format&fit=crop" alt="Tennis Gear" />
                  <div className="mf-label">Head & Babolat</div>
                  <span className="mf-cta">Shop Tennis Range →</span>
                </div>
              </div>
            </div>

            {/* CRICKET MEGA MENU */}
            <div className="nav-item">
              <NavLink to="/products?categoryId=cricket">Cricket</NavLink>
              <div className="mega">
                <div className="mega-col">
                  <h4>Bats & Balls</h4>
                  <NavLink to="/products">English Willow Bats (SS/SG/MRF)</NavLink>
                  <NavLink to="/products">Kashmir Willow Bats</NavLink>
                  <NavLink to="/products">Leather Match Balls</NavLink>
                </div>
                <div className="mega-col">
                  <h4>Protection</h4>
                  <NavLink to="/products">Batting & Keeping Gloves</NavLink>
                  <NavLink to="/products">Legguards & Pads</NavLink>
                  <NavLink to="/products">Helmets & Guards</NavLink>
                </div>
                <div className="mega-col">
                  <h4>Kitbags & Shoes</h4>
                  <NavLink to="/products">Cricket Spike Shoes</NavLink>
                  <NavLink to="/products">Wheelie Kit Bags</NavLink>
                </div>
                <div className="mega-feature">
                  <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80&auto=format&fit=crop" alt="Cricket Bats" />
                  <div className="mf-label">SS & SG Ton</div>
                  <span className="mf-cta">Shop English Willow →</span>
                </div>
              </div>
            </div>

            <div className="nav-item"><NavLink to="/products">Shoes</NavLink></div>
            <div className="nav-item"><NavLink to="/products">Fitness</NavLink></div>

            {/* 👑 ADMIN CONSOLE LINK */}
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
            <button className="icon-btn" aria-label="Search" onClick={() => navigate('/products')}>
              <Search size={20} />
            </button>

            <button className="icon-btn" aria-label="Wishlist" onClick={() => navigate('/profile')}>
              <Heart size={20} />
              <span className="badge">0</span>
            </button>

            <button className="cart-chip" onClick={() => setIsDrawerOpen(true)}>
              <ShoppingBag size={16} />
              <span>CART</span> ({cartCount})
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
                <NavLink to="/profile" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 700, fontSize: '0.85rem' }}>
                  Hi, {user.username}
                </NavLink>
                <button className="icon-btn" onClick={logout} title="Logout" style={{ width: '36px', height: '36px' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-gold" style={{ padding: '8px 14px', fontSize: '11px', marginLeft: '6px' }}>
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
