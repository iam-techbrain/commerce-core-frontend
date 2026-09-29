import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { ShoppingCart, Heart, Layers, X, Check } from 'lucide-react';
import { getImageUrl } from '../../utils/image.util';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const activeImage = getImageUrl(selectedVariant?.imageUrl || product.imageUrl);

  const isOutOfStock = product.stock <= 0;
  const wishlisted = isInWishlist(product.id);

  const handleCardButtonClick = () => {
    if (product.hasVariants && product.variants?.length > 0) {
      setShowVariantModal(true);
    } else {
      addToCart(product.id, 1);
    }
  };

  const handleAddSelectedVariantToCart = () => {
    if (!selectedVariant) return;
    addToCart(product.id, 1, selectedVariant.id);
    setShowVariantModal(false);
  };

  // Active pricing to display
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMrp = selectedVariant ? (selectedVariant.mrp || product.mrp) : product.mrp;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const variantOutOfStock = currentStock <= 0;

  return (
    <>
      <div className="prod-card">
        <div className="prod-media">
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

          <img src={activeImage} alt={product.name} />
        </div>

        <div className="prod-info">
          <div>
            <div className="prod-brand">
              {product.brand?.name || product.brandName || product.category?.name || 'Chhabra Sports'}
            </div>
            <h4 className="prod-name" title={product.name}>{product.name}</h4>
            {product.description && (
              <p
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
        <div className="cart-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div
            className="auth-card"
            style={{
              maxWidth: '460px',
              width: '92%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--card-bg, #1a1e1b)',
              border: '1px solid var(--gold)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    fontWeight: 700,
                    letterSpacing: '1px'
                  }}
                >
                  {product.brand?.name || product.brandName || 'Chhabra Sports'}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2px 0 0 0', color: '#ffffff' }}>
                  {product.name}
                </h3>
              </div>
              <button
                className="icon-btn"
                onClick={() => setShowVariantModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Product Image & Selected Preview */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid rgba(201, 168, 76, 0.4)'
                }}
              />
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold)' }}>
                  ₹{currentPrice?.toLocaleString('en-IN')}
                </div>
                {currentMrp && currentMrp > currentPrice && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: '#9ca3af' }}>
                      ₹{currentMrp?.toLocaleString('en-IN')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--pitch)',
                        background: 'var(--gold)',
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}
                    >
                      -{Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}% OFF
                    </span>
                  </div>
                )}
                <div style={{ fontSize: '0.78rem', marginTop: '4px', color: variantOutOfStock ? 'var(--danger)' : '#22c55e', fontWeight: 600 }}>
                  {variantOutOfStock ? '● Out of Stock' : `● In Stock (${currentStock} available)`}
                </div>
              </div>
            </div>

            {/* Variant Options Pills */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', display: 'block', marginBottom: '8px' }}>
                Select Option / Variant:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isVarOut = v.stock <= 0;

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
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: isSelected
                          ? '2px solid var(--gold)'
                          : '1px solid rgba(255, 255, 255, 0.12)',
                        background: isSelected
                          ? 'rgba(201, 168, 76, 0.15)'
                          : isVarOut
                          ? 'rgba(255, 255, 255, 0.02)'
                          : 'rgba(255, 255, 255, 0.06)',
                        color: isVarOut ? '#6b7280' : '#ffffff',
                        cursor: isVarOut ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '5px solid var(--gold)' : '2px solid rgba(255, 255, 255, 0.4)',
                            background: isSelected ? '#ffffff' : 'transparent',
                            flexShrink: 0
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: isSelected ? 700 : 600, fontSize: '0.88rem', color: isSelected ? 'var(--gold)' : '#ffffff' }}>
                            {v.title}
                          </div>
                          {v.sku && (
                            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                              SKU: {v.sku}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '0.9rem' }}>
                          ₹{v.price?.toLocaleString('en-IN')}
                        </div>
                        {isVarOut ? (
                          <span style={{ fontSize: '0.68rem', color: 'var(--danger)' }}>Sold Out</span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', color: '#4ade80' }}>{v.stock} in stock</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-outline"
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                onClick={() => setShowVariantModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{
                  flex: 2,
                  padding: '10px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
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
