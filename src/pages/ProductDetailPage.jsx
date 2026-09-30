import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getImageUrl, parseProductImages } from '../utils/image.util';
import ProductCard from '../components/product/ProductCard';
import {
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Star,
  Check,
  ChevronRight,
  Share2,
  Award,
  Layers,
  PhoneCall
} from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToast, setAddedToast] = useState(false);

  // TanStack Query: Fetch Product by ID
  const { data: productData, isLoading: loading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await API.get(`/products/${id}`);
      const prodData = res.data?.data || res.data;
      if (!prodData) throw new Error('Product not found');
      return prodData;
    }
  });

  // TanStack Query: Related products
  const { data: relatedList = [] } = useQuery({
    queryKey: ['related-products', productData?.categoryId, id],
    queryFn: async () => {
      if (!productData?.categoryId) return [];
      const res = await API.get(`/products?categoryId=${productData.categoryId}`);
      const list = res.data?.data || res.data || [];
      return list.filter((p) => String(p.id) !== String(id)).slice(0, 4);
    },
    enabled: !!productData?.categoryId
  });

  useEffect(() => {
    if (productData) {
      setProduct(productData);

      // Extract images
      const imgs = parseProductImages(productData);
      setSelectedImage(imgs[0]);

      // Set default variant or color/size
      if (productData.variants && productData.variants.length > 0) {
        const sorted = [...productData.variants].sort((a, b) => {
          const numA = parseFloat((a.title || '').replace(/[^0-9.]/g, ''));
          const numB = parseFloat((b.title || '').replace(/[^0-9.]/g, ''));
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return (a.title || '').localeCompare(b.title || '');
        });
        setSelectedVariant(sorted[0]);
      }
    }
  }, [productData]);

  useEffect(() => {
    setRelatedProducts(relatedList);
  }, [relatedList]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="court-pattern" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              border: '3px solid rgba(212, 155, 58, 0.2)',
              borderTop: '3px solid var(--gold)',
              borderRadius: '50%',
              animation: 'spinRing 0.8s linear infinite',
              margin: '0 auto 16px'
            }}
          ></div>
          <p style={{ fontFamily: 'Space Mono', fontSize: '12px', color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Loading Racquet Details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 className="display" style={{ color: 'var(--pitch)', fontSize: '28px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: '8px' }}>The product you are looking for does not exist or has been removed.</p>
        <NavLink to="/products" className="btn btn-gold" style={{ marginTop: '20px', display: 'inline-flex' }}>
          Back to Store Products
        </NavLink>
      </div>
    );
  }

  const allImages = parseProductImages(product);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMrp = selectedVariant ? (selectedVariant.mrp || product.mrp) : product.mrp;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;
  const wishlisted = isInWishlist(product.id);

  const discountPercent = currentMrp && currentMrp > currentPrice
    ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity, selectedVariant?.id, product);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity, selectedVariant?.id, product);
  };

  // Parse dynamic JSON specifications from product
  let parsedDynamicSpecs = {};
  if (product.specifications) {
    if (typeof product.specifications === 'string') {
      try {
        parsedDynamicSpecs = JSON.parse(product.specifications);
      } catch (e) {}
    } else if (typeof product.specifications === 'object') {
      parsedDynamicSpecs = product.specifications;
    }
  }

  // Dynamic specifications matrix
  const specifications = [
    { label: 'Brand', value: product.brand?.name || product.brandName || 'Chhabra Sports Original' },
    { label: 'Category', value: product.category?.name || 'Sports Equipment' },
    ...Object.entries(parsedDynamicSpecs).map(([label, value]) => ({ label, value }))
  ];

  return (
    <div className="court-pattern" style={{ paddingBottom: '80px' }}>
      
      {/* Toast alert */}
      {addedToast && (
        <div className="toast show" style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 99999 }}>
          <Check size={18} color="var(--gold)" />
          <span>Product added to your shopping cart!</span>
        </div>
      )}

      {/* BREADCRUMB NAVIGATION */}
      <div style={{ background: 'var(--parchment-dim)', borderBottom: '1px solid var(--line)', padding: '14px 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink-soft)' }}>
            <NavLink to="/" style={{ color: 'var(--ink-soft)' }}>Home</NavLink>
            <ChevronRight size={14} color="var(--gold-dark)" />
            <NavLink to="/products" style={{ color: 'var(--ink-soft)' }}>Products</NavLink>
            {product.category && (
              <>
                <ChevronRight size={14} color="var(--gold-dark)" />
                <span style={{ color: 'var(--ink-soft)' }}>{product.category.name}</span>
              </>
            )}
            <ChevronRight size={14} color="var(--gold-dark)" />
            <span style={{ fontWeight: 700, color: 'var(--pitch)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN PRODUCT DETAIL SECTION */}
      <div className="wrap" style={{ marginTop: '36px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'start'
          }}
        >
          {/* LEFT COLUMN: IMAGE GALLERY */}
          <div style={{ position: 'sticky', top: '96px' }}>
            
            {/* Featured Main Image Preview Box */}
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-md)',
                aspectRatio: '1/1'
              }}
            >
              {/* Authenticity Tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'var(--pitch-dark)',
                  color: 'var(--gold)',
                  fontSize: '11px',
                  fontFamily: 'Space Mono',
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <ShieldCheck size={14} />
                <span>100% GENUINE GUARANTEE</span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s'
                }}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={20} fill={wishlisted ? 'var(--oxblood)' : 'none'} color={wishlisted ? 'var(--oxblood)' : 'var(--ink)'} />
              </button>

              <img
                src={selectedImage || getImageUrl(allImages[0])}
                alt={product.name}
                decoding="async"
                fetchPriority="high"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>

            {/* THUMBNAIL SELECTOR STRIP */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {allImages.map((imgUrl, index) => {
                  const isSelected = selectedImage === imgUrl;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imgUrl)}
                      style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        border: isSelected ? '2px solid var(--gold-dark)' : '1px solid var(--line)',
                        background: 'var(--white)',
                        cursor: 'pointer',
                        padding: 0,
                        flexShrink: 0,
                        boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                        opacity: isSelected ? 1 : 0.7,
                        transition: 'all 0.2s'
                      }}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${index + 1}`} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRODUCT DETAILS & BUYING OPTIONS */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span className="eyebrow" style={{ color: 'var(--gold-dark)' }}>
                {product.brand?.name || product.brandName || product.category?.name || 'CHHABRA SPORTS'}
              </span>
              <h1
                className="display"
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                  fontWeight: 800,
                  color: 'var(--pitch)',
                  marginTop: '6px',
                  lineHeight: 1.2
                }}
              >
                {product.name}
              </h1>

              {/* Rating & In-Stock Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', padding: '4px 10px', borderRadius: '4px' }}>
                  <Star size={15} fill="#D97706" color="#D97706" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>4.9</span>
                  <span style={{ fontSize: '12px', color: '#B45309' }}>(124 Ratings)</span>
                </div>

                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    fontFamily: 'Space Mono',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: isOutOfStock ? '#FEE2E2' : '#DCFCE7',
                    color: isOutOfStock ? '#991B1B' : '#166534'
                  }}
                >
                  {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK & READY TO SHIP'}
                </span>
              </div>
            </div>

            {/* PRICE CONTAINER */}
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '20px 24px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                <span className="display" style={{ fontSize: '32px', fontWeight: 900, color: 'var(--pitch)' }}>
                  ₹{currentPrice?.toLocaleString('en-IN')}
                </span>
                {currentMrp && currentMrp > currentPrice && (
                  <>
                    <span style={{ fontSize: '18px', textDecoration: 'line-through', color: 'var(--ink-soft)' }}>
                      ₹{currentMrp?.toLocaleString('en-IN')}
                    </span>
                    <span
                      style={{
                        background: 'var(--oxblood)',
                        color: 'var(--white)',
                        fontFamily: 'Space Mono',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '6px' }}>
                Inclusive of all taxes. Free Express Pan-India Delivery on orders over ₹2,999.
              </p>
            </div>

            {/* VARIANTS SELECTION (IF ANY) */}
            {product.variants && product.variants.length > 0 && (() => {
              const sortedVariants = [...product.variants].sort((a, b) => {
                const numA = parseFloat((a.title || '').replace(/[^0-9.]/g, ''));
                const numB = parseFloat((b.title || '').replace(/[^0-9.]/g, ''));
                if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                return (a.title || '').localeCompare(b.title || '');
              });

              const hasSizes = sortedVariants.some(
                (v) =>
                  (v.title && v.title.toLowerCase().includes('size')) ||
                  (v.attributes && v.attributes.includes('Size'))
              );
              const optionGroupLabel = hasSizes ? 'Select Size' : 'Select Option / Specification';

              return (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink)', letterSpacing: '0.5px' }}>
                      {optionGroupLabel}:{' '}
                      <span style={{ color: 'var(--pitch)', background: 'rgba(212, 155, 58, 0.18)', padding: '2px 8px', borderRadius: '4px', marginLeft: '4px' }}>
                        {selectedVariant?.title || selectedVariant?.name || 'Default Option'}
                      </span>
                    </label>
                    {selectedVariant && (
                      <span style={{ fontSize: '12px', fontWeight: 700, color: (selectedVariant.stock || 0) > 0 ? '#059669' : 'var(--oxblood)' }}>
                        {(selectedVariant.stock || 0) > 0 ? `● In Stock (${selectedVariant.stock} units)` : '● Out of Stock'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {sortedVariants.map((v) => {
                      const isSel = selectedVariant?.id === v.id;
                      const isVarOut = (v.stock || 0) <= 0;
                      const displayTitle = v.title || v.name || v.sku || 'Option';

                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={isVarOut}
                          onClick={() => {
                            setSelectedVariant(v);
                            if (v.imageUrl) setSelectedImage(getImageUrl(v.imageUrl));
                          }}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: isSel ? '2px solid var(--pitch)' : '1px solid var(--line)',
                            background: isSel ? 'var(--pitch)' : (isVarOut ? 'rgba(0,0,0,0.03)' : '#ffffff'),
                            color: isSel ? '#ffffff' : (isVarOut ? '#9ca3af' : 'var(--ink)'),
                            cursor: isVarOut ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '3px',
                            minWidth: '84px',
                            boxShadow: isSel ? '0 4px 14px rgba(17, 54, 43, 0.25)' : 'var(--shadow-sm)',
                            transition: 'all 0.2s ease',
                            opacity: isVarOut ? 0.5 : 1
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isSel && <Check size={13} color="var(--gold)" />}
                            <span style={{ fontWeight: 800, fontSize: '13px' }}>{displayTitle}</span>
                          </div>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: 700,
                              color: isSel ? 'var(--gold)' : 'var(--gold-dark)'
                            }}
                          >
                            ₹{v.price?.toLocaleString('en-IN')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* QUANTITY & BUY BUTTONS */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
              {/* Quantity Counter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--white)',
                  height: '48px'
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: '40px', height: '100%', background: 'none', border: 'none', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ padding: '0 16px', fontSize: '15px', fontWeight: 800, color: 'var(--pitch)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ width: '40px', height: '100%', background: 'none', border: 'none', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                className="btn btn-gold"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: '180px',
                  height: '48px',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800
                }}
              >
                <ShoppingCart size={18} />
                <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
              </button>

              {/* Buy Now */}
              <button
                className="btn btn-pitch"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  minWidth: '160px',
                  height: '48px',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800
                }}
              >
                <Zap size={18} color="var(--gold)" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* ASSURANCE & SERVICE HIGHLIGHTS */}
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Truck size={22} color="var(--gold-dark)" />
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>Pan-India Express Shipping</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', margin: 0 }}>Delivered in 2-5 business days</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <ShieldCheck size={22} color="var(--pitch)" />
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>Official Brand Warranty</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', margin: 0 }}>100% Genuine with verification code</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <RotateCcw size={22} color="var(--oxblood)" />
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>7-Day Easy Replacement</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', margin: 0 }}>Hassle-free support for defect items</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <PhoneCall size={22} color="var(--pitch-accent)" />
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>Pro Gutting Consultation</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', margin: 0 }}>Call +91-72772-52440 for custom tension</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TABS SECTION: DESCRIPTION, SPECIFICATIONS, REVIEWS */}
      <div className="wrap" style={{ marginTop: '64px' }}>
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {/* Tab Header Buttons */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', background: 'var(--parchment-dim)' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                padding: '16px 28px',
                background: activeTab === 'description' ? 'var(--white)' : 'none',
                border: 'none',
                borderBottom: activeTab === 'description' ? '3px solid var(--gold-dark)' : 'none',
                fontSize: '14px',
                fontWeight: 800,
                color: activeTab === 'description' ? 'var(--pitch)' : 'var(--ink-soft)',
                cursor: 'pointer'
              }}
            >
              Product Description
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              style={{
                padding: '16px 28px',
                background: activeTab === 'specs' ? 'var(--white)' : 'none',
                border: 'none',
                borderBottom: activeTab === 'specs' ? '3px solid var(--gold-dark)' : 'none',
                fontSize: '14px',
                fontWeight: 800,
                color: activeTab === 'specs' ? 'var(--pitch)' : 'var(--ink-soft)',
                cursor: 'pointer'
              }}
            >
              Technical Specifications
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              style={{
                padding: '16px 28px',
                background: activeTab === 'warranty' ? 'var(--white)' : 'none',
                border: 'none',
                borderBottom: activeTab === 'warranty' ? '3px solid var(--gold-dark)' : 'none',
                fontSize: '14px',
                fontWeight: 800,
                color: activeTab === 'warranty' ? 'var(--pitch)' : 'var(--ink-soft)',
                cursor: 'pointer'
              }}
            >
              Stringing & Genuine Guarantee
            </button>
          </div>

          {/* Tab Content Panels */}
          <div style={{ padding: '36px' }}>
            {activeTab === 'description' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--pitch)', marginBottom: '12px' }}>
                  Overview & Engineering Highlights
                </h3>
                <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '16px' }}>
                  {product.description ||
                    `The ${product.name} is engineered for professional and tournament players seeking maximum power, precision maneuverability, and durability. Built with high-modulus graphite and advanced dampening frame technology, this gear provides unmatched feedback on every shot.`}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  Tested and verified by certified stringers at Chhabra Sports Patna. Whether playing aggressive smashes or tactical drops, the balanced weight distribution ensures swift recovery and power transfer.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--pitch)', marginBottom: '16px' }}>
                  Detailed Technical Matrix
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {specifications.map((spec, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'var(--parchment)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'Space Mono', color: 'var(--gold-dark)', textTransform: 'uppercase', display: 'block' }}>
                        {spec.label}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pitch)', marginTop: '2px', display: 'block' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--pitch)', marginBottom: '12px' }}>
                  Pro Stringing & Authenticity Verification
                </h3>
                <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  Every product shipped from Chhabra Sports contains official holographic scratch-codes to verify 100% authenticity on the manufacturer website (Yonex / Li-Ning / Victor).
                </p>
                <div style={{ marginTop: '16px', background: '#FEF3C7', padding: '16px 20px', borderRadius: 'var(--radius)', border: '1px solid #F59E0B' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#92400E', margin: 0 }}>
                    🎾 Custom String Tension Service
                  </h4>
                  <p style={{ fontSize: '13px', color: '#B45309', margin: '4px 0 0' }}>
                    Need a custom string gutting (e.g. Yonex BG65 / BG80 at 26 lbs)? Contact our helpline at <strong>+91-72772-52440</strong> immediately after placing your order!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION ("YOU MIGHT ALSO LIKE") */}
      {relatedProducts.length > 0 && (
        <div className="wrap" style={{ marginTop: '72px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <span className="eyebrow">RECOMMENDED FOR YOU</span>
              <h2 className="display" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--pitch)', marginTop: '4px' }}>
                Related Racquets & Gear
              </h2>
            </div>
            <NavLink to="/products" className="btn btn-outline" style={{ fontSize: '12px' }}>
              View All Products
            </NavLink>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
