import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { ShoppingCart, Heart, Layers, X, Check, Eye } from 'lucide-react';
import { getImageUrl, parseProductImages } from '../../utils/image.util';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  // Safe Multi-Image Extraction
  const allImages = parseProductImages(product);

  const primaryImage = selectedVariant?.imageUrl
    ? getImageUrl(selectedVariant.imageUrl)
    : allImages[0];

  const secondaryImage = allImages.length > 1 && allImages[1] !== primaryImage
    ? allImages[1]
    : null;

  const isOutOfStock = product.stock <= 0;
  const wishlisted = isInWishlist(product.id);

  const handleNavToDetail = () => {
    navigate(`/product/${product.id}`);
  };

  // Active Variant and Pricing Calculation
  const activeVariant = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : null);
  const activeImage = activeVariant?.imageUrl
    ? getImageUrl(activeVariant.imageUrl)
    : primaryImage;

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentMrp = activeVariant ? (activeVariant.mrp || product.mrp) : product.mrp;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const variantOutOfStock = (currentStock || 0) <= 0;

  const handleCardButtonClick = (e) => {
    e.stopPropagation();
    if (product.hasVariants && product.variants?.length > 0) {
      if (!selectedVariant) {
        setSelectedVariant(product.variants[0]);
      }
      setShowVariantModal(true);
    } else {
      addToCart(product.id, 1, null, product);
    }
  };

  const handleAddSelectedVariantToCart = () => {
    const targetVariant = activeVariant;
    if (!targetVariant) return;
    addToCart(product.id, 1, targetVariant.id, product);
    setShowVariantModal(false);
  };

  return (
    <>
      <div className="prod-card" style={{ cursor: 'pointer' }}>
        
        {/* MEDIA CONTAINER */}
        <div className="prod-media" onClick={handleNavToDetail}>
          <span
            className="prod-tag"
            style={{ background: isOutOfStock ? 'var(--oxblood)' : 'var(--pitch)' }}
          >
            {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
          </span>

          {/* Wishlist Heart Icon */}
          <button
            className={`prod-wish ${wishlisted ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label="Wishlist toggle"
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={16} fill={wishlisted ? 'var(--oxblood)' : 'none'} color={wishlisted ? 'var(--oxblood)' : 'var(--ink)'} />
          </button>

          {/* Render 2 images if secondary exists, else single image that never turns white */}
          {secondaryImage ? (
            <>
              <img src={primaryImage} alt={product.name} className="primary" />
              <img src={secondaryImage} alt={`${product.name} alternate view`} className="secondary" />
            </>
          ) : (
            <img src={primaryImage} alt={product.name} className="single-img" />
          )}
        </div>

        {/* INFO CONTAINER */}
        <div className="prod-info">
          <div>
            <div className="prod-brand">
              {product.brand?.name || product.brandName || product.category?.name || 'Chhabra Sports'}
            </div>
            <h4 className="prod-name" title={product.name} onClick={handleNavToDetail}>
              {product.name}
            </h4>
            {product.description && (
              <p
                onClick={handleNavToDetail}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--ink-soft)',
                  marginTop: '4px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.3'
                }}
              >
                {product.description}
              </p>
            )}
          </div>
          <div style={{ marginTop: '14px' }}>
            <div className="prod-price" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="price-now">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span style={{ fontSize: '0.82rem', textDecoration: 'line-through', color: 'var(--ink-soft)' }}>
                    ₹{product.mrp?.toLocaleString('en-IN')}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--pitch)',
                      background: 'var(--gold)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                  </span>
                </>
              )}
            </div>
            {product.hasVariants && product.variants?.length > 0 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--gold)', marginTop: '4px', fontWeight: 600 }}>
                ⚡ {product.variants.length} Options Available
              </div>
            )}
            <button
              className="btn btn-gold"
              style={{ width: '100%', marginTop: '12px', justifyContent: 'center', padding: '10px', fontSize: '11px' }}
              disabled={isOutOfStock}
              onClick={handleCardButtonClick}
            >
              {product.hasVariants && product.variants?.length > 0 ? (
                <>
                  <Layers size={14} />
                  <span>Select Option</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={15} />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* -------------------- 🛍️ CUSTOMER VARIANT SELECTOR MODAL -------------------- */}
      {showVariantModal && (
        <div
          className="cart-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 36, 28, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => setShowVariantModal(false)}
        >
          <div
            className="auth-card"
            style={{
              maxWidth: '460px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#ffffff',
              border: '1px solid var(--line, #DBD5C5)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              color: 'var(--ink, #141916)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--gold-dark, #A07022)',
                    fontWeight: 800,
                    letterSpacing: '1px'
                  }}
                >
                  {product.brand?.name || product.brandName || 'Chhabra Sports'}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '3px 0 0 0', color: 'var(--pitch, #11362B)' }}>
                  {product.name}
                </h3>
              </div>
              <button
                className="icon-btn"
                onClick={() => setShowVariantModal(false)}
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  color: 'var(--ink, #141916)',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Image & Selected Preview */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', background: 'var(--parchment, #F8F6F0)', padding: '12px', borderRadius: '12px' }}>
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid var(--line, #DBD5C5)',
                  background: '#ffffff'
                }}
              />
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--pitch, #11362B)' }}>
                  ₹{currentPrice?.toLocaleString('en-IN')}
                </div>
                {currentMrp && currentMrp > currentPrice && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                    <span style={{ textDecoration: 'line-through', fontSize: '0.82rem', color: 'var(--ink-soft, #454D47)' }}>
                      ₹{currentMrp?.toLocaleString('en-IN')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: 'var(--pitch, #11362B)',
                        background: 'var(--gold, #D49B3A)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      -{Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}% OFF
                    </span>
                  </div>
                )}
                <div style={{ fontSize: '0.78rem', marginTop: '5px', color: variantOutOfStock ? 'var(--oxblood, #8B1E1E)' : '#059669', fontWeight: 700 }}>
                  {variantOutOfStock ? '● Out of Stock' : `● In Stock (${currentStock} available)`}
                </div>
              </div>
            </div>

            {/* Variant Options Pills */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--ink, #141916)', display: 'block', marginBottom: '10px' }}>
                Select Size / Option:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {(product.variants || []).map((v) => {
                  const isSelected = activeVariant?.id === v.id;
                  const isVarOut = (v.stock || 0) <= 0;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isVarOut}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: isSelected
                          ? '2px solid var(--gold, #D49B3A)'
                          : '1px solid var(--line, #DBD5C5)',
                        background: isSelected
                          ? 'rgba(212, 155, 58, 0.12)'
                          : isVarOut
                          ? 'rgba(0, 0, 0, 0.03)'
                          : '#ffffff',
                        color: isVarOut ? '#9ca3af' : 'var(--ink, #141916)',
                        cursor: isVarOut ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '5px solid var(--gold, #D49B3A)' : '2px solid var(--line, #DBD5C5)',
                            background: '#ffffff',
                            flexShrink: 0
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: isSelected ? 800 : 700, fontSize: '0.92rem', color: isSelected ? 'var(--pitch, #11362B)' : 'var(--ink, #141916)' }}>
                            {v.title || v.sku || 'Standard Option'}
                          </div>
                          {v.sku && (
                            <div style={{ fontSize: '11px', color: 'var(--ink-soft, #454D47)' }}>
                              SKU: {v.sku}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: 'var(--pitch, #11362B)', fontSize: '0.95rem' }}>
                          ₹{v.price?.toLocaleString('en-IN')}
                        </div>
                        {isVarOut ? (
                          <span style={{ fontSize: '11px', color: 'var(--oxblood, #8B1E1E)', fontWeight: 600 }}>Sold Out</span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>{v.stock} in stock</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-outline"
                style={{
                  flex: 1,
                  padding: '11px',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--line, #DBD5C5)',
                  background: 'transparent',
                  color: 'var(--ink-soft, #454D47)',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
                onClick={() => setShowVariantModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{
                  flex: 2,
                  padding: '11px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '8px',
                  background: 'var(--pitch, #11362B)',
                  borderColor: 'var(--pitch, #11362B)',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: variantOutOfStock ? 'not-allowed' : 'pointer',
                  opacity: variantOutOfStock ? 0.6 : 1
                }}
                disabled={variantOutOfStock}
                onClick={handleAddSelectedVariantToCart}
              >
                <ShoppingCart size={16} />
                <span>{variantOutOfStock ? 'Out of Stock' : `Add to Cart • ₹${currentPrice?.toLocaleString('en-IN')}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
