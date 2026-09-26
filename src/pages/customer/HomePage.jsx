import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { CartContext } from '../../context/CartContext';
import { Heart } from 'lucide-react';

const productsData = [
  {
    id: 'p1',
    category: 'badminton',
    brand: 'Yonex',
    name: 'Astrox 88D Pro Badminton Racquet',
    price: 14999,
    oldPrice: 17999,
    rating: 4.9,
    reviews: 214,
    tag: 'BESTSELLER',
    specs: '4U / G5 · Head Heavy · Stiff Shaft · Pre-String Option',
    img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p2',
    category: 'tennis',
    brand: 'Head',
    name: 'Head Speed MP 2024 Tennis Racquet',
    price: 18999,
    oldPrice: 22499,
    rating: 4.9,
    reviews: 189,
    tag: 'PRO CHOICE',
    specs: '300g · 100 sq.in · Auxetic 2.0 Tech · Unstrung Frame',
    img: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p3',
    category: 'cricket',
    brand: 'SS',
    name: 'Ton Reserve Edition English Willow Bat',
    price: 12499,
    oldPrice: 15999,
    rating: 5.0,
    reviews: 312,
    tag: 'BESTSELLER',
    specs: 'Grade 1 Willow · Weight 1180g · Hand Oiled & Knocked',
    img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p4',
    category: 'badminton',
    brand: 'Li-Ning',
    name: 'Halbertec 7000 Badminton Racquet',
    price: 13599,
    oldPrice: 22990,
    rating: 4.8,
    reviews: 96,
    tag: 'NEW',
    specs: '3U / G5 · Even Balance · High Elasticity Carbon Shaft',
    img: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p5',
    category: 'shoes',
    brand: 'Asics',
    name: 'Gel-Rocket 11 Non-Marking Indoor Shoes',
    price: 5499,
    oldPrice: 6999,
    rating: 4.8,
    reviews: 145,
    tag: 'BESTSELLER',
    specs: 'Gel Cushioning · Trusstic Tech · Non-Marking Gum Sole',
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p6',
    category: 'tennis',
    brand: 'Babolat',
    name: 'Pure Drive 2024 Tennis Racquet',
    price: 19499,
    oldPrice: 23999,
    rating: 4.9,
    reviews: 167,
    tag: 'POPULAR',
    specs: '300g · FSI Power Tech · High Power & Explosive Feel',
    img: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p7',
    category: 'football',
    brand: 'Adidas',
    name: 'Predator Elite FG Football Boots',
    price: 8999,
    oldPrice: 11499,
    rating: 4.7,
    reviews: 342,
    tag: 'SALE',
    specs: 'Controlframe 2.0 · Moulded Studs · HybridTouch Upper',
    img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p8',
    category: 'badminton',
    brand: 'RSL',
    name: 'Tourney No.1 Feather Shuttlecocks (12 Pack)',
    price: 999,
    oldPrice: 1299,
    rating: 4.9,
    reviews: 410,
    tag: 'BESTSELLER',
    specs: 'Grade A Goose Feather · Speed 77 · Tournament Class',
    img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p9',
    category: 'cricket',
    brand: 'SG',
    name: 'Test Players Wicket Keeping Gloves',
    price: 3299,
    oldPrice: 3999,
    rating: 4.6,
    reviews: 84,
    tag: null,
    specs: 'Premium Leather · Rubberized Palm Grip · Brass Thimbles',
    img: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'p10',
    category: 'fitness',
    brand: 'Cosco',
    name: 'Adjustable Rubber Dumbbell Set 20kg Kit',
    price: 4499,
    oldPrice: 5999,
    rating: 4.7,
    reviews: 78,
    tag: null,
    specs: 'Chrome Bar + Collars · Heavy Duty Rubber Coated Plates',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80&auto=format&fit=crop'
  }
];

const categoriesList = [
  {
    id: 'badminton',
    name: 'Badminton & Racquets',
    img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'tennis',
    name: 'Tennis Racquets & Gear',
    img: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'cricket',
    name: 'Cricket Bats & Gear',
    img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'shoes',
    name: 'Non-Marking Court Shoes',
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'football',
    name: 'Football & Boots',
    img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'fitness',
    name: 'Gym & Fitness Gear',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'apparel',
    name: 'Dri-FIT Apparel',
    img: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500&q=80&auto=format&fit=crop'
  },
  {
    id: 'all',
    name: 'Strings, Grips & Accessories',
    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80&auto=format&fit=crop'
  }
];

