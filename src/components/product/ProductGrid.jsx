import React from 'react';
import ProductCard from './ProductCard';
import Pagination from '../common/Pagination';
import { ShoppingBag } from 'lucide-react';

const ProductGrid = ({ products, pagination, page, onPageChange }) => {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">
          <ShoppingBag size={22} color="var(--primary)" />
          <span>Featured Products</span>
        </h2>
        {pagination && (
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing {products.length} of {pagination.totalCount} Products
          </span>
        )}
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)', borderRadius: '16px' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Koi product nahi mila!</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Server-side Pagination Controls */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage || page}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          limit={pagination.limit || 12}
          onPageChange={onPageChange}
          scrollToTop={false}
        />
      )}
    </section>
  );
};

export default ProductGrid;
