import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const imageSrc = product.imageUrl
    ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`)
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="prod-card">
      <div className="prod-media">
        <span className="prod-tag" style={{ background: isOutOfStock ? 'var(--oxblood)' : 'var(--pitch)' }}>
          {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
        </span>
        <img src={imageSrc} alt={product.name} />
      </div>

      <div className="prod-info">
        <div>
          <div className="prod-brand">
            {product.brand?.name || product.brandName || product.brand || product.category?.name || 'Chhabra Sports'}
          </div>
          <h4 className="prod-name">{product.name}</h4>
          {product.description && (
            <p style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted, #a0a0a0)',
              marginTop: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.3'
            }}>
              {product.description}
            </p>
          )}
        </div>
        <div style={{ marginTop: '14px' }}>
          <div className="prod-price">
            <span className="price-now">₹{product.price}</span>
          </div>
          <button
            className="btn btn-gold"
            style={{ width: '100%', marginTop: '12px', justifyContent: 'center', padding: '10px' }}
            disabled={isOutOfStock}
            onClick={() => addToCart(product.id, 1)}
          >
            <ShoppingCart size={16} />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