const HomePage = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [currentFilter, setCurrentFilter] = useState('all');
  const [wishlist, setWishlist] = useState(new Set());

  const filteredProducts = currentFilter === 'all'
    ? productsData
    : productsData.filter(p => p.category === currentFilter);

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow display">India's Preferred Online Racquet & Sports Store</span>
          <h1>Play Hard.<br /><em>Perform</em> <span className="highlight">Better.</span></h1>
          <p>
            Authentic Yonex, Head, Babolat & Li-Ning racquets, SS English Willow cricket bats, tournament shoes and certified stringing — trusted by athletes across India since 1998.
          </p>
          <div className="hero-ctas">
            <a href="#products" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollToSection('products'); }}>
              Shop Catalog
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <button className="btn btn-outline" onClick={() => scrollToSection('products')}>
              ⚡ Launch Racquet Finder
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-stitch"></div>
          <img
            className="hero-bg"
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80&auto=format&fit=crop"
            alt="Athlete in action"
          />

          <div className="racquet-finder-badge" onClick={() => scrollToSection('products')}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 8 8 16 16 16" />
            </svg>
            <div>
              <div className="rf-title">Racquet Finder Tool</div>
              <div className="rf-sub">Find your perfect frame in 3 steps →</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCOREBOARD TICKER */}
      <div className="scoreboard">
        <div className="scoreboard-track">
          <div className="score-item"><span className="num">25+</span><span className="lbl">Years in Sport</span></div>
          <div className="score-item"><span className="num">12,000+</span><span className="lbl">Products Stocked</span></div>
          <div className="score-item"><span className="num">100%</span><span className="lbl">Genuine Warranty</span></div>
          <div className="score-item"><span className="num">500+</span><span className="lbl">Academies Equipped</span></div>
          <div className="score-item"><span className="num">60 MIN</span><span className="lbl">Pro Stringing Service</span></div>
          <div className="score-item"><span className="num">4.8/5</span><span className="lbl">Rated by Players</span></div>
          <div className="score-item"><span className="num">25+</span><span className="lbl">Years in Sport</span></div>
          <div className="score-item"><span className="num">12,000+</span><span className="lbl">Products Stocked</span></div>
          <div className="score-item"><span className="num">100%</span><span className="lbl">Genuine Warranty</span></div>
          <div className="score-item"><span className="num">500+</span><span className="lbl">Academies Equipped</span></div>
          <div className="score-item"><span className="num">60 MIN</span><span className="lbl">Pro Stringing Service</span></div>
          <div className="score-item"><span className="num">4.8/5</span><span className="lbl">Rated by Players</span></div>
        </div>
      </div>

      {/* 3. TRUST BADGES STRIP */}
      <div className="trust-strip">
        <div className="wrap trust-grid">
          <div className="trust-item">
            <svg viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <h5>100% Original Products</h5>
              <p>Direct from Yonex, Head, Babolat & SS</p>
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div>
              <h5>Free & Fast Dispatch</h5>
              <p>Pan-India shipping in 24 hours</p>
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <div>
              <h5>Pro Custom Stringing</h5>
              <p>Certified stringers match tension 22-30 lbs</p>
            </div>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 1 1-6.2-8.56" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
            <div>
              <h5>15-Day Easy Returns</h5>
              <p>Hassle-free replacement guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SHOP BY CATEGORY */}
      <section className="section" id="categories">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">Shop by Sport & Category</span>
              <h2>Explore Sports Categories</h2>
            </div>
            <a href="#products" className="sec-link" onClick={(e) => { e.preventDefault(); setCurrentFilter('all'); scrollToSection('products'); }}>
              View Complete Catalog →
            </a>
          </div>

          <div className="cat-grid">
            {categoriesList.map((cat) => (
              <div 
                key={cat.id} 
                className="cat-card"
                onClick={() => { setCurrentFilter(cat.id); scrollToSection('products'); }}
              >
                <img src={cat.img} alt={cat.name} />
                <div className="cat-overlay">
                  <div className="cat-label">
                    <span>{cat.name}</span>
                    <div className="arrow">
                      <svg viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL COLLECTIONS */}
      <section className="section tight" id="collections" style={{ background: 'var(--parchment-dim)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">Curated Collections</span>
              <h2>Tournament Ready Selections</h2>
            </div>
          </div>
          <div className="editorial-grid">
            <div className="ed-card" style={{ minHeight: '520px' }}>
              <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=900&q=80&auto=format&fit=crop" alt="Cricket Match Essentials" />
              <div className="ed-content">
                <span className="eyebrow">01 · Match Ready</span>
                <h3>English Willow Pro Series</h3>
                <button className="btn btn-outline" onClick={() => { setCurrentFilter('cricket'); scrollToSection('products'); }}>
                  Explore Cricket Bats →
                </button>
              </div>
            </div>
            <div className="ed-stack">
              <div className="ed-card" style={{ minHeight: '251px' }}>
                <img src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=700&q=80&auto=format&fit=crop" alt="Badminton Pro Racquets" />
                <div className="ed-content">
                  <span className="eyebrow">02 · Court Speed</span>
                  <h3 style={{ fontSize: '24px' }}>Yonex Astrox & Head Speed</h3>
                </div>
              </div>
              <div className="ed-card" style={{ minHeight: '251px' }}>
                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80&auto=format&fit=crop" alt="Sports Footwear" />
                <div className="ed-content">
                  <span className="eyebrow">03 · Built to Move</span>
                  <h3 style={{ fontSize: '24px' }}>Asics & Adidas Court Shoes</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRODUCTS SECTION WITH FILTER TABS */}
      <section className="section" id="products">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">Browse Online Store</span>
              <h2>Featured Racquets & Sports Gear</h2>
            </div>
            <div className="sec-link" style={{ cursor: 'default' }}>
              Showing {filteredProducts.length} products
            </div>
          </div>

          {/* Filter Pills */}
          <div className="filter-pills">
            <button className={`pill-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>All Products</button>
            <button className={`pill-btn ${currentFilter === 'badminton' ? 'active' : ''}`} onClick={() => setCurrentFilter('badminton')}>Badminton</button>
            <button className={`pill-btn ${currentFilter === 'tennis' ? 'active' : ''}`} onClick={() => setCurrentFilter('tennis')}>Tennis</button>
            <button className={`pill-btn ${currentFilter === 'cricket' ? 'active' : ''}`} onClick={() => setCurrentFilter('cricket')}>Cricket</button>
            <button className={`pill-btn ${currentFilter === 'shoes' ? 'active' : ''}`} onClick={() => setCurrentFilter('shoes')}>Shoes & Spikes</button>
            <button className={`pill-btn ${currentFilter === 'football' ? 'active' : ''}`} onClick={() => setCurrentFilter('football')}>Football</button>
            <button className={`pill-btn ${currentFilter === 'fitness' ? 'active' : ''}`} onClick={() => setCurrentFilter('fitness')}>Fitness</button>
          </div>

          {/* Products Grid */}
          <div className="prod-grid">
            {filteredProducts.map((p) => (
              <div key={p.id} className="prod-card">
                <div className="prod-media">
                  {p.tag && <div className={`prod-tag ${p.tag.toLowerCase()}`}>{p.tag}</div>}
                  <button 
                    className={`prod-wish ${wishlist.has(p.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(p.id)}
                    aria-label="Add to wishlist"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                  <img className="primary" src={p.img} alt={p.name} />
                  <img className="secondary" src={p.img2} alt={p.name} />
                  <button className="quick-add-btn" onClick={() => addToCart(1, 1)}>+ Add to Cart</button>
                </div>
                <div className="prod-info">
                  <div>
                    <div className="prod-brand">{p.brand}</div>
                    <div className="prod-name">{p.name}</div>
                    <span className="spec-chip">{p.specs}</span>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div className="prod-rating">
                      <span className="stars">★★★★★</span>
                      <span className="rev-count">({p.reviews})</span>
                    </div>
                    <div className="prod-price">
                      <span className="price-now">₹{p.price.toLocaleString('en-IN')}</span>
                      {p.oldPrice && (
                        <>
                          <span className="price-old">₹{p.oldPrice.toLocaleString('en-IN')}</span>
                          <span className="price-off">-{Math.round((1 - p.price / p.oldPrice) * 100)}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRO STRINGING SERVICE BANNER */}
      <section className="section tight" id="stringing">
        <div className="wrap">
          <div className="stringing-banner">
            <div className="stringing-content">
              <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>Certified Customization</span>
              <h3>Pro Stringing & Bat Knocking</h3>
              <p>Walk into our flagship store or mail your frame. Our master certified stringers hand-string racquets (22-30 lbs) with Yonex/Luxilon strings and oil/knock English Willow bats to perfection.</p>

              <div className="spec-options-grid">
                <div className="spec-opt">
                  <b>60 MINS</b>
                  <span>Express Stringing</span>
                </div>
                <div className="spec-opt">
                  <b>BG65 / LUXILON</b>
                  <span>Pro Strings In Stock</span>
                </div>
                <div className="spec-opt">
                  <b>15,000+</b>
                  <span>Knocks Completed</span>
                </div>
              </div>

              <button className="btn btn-gold" onClick={() => alert('Call Patna workshop at +91-72772-52440 to book stringing slot!')}>
                Book Stringing Slot
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            <div className="stringing-visual">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="88" stroke="var(--gold)" strokeWidth="2.5" />
                <g stroke="var(--parchment)" strokeWidth="1.2" opacity="0.8">
                  <path d="M20 60 L180 60" />
                  <path d="M12 85 L188 85" />
                  <path d="M8 110 L192 110" />
                  <path d="M12 135 L188 135" />
                  <path d="M20 160 L180 160" />
                  <path d="M55 15 L55 185" />
                  <path d="M78 12 L78 188" />
                  <path d="M100 10 L100 190" />
                  <path d="M122 12 L122 188" />
                  <path d="M145 15 L145 185" />
                </g>
                <circle cx="100" cy="100" r="16" fill="var(--smash-orange)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AUTHORISED BRANDS STRIP */}
      <section className="section tight">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">Authorised Brand Retailer</span>
              <h2>World's Top Sports Brands</h2>
            </div>
          </div>
          <div className="brand-strip">
            <div className="brand-cell" onClick={() => { setCurrentFilter('badminton'); scrollToSection('products'); }}>Yonex</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('tennis'); scrollToSection('products'); }}>Head</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('tennis'); scrollToSection('products'); }}>Babolat</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('tennis'); scrollToSection('products'); }}>Wilson</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('badminton'); scrollToSection('products'); }}>Li-Ning</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('cricket'); scrollToSection('products'); }}>SS</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('cricket'); scrollToSection('products'); }}>SG</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('shoes'); scrollToSection('products'); }}>Adidas</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('shoes'); scrollToSection('products'); }}>Puma</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('football'); scrollToSection('products'); }}>Nivia</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('fitness'); scrollToSection('products'); }}>Cosco</div>
            <div className="brand-cell" onClick={() => { setCurrentFilter('shoes'); scrollToSection('products'); }}>Asics</div>
          </div>
        </div>
      </section>

      {/* 9. PERFORMANCE BANNER */}
      <section className="perf-banner">
        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=80&auto=format&fit=crop" alt="Performance training" />
        <div className="perf-content">
          <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>Gear Up for Victory</span>
          <h2>Equip Your Game.</h2>
          <p>Premium multi-sport equipment engineered for players, clubs, and sports academies — built for performance that lasts season after season.</p>
          <button className="btn btn-gold" onClick={() => scrollToSection('products')}>
            Browse All Products
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </section>

      {/* 10. WHY CHHABRA SPORTS */}
      <section className="section tight">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">The Chhabra Standard</span>
              <h2>Why Athletes Choose Us</h2>
            </div>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <svg viewBox="0 0 24 24">
                <path d="M12 2l2.4 6.9L21 9.3l-5.4 4.4 2 7.1-5.6-4-5.6 4 2-7.1L3 9.3l6.6-.4z" />
              </svg>
              <h4>100% Genuine</h4>
              <p>Official brand serial numbers & invoices direct from authorized distributors.</p>
            </div>
            <div className="why-card">
              <svg viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <h4>Specialist Checked</h4>
              <p>Every racquet & bat is weighed and balance-checked by experts before shipping.</p>
            </div>
            <div className="why-card">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="10" rx="1" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h4>Secure Checkout</h4>
              <p>256-bit encrypted payments with UPI, Credit Cards, NetBanking & COD.</p>
            </div>
            <div className="why-card">
              <svg viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <h4>Express Dispatch</h4>
              <p>Shipped within 24 hours with live tracking link delivered via SMS.</p>
            </div>
            <div className="why-card">
              <svg viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 1 1-6.2-8.56" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
              <h4>Easy Returns</h4>
              <p>15-day hassle-free replacement on unused racquets & footwear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. PLAYER TESTIMONIALS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">Player Reviews</span>
              <h2>Verified Reviews from Players</h2>
            </div>
          </div>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>"Ordered a Head Speed MP tennis racquet — serial code verified on the official site! The string tension requested was spot on."</p>
              <div className="testi-who">
                <div>
                  <div className="testi-name">Vikramaditya Roy</div>
                  <div className="testi-prod">Head Speed MP Tennis Racquet</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>"Got my Yonex Astrox racquet strung with BG65 at 26lbs. Exceptional stringing quality and super quick delivery to Bangalore."</p>
              <div className="testi-who">
                <div>
                  <div className="testi-name">Ananya Sharma</div>
                  <div className="testi-prod">Yonex Astrox 88D Pro</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★☆</div>
              <p>"SS Ton English willow bat arrived oiled and pre-knocked. Grain line was straight and balance was perfect for my stance."</p>
              <div className="testi-who">
                <div>
                  <div className="testi-name">Rohit Malhotra</div>
                  <div className="testi-prod">SS Ton Reserve Willow Bat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. NEWSLETTER */}
      <section className="newsletter">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>Racquet & Sports Club</span>
          <h2>Join the Players Club</h2>
          <p>Restock alerts, stringing tips & exclusive discount codes straight to your inbox.</p>
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Players Club!'); }}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
