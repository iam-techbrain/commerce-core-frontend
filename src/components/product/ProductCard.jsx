import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const imageSrc = product.imageUrl
    ? product.imageUrl.startsWith('http')
      ? product.imageUrl
      : `http://localhost:5000${product.imageUrl}`
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

  const isOutOfStock = product.stock <= 0;
  const wishlisted = isInWishlist(product.id);

  return (
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

        <img src={imageSrc} alt={product.name} />
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
            onClick={() => addToCart(product.id, 1)}
          >
            <ShoppingCart size={15} />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
