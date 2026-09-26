import React from 'react';
import ProductCard from './ProductCard';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

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
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn-secondary"
            disabled={!pagination.hasPrevPage}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={18} />
            <span>Prev</span>
          </button>

          <span style={{ fontWeight: 600 }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            className="btn-secondary"
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(page + 1)}
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
